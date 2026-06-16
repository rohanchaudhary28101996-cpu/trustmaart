import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Plus, Trash2, Pencil, ShoppingBag, MessageCircle, Heart, Crown } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppImage } from "@/components/AppImage";
import { formatINR, timeAgo } from "@/lib/format";
import { myListings, deleteListing, updateListingStatus } from "@/lib/listings.functions";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const qc = useQueryClient();
  const { isSuperAdmin } = useAuth();
  const { data = [], isLoading } = useQuery({ queryKey: ["my-listings"], queryFn: () => myListings() });


  const active = data.filter((l) => l.status === "active").length;
  const sold = data.filter((l) => l.status === "sold").length;
  const views = data.reduce((s, l) => s + (l.view_count ?? 0), 0);

  async function del(id: string) {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    try {
      await deleteListing({ data: { id } });
      toast.success("Listing deleted");
      qc.invalidateQueries({ queryKey: ["my-listings"] });
    } catch (e) { toast.error((e as Error).message); }
  }
  async function markSold(id: string) {
    try {
      await updateListingStatus({ data: { id, status: "sold" } });
      toast.success("Marked as sold");
      qc.invalidateQueries({ queryKey: ["my-listings"] });
    } catch (e) { toast.error((e as Error).message); }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your listings and inbox.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isSuperAdmin && (
              <Button asChild variant="outline" className="gap-1 border-amber-300 text-amber-700 hover:bg-amber-50">
                <Link to="/admin/dashboard"><Crown className="h-4 w-4" /> Admin Panel</Link>
              </Button>
            )}
            <Button asChild className="gradient-primary text-primary-foreground">
              <Link to="/sell"><Plus className="mr-1 h-4 w-4" /> Post new ad</Link>
            </Button>
          </div>

        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Active" value={active} icon={<ShoppingBag className="h-4 w-4" />} />
          <StatCard label="Sold" value={sold} icon={<Badge className="h-4 w-4 p-0" />} />
          <StatCard label="Total views" value={views} icon={<Eye className="h-4 w-4" />} />
          <Link to="/chat" className="rounded-2xl border bg-card p-4 transition hover:shadow-card">
            <div className="text-xs text-muted-foreground">Inbox</div>
            <div className="mt-1 flex items-center gap-2 text-2xl font-bold"><MessageCircle className="h-5 w-5 text-primary" /> Open</div>
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your listings</h2>
          <Link to="/wishlist" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
            <Heart className="h-3 w-3" /> Wishlist
          </Link>
        </div>

        {isLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
        ) : data.length === 0 ? (
          <div className="mt-6 rounded-2xl border bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">You haven't posted anything yet.</p>
            <Button asChild className="mt-4 gradient-primary text-primary-foreground">
              <Link to="/sell"><Plus className="mr-1 h-4 w-4" /> Post your first ad</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-2xl border bg-card">
            {data.map((l, i) => (
              <div key={l.id} className={`flex flex-wrap items-center gap-3 p-3 ${i ? "border-t" : ""}`}>
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <AppImage bucket="listing-images" path={l.cover_image} alt={l.title} className="h-full w-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link to="/listing/$id" params={{ id: l.id }} className="line-clamp-1 font-medium hover:text-primary">{l.title}</Link>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {l.price !== null ? formatINR(l.price) : "Contact"} · {timeAgo(l.created_at)} · {l.view_count ?? 0} views
                  </div>
                </div>
                <Badge variant={l.status === "active" ? "default" : "secondary"}>{l.status}</Badge>
                {l.status === "active" && (
                  <Button size="sm" variant="outline" onClick={() => markSold(l.id)}>Mark sold</Button>
                )}
                <Button size="icon" variant="ghost" asChild>
                  <Link to="/listing/$id" params={{ id: l.id }}><Pencil className="h-4 w-4" /></Link>
                </Button>
                <Button size="icon" variant="ghost" onClick={() => del(l.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-center gap-2 text-2xl font-bold">{icon}{value}</div>
    </div>
  );
}
