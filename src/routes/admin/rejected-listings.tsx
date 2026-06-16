import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CircleCheck as CheckCircle2, Trash2, Eye, Search, MapPin, Calendar, User, Mail } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { adminListListings, adminModerateListing } from "@/lib/admin.functions";
import { formatINR, timeAgo } from "@/lib/format";

export const Route = createFileRoute("/admin/rejected-listings")({
  ssr: false,
  component: RejectedListingsPage,
});

function RejectedListingsPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["admin-rejected", q],
    queryFn: () => adminListListings({ data: { moderation_status: "rejected", q: q || undefined } }),
  });

  async function moderate(id: string, action: "approve" | "delete") {
    try {
      await adminModerateListing({ data: { id, action } });
      qc.invalidateQueries({ queryKey: ["admin-rejected"] });
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
      toast.success(`Listing ${action}d`);
    } catch (e) { toast.error((e as Error).message); }
  }

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rejected Listings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Listings that were not approved. You can re-approve or delete them.</p>

        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search rejected…" className="pl-9" />
          </div>
          <Badge variant="secondary" className="h-9 px-3">{listings.length} rejected</Badge>
        </div>

        <div className="mt-4 grid gap-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : listings.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">No rejected listings.</Card>
          ) : (
            listings.map((l) => (
              <Card key={l.id} className="overflow-hidden p-4">
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
                        <Badge className="mt-1 bg-rose-500/15 text-rose-700 dark:text-rose-400" variant="secondary">Rejected</Badge>
                      </div>
                    </div>

                    {l.rejection_reason && (
                      <div className="mt-2 rounded-md bg-rose-500/5 px-2 py-1 text-xs text-rose-700 dark:text-rose-400">
                        Reason: {l.rejection_reason}
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline"><Eye className="mr-1 h-3 w-3" /> View</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader><DialogTitle>{l.title}</DialogTitle></DialogHeader>
                          <div className="space-y-2 text-sm">
                            {l.cover_image && <img src={l.cover_image} alt={l.title} className="max-h-48 rounded-lg object-cover" />}
                            <p><b>Price:</b> {l.price !== null ? formatINR(l.price) : "Contact"}</p>
                            <p><b>Type:</b> {l.type}</p>
                            <p><b>Seller:</b> {l.seller_name} ({l.seller_email})</p>
                            <p><b>Rejection Reason:</b> {l.rejection_reason ?? "—"}</p>
                            <p><b>Description:</b></p>
                            <p className="whitespace-pre-wrap text-muted-foreground">{l.description ?? "No description"}</p>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => moderate(l.id, "approve")}>
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Re-approve
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { if (confirm("Delete permanently?")) moderate(l.id, "delete"); }}>
                        <Trash2 className="mr-1 h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminShell>
  );
}
