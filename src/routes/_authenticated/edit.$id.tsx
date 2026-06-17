import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getListing, updateListing } from "@/lib/listings.functions";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/edit/$id")({
  component: EditListingPage,
});

type Cond = "new" | "like_new" | "good" | "fair" | "used";

function EditListingPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [condition, setCondition] = useState<Cond | "">("");
  const [city, setCity] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getListing({ data: { id } });
        if (!res || !res.listing) {
          toast.error("Listing not found");
          navigate({ to: "/dashboard" });
          return;
        }
        if (res.listing.owner_id !== user?.id) {
          toast.error("You do not own this listing");
          navigate({ to: "/dashboard" });
          return;
        }
        if (!cancelled) {
          setTitle(res.listing.title ?? "");
          setDescription(res.listing.description ?? "");
          setPrice(res.listing.price !== null ? String(res.listing.price) : "");
          setCondition((res.listing.condition as Cond) ?? "");
          setCity(res.listing.city ?? "");
        }
      } catch (e) {
        toast.error((e as Error).message);
        navigate({ to: "/dashboard" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, user?.id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || title.trim().length < 3) return toast.error("Add a title (min 3 chars)");
    setSubmitting(true);
    try {
      await updateListing({
        data: {
          id,
          title: title.trim(),
          description: description.trim() || undefined,
          price: price ? Number(price) : null,
          condition: (condition || null) as Cond | null,
          city: city.trim() || undefined,
        },
      });
      toast.success("Listing updated");
      navigate({ to: "/listing/$id", params: { id } });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Edit listing</h1>
          <p className="mt-1 text-sm text-muted-foreground">Update your listing details below.</p>
        </header>

        <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border bg-card p-5 shadow-card">
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
            <Label htmlFor="city">City</Label>
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} maxLength={120} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => navigate({ to: "/dashboard" })}>Cancel</Button>
            <Button type="submit" size="lg" disabled={submitting} className="gradient-primary text-primary-foreground">
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
