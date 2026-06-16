import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CircleCheck as CheckCircle2, Circle as XCircle, TriangleAlert as AlertTriangle, CirclePause as PauseCircle, Trash2, Eye, Search, CreditCard as Edit3, Star, MapPin, Calendar, User, Mail } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { adminListListings, adminModerateListing, adminUpdateListing } from "@/lib/admin.functions";
import { formatINR, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/listings/$type")({
  ssr: false,
  component: ListingsPage,
});

function ListingsPage() {
  const { type } = Route.useParams();
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["admin-listings", type, statusFilter, q],
    queryFn: () => adminListListings({
      data: {
        type: type as "product" | "service",
        moderation_status: statusFilter === "all" ? undefined : (statusFilter as "pending" | "live" | "rejected" | "changes_required" | "suspended" | "expired"),
        q: q || undefined,
      },
    }),
  });

  async function moderate(id: string, action: "approve" | "reject" | "request_changes" | "suspend" | "delete", reason?: string) {
    try {
      await adminModerateListing({ data: { id, action, reason } });
      qc.invalidateQueries({ queryKey: ["admin-listings"] });
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
      toast.success(`Listing ${action}d`);
    } catch (e) { toast.error((e as Error).message); }
  }

  const title = type === "product" ? "Product Listings" : "Service Listings";

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage all {type} listings on the platform.</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${type}…`} className="pl-9" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border bg-background px-3 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="live">Live</option>
            <option value="rejected">Rejected</option>
            <option value="changes_required">Changes Required</option>
            <option value="suspended">Suspended</option>
            <option value="expired">Expired</option>
          </select>
          <Badge variant="secondary" className="h-9 px-3">{listings.length} results</Badge>
        </div>

        <div className="mt-4 grid gap-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : listings.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">No listings found.</Card>
          ) : (
            listings.map((l) => (
              <ListingCard key={l.id} l={l} onAction={moderate} />
            ))
          )}
        </div>
      </div>
    </AdminShell>
  );
}

type Listing = Awaited<ReturnType<typeof adminListListings>>[number];

function ListingCard({ l, onAction }: { l: Listing; onAction: (id: string, action: "approve" | "reject" | "request_changes" | "suspend" | "delete", reason?: string) => void }) {
  const [reason, setReason] = useState("");
  const [openDialog, setOpenDialog] = useState<null | "reject" | "request_changes" | "suspend" | "view" | "edit">(null);
  const [editForm, setEditForm] = useState({ title: l.title, description: l.description ?? "", price: l.price ?? 0 });

  const statusColor: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    live: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    rejected: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
    changes_required: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
    suspended: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
    expired: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
  };

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
              <Badge className={cn("mt-1 capitalize", statusColor[l.moderation_status])} variant="secondary">
                {l.moderation_status.replace("_", " ")}
              </Badge>
              {l.is_featured && <Badge className="mt-1 ml-1 bg-warning text-warning-foreground">Featured</Badge>}
            </div>
          </div>

          {l.rejection_reason && (
            <div className="mt-2 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
              Note: {l.rejection_reason}
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <Dialog open={openDialog === "view"} onOpenChange={(o) => setOpenDialog(o ? "view" : null)}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline"><Eye className="mr-1 h-3 w-3" /> View</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>{l.title}</DialogTitle></DialogHeader>
                <div className="space-y-2 text-sm">
                  {l.cover_image && <img src={l.cover_image} alt={l.title} className="max-h-48 rounded-lg object-cover" />}
                  <p><b>Price:</b> {l.price !== null ? formatINR(l.price) : "Contact"}</p>
                  <p><b>Type:</b> {l.type}</p>
                  <p><b>City:</b> {l.city ?? "—"}</p>
                  <p><b>Condition:</b> {l.condition ?? "—"}</p>
                  <p><b>Seller:</b> {l.seller_name} ({l.seller_email})</p>
                  <p><b>Status:</b> {l.moderation_status}</p>
                  <p><b>Description:</b></p>
                  <p className="whitespace-pre-wrap text-muted-foreground">{l.description ?? "No description"}</p>
                </div>
                <DialogFooter>
                  <Button asChild variant="outline"><Link to="/listing/$id" params={{ id: l.id }} target="_blank">Open public page</Link></Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={openDialog === "edit"} onOpenChange={(o) => setOpenDialog(o ? "edit" : null)}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline"><Edit3 className="mr-1 h-3 w-3" /> Edit</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Edit Listing</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Title</Label>
                    <Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={4} />
                  </div>
                  <div>
                    <Label>Price (₹)</Label>
                    <Input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpenDialog(null)}>Cancel</Button>
                  <Button onClick={async () => {
                    try {
                      await adminUpdateListing({ data: { id: l.id, title: editForm.title, description: editForm.description, price: editForm.price } });
                      toast.success("Listing updated");
                      setOpenDialog(null);
                    } catch (e) { toast.error((e as Error).message); }
                  }}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => onAction(l.id, "approve")}>
              <CheckCircle2 className="mr-1 h-3 w-3" /> Approve
            </Button>

            <ReasonDialog open={openDialog === "reject"} setOpen={(o) => setOpenDialog(o ? "reject" : null)}
              title="Reject Listing" desc="Tell the seller why." label="Reject"
              icon={<XCircle className="mr-1 h-3 w-3" />} variant="destructive"
              reason={reason} setReason={setReason}
              onSubmit={() => { onAction(l.id, "reject", reason); setReason(""); setOpenDialog(null); }} />

            <ReasonDialog open={openDialog === "request_changes"} setOpen={(o) => setOpenDialog(o ? "request_changes" : null)}
              title="Request Changes" desc="List what needs fixing." label="Request Changes"
              icon={<AlertTriangle className="mr-1 h-3 w-3" />} variant="outline"
              reason={reason} setReason={setReason}
              onSubmit={() => { onAction(l.id, "request_changes", reason); setReason(""); setOpenDialog(null); }} />

            <ReasonDialog open={openDialog === "suspend"} setOpen={(o) => setOpenDialog(o ? "suspend" : null)}
              title="Suspend Listing" desc="Reason for suspension." label="Suspend"
              icon={<PauseCircle className="mr-1 h-3 w-3" />} variant="outline"
              reason={reason} setReason={setReason}
              onSubmit={() => { onAction(l.id, "suspend", reason); setReason(""); setOpenDialog(null); }} />

            <Button size="sm" variant={l.is_featured ? "default" : "outline"} onClick={async () => {
              try {
                await adminModerateListing({ data: { id: l.id, action: "feature", featured: !l.is_featured } });
                toast.success(l.is_featured ? "Unfeatured" : "Featured");
              } catch (e) { toast.error((e as Error).message); }
            }}>
              <Star className={cn("mr-1 h-3 w-3", l.is_featured && "fill-current")} /> {l.is_featured ? "Unfeature" : "Feature"}
            </Button>

            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { if (confirm("Delete permanently?")) onAction(l.id, "delete"); }}>
              <Trash2 className="mr-1 h-3 w-3" /> Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ReasonDialog({ open, setOpen, title, desc, label, icon, variant, reason, setReason, onSubmit }: {
  open: boolean; setOpen: (o: boolean) => void; title: string; desc: string; label: string;
  icon: React.ReactNode; variant: "destructive" | "outline" | "default";
  reason: string; setReason: (s: string) => void; onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={variant}>{icon}{label}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{desc}</DialogDescription></DialogHeader>
        <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter reason…" rows={4} />
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={onSubmit} disabled={!reason.trim()}>{label}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
