import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Sparkles, Upload, X, Loader2, ImagePlus, Camera, Loader } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppImage } from "@/components/AppImage";
import { supabase } from "@/integrations/supabase/client";
import { createListing, getCategories } from "@/lib/listings.functions";
import { generateListing } from "@/lib/ai.functions";

const MAX_IMAGES = 10;
const MAX_AI_PHOTOS = 4;

export const Route = createFileRoute("/_authenticated/sell")({
  component: SellPage,
});

type Cond = "new" | "like_new" | "good" | "fair" | "used";

// Downscale to a max dimension before sending to the AI — the model only
// needs to recognize the product, not full camera resolution.
function fileToResizedDataUrl(file: File, maxDim = 1024, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

function SellPage() {
  const navigate = useNavigate();
  const { data: cats = [] } = useQuery({ queryKey: ["categories"], queryFn: () => getCategories() });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [negotiable, setNegotiable] = useState(true);
  const [condition, setCondition] = useState<Cond | "">("good");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincodeLookupLoading, setPincodeLookupLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!/^\d{6}$/.test(pincode)) return;
    let active = true;
    setPincodeLookupLoading(true);
    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        const office = data?.[0]?.PostOffice?.[0];
        if (data?.[0]?.Status === "Success" && office) {
          setCity(office.District || office.Name || "");
          setState(office.State || "");
        } else {
          toast.error("Couldn't find that pincode. Enter city/state manually.");
        }
      })
      .catch(() => {
        if (active) toast.error("Couldn't look up pincode. Enter city/state manually.");
      })
      .finally(() => {
        if (active) setPincodeLookupLoading(false);
      });
    return () => {
      active = false;
    };
  }, [pincode]);

  // AI helper state
  const [aiNotes, setAiNotes] = useState("");
  const [aiPhotos, setAiPhotos] = useState<{ dataUrl: string; file: File }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const filteredCats = cats.filter((c) => c.type === "product");

  async function onAiPhotos(files: FileList | null) {
    if (!files || !files.length) return;
    const remaining = MAX_AI_PHOTOS - aiPhotos.length;
    if (remaining <= 0) {
      toast.error(`Up to ${MAX_AI_PHOTOS} reference photos for AI`);
      return;
    }
    const arr = Array.from(files).slice(0, remaining);
    const added: { dataUrl: string; file: File }[] = [];
    for (const f of arr) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
        toast.error(`${f.name} is not a supported image`);
        continue;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name} is larger than 5MB`);
        continue;
      }
      try {
        const dataUrl = await fileToResizedDataUrl(f);
        added.push({ dataUrl, file: f });
      } catch (e) {
        toast.error((e as Error).message);
      }
    }
    setAiPhotos((prev) => [...prev, ...added]);
  }

  function removeAiPhoto(idx: number) {
    setAiPhotos((prev) => prev.filter((_, i) => i !== idx));
  }

  async function uploadAiPhotosToListing() {
    if (aiPhotos.length === 0) return;
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id;
    if (!uid) return;
    const uploaded: string[] = [];
    for (const { file: f } of aiPhotos.slice(0, remaining)) {
      const ext = f.name.split(".").pop() || "jpg";
      const path = `${uid}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage
        .from("listing-images")
        .upload(path, f, { upsert: false, contentType: f.type });
      if (!error) uploaded.push(path);
    }
    if (uploaded.length) setImages((prev) => [...prev, ...uploaded]);
  }

  async function onUpload(files: FileList | null) {
    if (!files || !files.length) return;
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }
    const arr = Array.from(files).slice(0, remaining);
    setUploading(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) throw new Error("Not signed in");
      const uploaded: string[] = [];
      for (const f of arr) {
        if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
          toast.error(`${f.name} is not a supported image`);
          continue;
        }
        if (f.size > 5 * 1024 * 1024) {
          toast.error(`${f.name} is larger than 5MB`);
          continue;
        }
        const ext = f.name.split(".").pop() || "jpg";
        const path = `${uid}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage.from("listing-images").upload(path, f, {
          upsert: false, contentType: f.type,
        });
        if (error) { toast.error(error.message); continue; }
        uploaded.push(path);
      }
      setImages((prev) => [...prev, ...uploaded]);
    } finally {
      setUploading(false);
    }
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  async function runAi() {
    if (!aiNotes.trim() && aiPhotos.length === 0) {
      toast.error("Add a few words or upload a photo first");
      return;
    }
    setAiLoading(true);
    try {
      const out = await generateListing({
        data: {
          notes: aiNotes,
          imageDataUrls: aiPhotos.map((p) => p.dataUrl),
        },
      });
      setTitle(out.title);
      setDescription(out.description);
      if (out.suggested_price_inr) setPrice(String(out.suggested_price_inr));
      if (out.condition) setCondition(out.condition as Cond);
      const match = cats.find((c) => c.slug === out.category_slug && c.type === "product");
      if (match) setCategoryId(match.id);
      // Upload the AI reference photos as listing images so user doesn't repeat
      await uploadAiPhotosToListing();
      toast.success("AI filled the form. Review and adjust.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setAiLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (images.length === 0) return toast.error("Add at least 1 photo");
    if (!title.trim() || title.trim().length < 3) return toast.error("Add a title (at least 3 characters)");
    if (!description.trim() || description.trim().length < 10) return toast.error("Add a description (at least 10 characters)");
    if (!price || Number(price) <= 0) return toast.error("Add a valid price");
    if (!categoryId) return toast.error("Choose a category");
    if (!condition) return toast.error("Choose a condition");
    if (!brand.trim()) return toast.error("Add a brand");
    if (!/^\d{6}$/.test(pincode)) return toast.error("Add a valid 6-digit pincode");
    if (!city.trim()) return toast.error("City is required");
    if (!state.trim()) return toast.error("State is required");
    setSubmitting(true);
    try {
      const res = await createListing({
        data: {
          type: "product",
          title: title.trim(),
          description: description.trim(),
          price: Number(price),
          is_negotiable: negotiable,
          condition: condition as Cond,
          brand: brand.trim(),
          category_id: categoryId,
          pincode,
          city: city.trim(),
          state: state.trim(),
          images,
        },
      });
      toast.success("Listing submitted for review!");
      navigate({ to: "/listing/$id", params: { id: res.id } });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Post your ad</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sell faster with AI — upload a photo or describe your item and we'll fill the form for you.
          </p>
        </header>

        {/* AI helper */}
        <div className="mb-6 rounded-2xl border bg-card/60 p-4 shadow-card">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" /> AI listing assistant
          </div>

          {/* AI photo strip */}
          <div className="mb-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
            {aiPhotos.map((p, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                <img src={p.dataUrl} alt={`Reference ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeAiPhoto(i)}
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-background/85 text-foreground shadow"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {aiPhotos.length < MAX_AI_PHOTOS && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-[10px] text-muted-foreground hover:bg-secondary/50">
                <Camera className="h-5 w-5" />
                <span>Add photo</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={(e) => onAiPhotos(e.target.files)}
                />
              </label>
            )}
          </div>

          <Textarea
            placeholder="Optional: e.g. iPhone 13 128GB, blue, 1 year old, with box and charger"
            value={aiNotes}
            onChange={(e) => setAiNotes(e.target.value)}
            rows={2}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Upload a photo and AI will identify the product, write a title, description, suggest a price, and pick a category. Your photos are also added to the listing.
          </p>
          <div className="mt-2 flex justify-end">
            <Button
              type="button"
              onClick={runAi}
              disabled={aiLoading || (aiPhotos.length === 0 && aiNotes.trim().length === 0)}
              className="gradient-primary text-primary-foreground"
            >
              {aiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate listing
            </Button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border bg-card p-5 shadow-card">
          {/* Photos */}
          <div>
            <Label className="mb-2 block">Photos ({images.length}/{MAX_IMAGES})</Label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {images.map((p, i) => (
                <div key={p} className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                  <AppImage bucket="listing-images" path={p} alt={`Photo ${i + 1}`} className="h-full w-full" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-background/85 text-foreground shadow"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 rounded-full bg-primary px-2 text-[10px] font-medium text-primary-foreground">
                      Cover
                    </span>
                  )}
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs text-muted-foreground hover:bg-secondary/50">
                  {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
                  <span>{uploading ? "Uploading…" : "Add"}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => onUpload(e.target.files)}
                  />
                </label>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Up to 10 photos. First photo is the cover.</p>
          </div>

          <div>
            <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} required minLength={3} />
          </div>

          <div>
            <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} maxLength={4000} required minLength={10} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="price">Price (₹) <span className="text-destructive">*</span></Label>
              <Input id="price" type="number" min="1" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="flex items-end gap-3">
              <div className="flex items-center gap-2">
                <Switch id="neg" checked={negotiable} onCheckedChange={setNegotiable} />
                <Label htmlFor="neg">Negotiable</Label>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Category <span className="text-destructive">*</span></Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger><SelectValue placeholder="Choose category" /></SelectTrigger>
                <SelectContent>
                  {filteredCats.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name_en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Condition <span className="text-destructive">*</span></Label>
              <Select value={condition} onValueChange={(v) => setCondition(v as Cond)}>
                <SelectTrigger><SelectValue placeholder="Condition" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like_new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="brand">Brand <span className="text-destructive">*</span></Label>
            <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} maxLength={80} required />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="pincode">Pincode <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Input
                  id="pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="e.g. 400001"
                  required
                />
                {pincodeLookupLoading && (
                  <Loader className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} maxLength={120} required />
            </div>
            <div>
              <Label htmlFor="state">State <span className="text-destructive">*</span></Label>
              <Input id="state" value={state} onChange={(e) => setState(e.target.value)} maxLength={120} required />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Enter your pincode and we'll fill in city &amp; state automatically — you can still edit them.</p>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => navigate({ to: "/" })}>Cancel</Button>
            <Button type="submit" size="lg" disabled={submitting} className="gradient-primary text-primary-foreground">
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Publish listing
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
