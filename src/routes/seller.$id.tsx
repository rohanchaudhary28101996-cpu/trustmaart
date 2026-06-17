import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { BadgeCheck, MapPin, Calendar, Package } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { AppImage } from "@/components/AppImage";
import { ListingCard } from "@/components/ListingCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { timeAgo } from "@/lib/format";

const getSellerProfile = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: profile }, { data: listings }] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("id,full_name,avatar_url,city,state,bio,is_verified,created_at")
        .eq("id", data.id)
        .maybeSingle(),
      supabaseAdmin
        .from("listings")
        .select("id,title,price,is_negotiable,city,cover_image,created_at,type,is_featured,condition,status")
        .eq("owner_id", data.id)
        .eq("moderation_status", "live")
        .in("status", ["active", "sold"])
        .order("created_at", { ascending: false })
        .limit(50),
    ]);
    if (!profile) return null;
    return { profile, listings: listings ?? [] };
  });

const sellerQuery = (id: string) =>
  queryOptions({
    queryKey: ["seller", id],
    queryFn: () => getSellerProfile({ data: { id } }),
  });

export const Route = createFileRoute("/seller/$id")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(sellerQuery(params.id)),
  head: () => ({ meta: [{ title: "Seller profile — TrustMaart" }] }),
  component: SellerPage,
});

function SellerPage() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(sellerQuery(id));

  if (!data) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Seller not found</h1>
          <Button asChild className="mt-4"><Link to="/browse">Browse listings</Link></Button>
        </div>
      </AppShell>
    );
  }

  const { profile, listings } = data;
  const active = listings.filter((l) => l.status === "active").length;
  const sold = listings.filter((l) => l.status === "sold").length;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Seller card */}
        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <div className="flex flex-wrap items-start gap-5">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-muted ring-4 ring-primary/20">
              <AppImage bucket="avatars" path={profile.avatar_url} alt={profile.full_name ?? "Seller"} className="h-full w-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight">{profile.full_name ?? "Anonymous"}</h1>
                {profile.is_verified && (
                  <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/20 border-0">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified seller
                  </Badge>
                )}
              </div>
              <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
                {(profile.city || profile.state) && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {[profile.city, profile.state].filter(Boolean).join(", ")}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Member {timeAgo(profile.created_at)}
                </span>
              </div>
              {profile.bio && (
                <p className="mt-2 text-sm text-muted-foreground max-w-xl">{profile.bio}</p>
              )}
              <div className="mt-3 flex gap-4 text-sm">
                <div><span className="font-bold text-foreground">{active}</span> <span className="text-muted-foreground">active</span></div>
                <div><span className="font-bold text-foreground">{sold}</span> <span className="text-muted-foreground">sold</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Listings */}
        <div className="mt-8">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            {profile.full_name?.split(" ")[0]}'s listings
          </h2>
          {listings.length === 0 ? (
            <div className="mt-4 rounded-2xl border bg-card p-10 text-center text-sm text-muted-foreground">
              No active listings yet.
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {listings.map((l) => (
                <ListingCard key={l.id} l={l} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
