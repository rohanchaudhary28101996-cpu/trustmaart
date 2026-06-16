import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CircleCheck as CheckCircle2, Circle as XCircle, TriangleAlert as AlertTriangle, CirclePause as PauseCircle, Trash2, Eye, Search, MapPin, Calendar, User, Mail, Phone } from "lucide-react";
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
import { adminListListings, adminModerateListing } from "@/lib/admin.functions";
import { formatINR, timeAgo } from "@/lib/format";

export const Route = createFileRoute("/admin/pending-ads")({
  ssr: false,
  component: PendingAdsPage,
});

function PendingAdsPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["admin-pending", q],
    queryFn: () => adminListListings({ data: { moderation_status: "pending", q: q || undefined } }),
  });

  async function moderate(id: string, action: "approve" | "reject" | "request_changes" | "suspend" | "delete", reason?: string) {
    try {
      await adminModerateListing({ data: { id, action, reason } });
      qc.invalidateQueries({ queryKey: ["admin-pending"] });
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
      toast.success(`Listing ${action}d`);
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pending Approval</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review and verify ads before they go live.</p>

        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pending ads…" className="pl-9" />
          </div>
          <Badge variant="secondary" className="h-9 px-3">{listings.length} pending</Badge>
        </div>

        <div className="mt-4 grid gap-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : listings.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">No pending ads. Great job!</Card>
          ) : (
            listings.map((l) => (
              <PendingAdCard key={l.id} l={l} onAction={moderate} />
            ))
          )}
        </div>
      </div>
    </AdminShell>
  );
}

type Listing = Awaited<ReturnType<typeof adminListListings>>[number];

function PendingAdCard({ l, onAction }: { l: Listing; onAction: (id: string, action: "approve" | "reject" | "request_changes" | "suspend" | "delete", reason?: string) => void }) {
  const [reason, setReason] = useState("");
  const [openDialog, setOpenDialog] = useState<null | "reject" | "request_changes" | "suspend" | "view">(null);

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
                {l.seller_phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {l.seller_phone}</span>}
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {l.city ?? "—"}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {timeAgo(l.created_at)}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{l.price !== null ? formatINR(l.price) : "Contact"}</div>
              <Badge variant="outline" className="capitalize">{l.type}</Badge>
            </div>
          </div>

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
                  <p><b>Description:</b></p>
                  <p className="whitespace-pre-wrap text-muted-foreground">{l.description ?? "No description"}</p>
                </div>
                <DialogFooter>
                  <Button asChild variant="outline"><Link to="/listing/$id" params={{ id: l.id }} target="_blank">Open public page</Link></Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => onAction(l.id, "approve")}>
              <CheckCircle2 className="mr-1 h-3 w-3" /> Approve
            </Button>

            <ReasonDialog
              open={openDialog === "reject"} setOpen={(o) => setOpenDialog(o ? "reject" : null)}
              title="Reject Listing" desc="Tell the seller why." label="Reject"
              icon={<XCircle className="mr-1 h-3 w-3" />} variant="destructive"
              reason={reason} setReason={setReason}
              onSubmit={() => { onAction(l.id, "reject", reason); setReason(""); setOpenDialog(null); }}
            />

            <ReasonDialog
              open={openDialog === "request_changes"} setOpen={(o) => setOpenDialog(o ? "request_changes" : null)}
              title="Request Changes" desc="List what needs to be fixed." label="Request Changes"
              icon={<AlertTriangle className="mr-1 h-3 w-3" />} variant="outline"
              reason={reason} setReason={setReason}
              onSubmit={() => { onAction(l.id, "request_changes", reason); setReason(""); setOpenDialog(null); }}
            />

            <ReasonDialog
              open={openDialog === "suspend"} setOpen={(o) => setOpenDialog(o ? "suspend" : null)}
              title="Suspend Listing" desc="Reason for suspension." label="Suspend"
              icon={<PauseCircle className="mr-1 h-3 w-3" />} variant="outline"
              reason={reason} setReason={setReason}
              onSubmit={() => { onAction(l.id, "suspend", reason); setReason(""); setOpenDialog(null); }}
            />

            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { if (confirm("Delete this listing permanently?")) onAction(l.id, "delete"); }}>
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
