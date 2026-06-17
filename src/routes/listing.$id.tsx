import { createFileRoute, Link, useRouter, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import {
  MapPin,
  Calendar,
  Heart,
  MessageCircle,
  Share2,
  BadgeCheck,
  ArrowLeft,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ListingImageGallery } from "@/components/ListingImageGallery";
import { ListingCard } from "@/components/ListingCard";
import { AppImage } from "@/components/AppImage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatINR, timeAgo, CONDITION_LABEL } from "@/lib/format";
import { getListing, toggleWishlist } from "@/lib/listings.functions";
import { startOrGetConversation } from "@/lib/chat.functions";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const listingQuery = (id: string) =>
  queryOptions({
    queryKey: ["listing", id],
    queryFn: () => getListing({ data: { id } }),
  });

export const Route = createFileRoute("/listing/$id")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(listingQuery(params.id)),
  head: () => ({
    meta: [
      { title: "TrustMaart — Listing" },
      { name: "description", content: "View product details on TrustMaart." },
    ],
  }),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load listing.</p>
          <Button
            className="mt-4"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  },
  notFoundComponent: () => (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Listing not found</h1>
        <p className="mt-2 text-muted-foreground">This listing may have been removed or expired.</p>
        <Link to="/browse" className="mt-6 inline-block text-primary hover:underline">
          Browse more listings
        </Link>
      </div>
    </AppShell>
  ),
  component: ListingDetailPage,
});

function ListingDetailPage() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(listingQuery(id));
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  if (!data || !data.listing) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Listing not found</h1>
        </div>
      </AppShell>
    );
  }

  const { listing, images, seller, similar } = data;
  const isOwner = user?.id === listing.owner_id;

  const handleSave = async () => {
    if (!user) {
      toast.info("Sign in to save listings");
      return;
    }
    const res = await toggleWishlist({ data: { listing_id: listing.id } });
    setSaved(res.saved);
    toast.success(res.saved ? "Saved to wishlist" : "Removed from wishlist");
  };

  const handleChat = async () => {
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    setChatLoading(true);
    try {
      const conv = await startOrGetConversation({ data: { listing_id: listing.id } });
      navigate({ to: "/chat/$id", params: { id: conv.id } });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setChatLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: listing.title, url });
      } catch {
        // ignored
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6">
        {/* Breadcrumb / back */}
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/browse" className="inline-flex items-center gap-1 hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to browse
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left: gallery + details */}
          <div className="space-y-6">
            <ListingImageGallery
              images={images}
              title={listing.title}
            />

            <div className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold leading-snug sm:text-2xl">{listing.title}</h1>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {listing.city ?? "India"}
                      {listing.state && `, ${listing.state}`}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {timeAgo(listing.created_at)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold tracking-tight">
                    {listing.price !== null ? formatINR(listing.price) : "Contact"}
                  </div>
                  {listing.is_negotiable && listing.price !== null && (
                    <Badge variant="secondary" className="mt-1">Negotiable</Badge>
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                {listing.condition && (
                  <div className="rounded-lg bg-muted p-3">
                    <div className="text-xs text-muted-foreground">Condition</div>
                    <div className="font-medium">{CONDITION_LABEL[listing.condition]}</div>
                  </div>
                )}
                {listing.brand && (
                  <div className="rounded-lg bg-muted p-3">
                    <div className="text-xs text-muted-foreground">Brand</div>
                    <div className="font-medium">{listing.brand}</div>
                  </div>
                )}
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-xs text-muted-foreground">Category</div>
                  <div className="font-medium capitalize">{listing.type}</div>
                </div>
                {listing.view_count !== null && (
                  <div className="rounded-lg bg-muted p-3">
                    <div className="text-xs text-muted-foreground">Views</div>
                    <div className="font-medium">{listing.view_count}</div>
                  </div>
                )}
              </div>

              {listing.description && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Description
                    </h2>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                      {listing.description}
                    </p>
                  </div>
                </>
              )}

              {listing.tags && listing.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {listing.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: seller card + actions */}
          <div className="space-y-4">
            <div className="rounded-2xl border bg-card p-5 shadow-card">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Seller
              </h2>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                  <AppImage bucket="avatars" path={seller?.avatar_url} alt={seller?.full_name ?? "Seller"} className="h-full w-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1 font-semibold">
                    {seller?.full_name ?? "Anonymous"}
                    {seller?.is_verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {seller?.city ? `From ${seller.city}` : "TrustMaart seller"}
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {!isOwner && (
                  <Button className="w-full gap-2" size="lg" onClick={handleChat} disabled={chatLoading}>
                    {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />} Chat with seller
                  </Button>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="gap-2" onClick={handleSave}>
                    <Heart className={cn("h-4 w-4", saved && "fill-destructive text-destructive")} />
                    {saved ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={handleShare}>
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p>
                  TrustMaart never asks for OTP or payment outside the platform. Meet in safe public
                  places and verify the product before paying.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar listings */}
        {similar.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 text-lg font-bold">Similar listings</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {similar.map((l) => (
                <ListingCard key={l.id} l={l} />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
