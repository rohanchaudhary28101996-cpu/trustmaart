import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { History, User, Calendar, FileText } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminGetActionLogs } from "@/lib/admin.functions";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/action-logs")({
  ssr: false,
  component: ActionLogsPage,
});

function ActionLogsPage() {
  const { data: logs = [], error, isError, isLoading } = useQuery({
    queryKey: ["admin-action-logs"],
    queryFn: () => adminGetActionLogs({ data: { limit: 100, offset: 0 } }),
    retry: 1,
  });

  const actionColor: Record<string, string> = {
    approve_listing: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    reject_listing: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
    suspend_listing: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    delete_listing: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
    edit_listing: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
    feature_listing: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
    unfeature_listing: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
    verify_user: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    unverify_user: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
    ban_user: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
    unban_user: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    grant_role: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
    revoke_role: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
    resolve_report_reviewed: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
    resolve_report_dismissed: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
    resolve_report_actioned: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  };

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Action Logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">Complete audit trail of all admin actions.</p>

        <div className="mt-4 grid gap-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : isError ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">
              Could not load action logs: {error instanceof Error ? error.message : "Please try again."}
            </Card>
          ) : logs.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">No action logs yet.</Card>
          ) : (
            logs.map((log) => (
              <Card key={log.id} className="flex flex-wrap items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <Badge className={cn("capitalize", actionColor[log.action] ?? "bg-muted text-foreground")} variant="secondary">
                      {log.action.replace(/_/g, " ")}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      <User className="inline h-3 w-3 mr-0.5" />
                      {log.admin_email || log.admin_id?.slice(0, 8) + "…"}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span><Calendar className="inline h-3 w-3 mr-0.5" /> {timeAgo(log.created_at)}</span>
                    {log.target_type && <span>Target: {log.target_type}</span>}
                    {log.target_id && <span>ID: {log.target_id.slice(0, 8)}…</span>}
                  </div>
                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      <FileText className="inline h-3 w-3 mr-0.5" />
                      {JSON.stringify(log.details).slice(0, 120)}
                    </div>
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
