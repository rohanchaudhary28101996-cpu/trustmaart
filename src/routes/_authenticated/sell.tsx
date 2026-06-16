import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Upload, X, Loader2, ImagePlus, Camera } from "lucide-react";
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

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
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
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

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
        const dataUrl = await fileToDataUrl(f);
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
    if (!title.trim() || title.trim().length < 3) return toast.error("Add a title");
    if (images.length === 0) return toast.error("Add at least 1 photo");
    setSubmitting(true);
    try {
      const res = await createListing({
        data: {
          type: "product",
          title: title.trim(),
          description: description.trim() || undefined,
          price: price ? Number(price) : null,
          is_negotiable: negotiable,
          condition: (condition || null) as Cond | null,
          brand: brand.trim() || undefined,
          category_id: categoryId || null,
          city: city.trim() || undefined,
          state: state.trim() || undefined,
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
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} required />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} maxLength={4000} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input id="price" type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
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
              <Label>Category</Label>
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
              <Label>Condition</Label>
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
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} maxLength={80} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} maxLength={120} />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" value={state} onChange={(e) => setState(e.target.value)} maxLength={120} />
            </div>
          </div>

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
