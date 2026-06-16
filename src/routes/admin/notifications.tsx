import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, CheckCheck, MessageSquare, CircleAlert as AlertCircle, Info } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/notifications")({
  ssr: false,
  component: AdminNotificationsPage,
});

function AdminNotificationsPage() {
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      return (data ?? []) as Array<{
        id: string;
        type: string;
        payload: Record<string, unknown>;
        read_at: string | null;
        created_at: string;
      }>;
    },
  });

  const typeIcon = (type: string) => {
    if (type.includes("listing_approve")) return <CheckCheck className="h-4 w-4 text-emerald-500" />;
    if (type.includes("listing_reject")) return <AlertCircle className="h-4 w-4 text-rose-500" />;
    if (type.includes("listing_suspend")) return <AlertCircle className="h-4 w-4 text-amber-500" />;
    if (type.includes("listing_request_changes")) return <Info className="h-4 w-4 text-sky-500" />;
    return <MessageSquare className="h-4 w-4 text-primary" />;
  };

  const typeColor = (type: string) => {
    if (type.includes("listing_approve")) return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400";
    if (type.includes("listing_reject")) return "bg-rose-500/15 text-rose-700 dark:text-rose-400";
    if (type.includes("listing_suspend")) return "bg-amber-500/15 text-amber-700 dark:text-amber-400";
    if (type.includes("listing_request_changes")) return "bg-sky-500/15 text-sky-700 dark:text-sky-400";
    return "bg-muted text-foreground";
  };

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="mt-1 text-sm text-muted-foreground">All platform notifications and alerts.</p>

        <div className="mt-4 grid gap-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : notifications.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">No notifications yet.</Card>
          ) : (
            notifications.map((n) => (
              <Card key={n.id} className={cn("flex items-start gap-3 p-3", !n.read_at && "border-primary/40")}>
                <div className="mt-0.5 shrink-0">{typeIcon(n.type)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{n.type.replace(/_/g, " ")}</span>
                    <Badge className={cn("capitalize", typeColor(n.type))} variant="secondary">
                      {n.type.replace(/_/g, " ")}
                    </Badge>
                    {!n.read_at && <Badge variant="default" className="h-5 px-1.5 text-[10px]">New</Badge>}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {typeof n.payload?.message === "string" ? (n.payload.message as string) : JSON.stringify(n.payload)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{timeAgo(n.created_at)}</div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminShell>
  );
}
