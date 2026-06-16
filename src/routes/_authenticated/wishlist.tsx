import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { myWishlist, toggleWishlist } from "@/lib/listings.functions";

export const Route = createFileRoute("/_authenticated/wishlist")({
  component: WishlistPage,
});

function WishlistPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["wishlist"], queryFn: () => myWishlist() });

  async function unsave(id: string) {
    try {
      await toggleWishlist({ data: { listing_id: id } });
      qc.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Removed from wishlist");
    } catch (e) { toast.error((e as Error).message); }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <Heart className="h-7 w-7 text-destructive" /> Wishlist
        </h1>
        {isLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
        ) : data.length === 0 ? (
          <div className="mt-8 rounded-2xl border bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">Your wishlist is empty.</p>
            <Button asChild className="mt-4"><Link to="/browse">Browse listings</Link></Button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {data.map((l) => (
              <ListingCard key={l.id} l={l} saved onToggleSave={() => unsave(l.id)} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
