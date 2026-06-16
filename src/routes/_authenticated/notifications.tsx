import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/notifications")({
  component: NotificationsPage,
});

type Notif = {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
};

function NotificationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setItems((data ?? []) as Notif[]);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    load();
    const ch = supabase
      .channel(`notif-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user]);

  const markAllRead = async () => {
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .is("read_at", null)
      .eq("user_id", user.id);
    load();
  };

  return (
    <AppShell>
      <section className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-extrabold tracking-tight">Notifications</h1>
          </div>
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="mr-1 h-4 w-4" /> Mark all read
          </Button>
        </div>

        <div className="mt-6 space-y-2">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border bg-card p-10 text-center">
              <p className="text-sm text-muted-foreground">No notifications yet.</p>
            </div>
          ) : (
            items.map((n) => (
              <div
                key={n.id}
                className={`rounded-2xl border bg-card p-4 shadow-card ${!n.read_at ? "border-primary/40" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold capitalize">{n.type.replace(/_/g, " ")}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {typeof n.payload?.message === "string" ? (n.payload.message as string) : JSON.stringify(n.payload)}
                    </div>
                  </div>
                  <div className="shrink-0 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </AppShell>
  );
}
