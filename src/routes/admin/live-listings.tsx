import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CirclePause as PauseCircle, Trash2, Eye, Search, Star, CreditCard as Edit3, MapPin, Calendar, User, Mail } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { adminListListings, adminModerateListing, adminUpdateListing } from "@/lib/admin.functions";
import { formatINR, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/live-listings")({
  ssr: false,
  component: LiveListingsPage,
});

function LiveListingsPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["admin-live", q],
    queryFn: () => adminListListings({ data: { moderation_status: "live", q: q || undefined } }),
  });

  async function moderate(id: string, action: "suspend" | "delete", reason?: string) {
    try {
      await adminModerateListing({ data: { id, action, reason } });
      qc.invalidateQueries({ queryKey: ["admin-live"] });
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
      toast.success(`Listing ${action}d`);
    } catch (e) { toast.error((e as Error).message); }
  }

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Live Listings</h1>
        <p className="mt-1 text-sm text-muted-foreground">All currently published and visible listings.</p>

        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search live listings…" className="pl-9" />
          </div>
          <Badge variant="secondary" className="h-9 px-3">{listings.length} live</Badge>
        </div>

        <div className="mt-4 grid gap-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : listings.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">No live listings.</Card>
          ) : (
            listings.map((l) => (
              <LiveListingCard key={l.id} l={l} onAction={moderate} />
            ))
          )}
        </div>
      </div>
    </AdminShell>
  );
}

type Listing = Awaited<ReturnType<typeof adminListListings>>[number];

function LiveListingCard({ l, onAction }: { l: Listing; onAction: (id: string, action: "suspend" | "delete", reason?: string) => void }) {
  const [reason, setReason] = useState("");
  const [openSuspend, setOpenSuspend] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editForm, setEditForm] = useState({ title: l.title, description: l.description ?? "", price: l.price ?? 0 });

  return (
    <Card className="overflow-hidden p-4">
      <div className="flex flex-wrap items-start gap-4">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
          {l.cover_image ? (
            <img src={l.cover_image} alt={l.title} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">No image</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold">{l.title}</h3>
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><User className="h-3 w-3" /> {l.seller_name ?? "—"}</span>
                {l.seller_email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {l.seller_email}</span>}
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {l.city ?? "—"}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {timeAgo(l.created_at)}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{l.price !== null ? formatINR(l.price) : "Contact"}</div>
              <Badge className="mt-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" variant="secondary">Live</Badge>
              {l.is_featured && <Badge className="mt-1 ml-1 bg-warning text-warning-foreground">Featured</Badge>}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline"><Edit3 className="mr-1 h-3 w-3" /> Edit</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Edit Listing</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Title</Label><Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} /></div>
                  <div><Label>Description</Label><Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={4} /></div>
                  <div><Label>Price (₹)</Label><Input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })} /></div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpenEdit(false)}>Cancel</Button>
                  <Button onClick={async () => {
                    try {
                      await adminUpdateListing({ data: { id: l.id, title: editForm.title, description: editForm.description, price: editForm.price } });
                      toast.success("Listing updated");
                      setOpenEdit(false);
                    } catch (e) { toast.error((e as Error).message); }
                  }}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button size="sm" variant={l.is_featured ? "default" : "outline"} onClick={async () => {
              try {
                await adminModerateListing({ data: { id: l.id, action: "feature", featured: !l.is_featured } });
                toast.success(l.is_featured ? "Unfeatured" : "Featured");
              } catch (e) { toast.error((e as Error).message); }
            }}>
              <Star className={cn("mr-1 h-3 w-3", l.is_featured && "fill-current")} /> {l.is_featured ? "Unfeature" : "Feature"}
            </Button>

            <Dialog open={openSuspend} onOpenChange={setOpenSuspend}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline"><PauseCircle className="mr-1 h-3 w-3" /> Suspend</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Suspend Listing</DialogTitle></DialogHeader>
                <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for suspension…" rows={4} />
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpenSuspend(false)}>Cancel</Button>
                  <Button onClick={() => { onAction(l.id, "suspend", reason); setReason(""); setOpenSuspend(false); }} disabled={!reason.trim()}>Suspend</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { if (confirm("Delete permanently?")) onAction(l.id, "delete"); }}>
              <Trash2 className="mr-1 h-3 w-3" /> Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
