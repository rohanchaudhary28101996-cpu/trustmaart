import { Link } from "@tanstack/react-router";
import { Heart, MapPin, BadgeCheck, Package } from "lucide-react";
import { formatINR, timeAgo } from "@/lib/format";
import { AppImage } from "@/components/AppImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ListingCardData = {
  id: string;
  title: string;
  price: number | null;
  is_negotiable: boolean;
  city: string | null;
  cover_image: string | null;
  created_at: string;
  type: "product" | "service";
  is_featured?: boolean;
  condition?: string | null;
  status?: string;
};

function ImagePlaceholder({ title }: { title: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-muted/60 text-muted-foreground">
      <Package className="h-10 w-10 opacity-30" />
      <span className="px-3 text-center text-[10px] font-medium leading-tight opacity-50 line-clamp-2">{title}</span>
    </div>
  );
}

export function ListingCard({
  l,
  onToggleSave,
  saved,
  distanceKm,
}: {
  l: ListingCardData;
  onToggleSave?: () => void;
  saved?: boolean;
  distanceKm?: number;
}) {
  const isSold = l.status === "sold";

  return (
    <Link
      to="/listing/$id"
      params={{ id: l.id }}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated",
        isSold && "opacity-70"
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {l.cover_image ? (
          <AppImage
            bucket="listing-images"
            path={l.cover_image}
            alt={l.title}
            className="h-full w-full transition-transform group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder title={l.title} />
        )}
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <span className="rounded-full bg-foreground px-3 py-1 text-xs font-bold uppercase tracking-widest text-background">
              Sold
            </span>
          </div>
        )}
        {l.is_featured && !isSold && (
          <Badge className="absolute left-2 top-2 gap-1 bg-warning text-warning-foreground hover:bg-warning">
            <BadgeCheck className="h-3 w-3" /> Featured
          </Badge>
        )}
        {onToggleSave && !isSold && (
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/85 backdrop-blur"
            onClick={(e) => {
              e.preventDefault();
              onToggleSave();
            }}
          >
            <Heart className={cn("h-4 w-4", saved && "fill-destructive text-destructive")} />
          </Button>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-lg font-bold tracking-tight">
            {l.price !== null ? formatINR(l.price) : "Contact"}
          </span>
          {l.is_negotiable && l.price !== null && !isSold && (
            <span className="text-[10px] font-medium uppercase text-muted-foreground">Negotiable</span>
          )}
        </div>
        <h3 className="mt-1 line-clamp-2 text-sm font-medium text-foreground/90">{l.title}</h3>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {distanceKm !== undefined ? `${distanceKm.toFixed(1)} km away` : l.city ?? "India"}
          </span>
          <span>{timeAgo(l.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}
