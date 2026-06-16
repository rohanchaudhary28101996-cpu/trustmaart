import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Search, CircleCheck as CheckCircle2, Circle as XCircle, Eye, TriangleAlert as AlertTriangle, Flag, User, Calendar } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { adminListReports, adminResolveReport } from "@/lib/admin.functions";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/reported-listings")({
  ssr: false,
  component: ReportedListingsPage,
});

function ReportedListingsPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["admin-reports", q, statusFilter],
    queryFn: () => adminListReports(),
  });

  const filtered = reports.filter((r) => {
    const matchesSearch = !q || r.reason.toLowerCase().includes(q.toLowerCase()) || r.target_id.toLowerCase().includes(q.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function resolve(id: string, status: "reviewed" | "dismissed" | "actioned") {
    try {
      await adminResolveReport({ data: { id, status } });
      qc.invalidateQueries({ queryKey: ["admin-reports"] });
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
      toast.success(`Report ${status}`);
    } catch (e) { toast.error((e as Error).message); }
  }

  const statusColor: Record<string, string> = {
    open: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
    reviewed: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
    dismissed: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
    actioned: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  };

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reported Listings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review user reports and take action.</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search reports…" className="pl-9" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border bg-background px-3 text-sm"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="reviewed">Reviewed</option>
            <option value="dismissed">Dismissed</option>
            <option value="actioned">Actioned</option>
          </select>
          <Badge variant="secondary" className="h-9 px-3">{filtered.length} reports</Badge>
        </div>

        <div className="mt-4 grid gap-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : filtered.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">No reports found.</Card>
          ) : (
            filtered.map((r) => (
              <Card key={r.id} className="flex flex-wrap items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Flag className="h-4 w-4 text-rose-500" />
                    <span className="font-medium capitalize">[{r.target_type}] {r.target_id.slice(0, 8)}…</span>
                    <Badge className={cn("capitalize", statusColor[r.status])} variant="secondary">{r.status}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> Reporter: {r.reporter_id.slice(0, 8)}…</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {timeAgo(r.created_at)}</span>
                  </div>
                  <div className="mt-1 text-sm">{r.reason}</div>
                </div>

                <div className="flex gap-1">
                  {r.status === "open" && (
                    <>
                      <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => resolve(r.id, "actioned")}>
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Action
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => resolve(r.id, "reviewed")}>
                        <Eye className="mr-1 h-3 w-3" /> Reviewed
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => resolve(r.id, "dismissed")}>
                        <XCircle className="mr-1 h-3 w-3" /> Dismiss
                      </Button>
                    </>
                  )}
                  {r.status !== "open" && (
                    <span className="text-xs text-muted-foreground">Resolved</span>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminShell>
  );
}
