import { Link } from "@tanstack/react-router";
import { Heart, MapPin, BadgeCheck } from "lucide-react";
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
};

export function ListingCard({
  l,
  onToggleSave,
  saved,
}: {
  l: ListingCardData;
  onToggleSave?: () => void;
  saved?: boolean;
}) {
  return (
    <Link
      to="/listing/$id"
      params={{ id: l.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <AppImage
          bucket="listing-images"
          path={l.cover_image}
          alt={l.title}
          className="h-full w-full transition-transform group-hover:scale-105"
        />
        {l.is_featured && (
          <Badge className="absolute left-2 top-2 gap-1 bg-warning text-warning-foreground hover:bg-warning">
            <BadgeCheck className="h-3 w-3" /> Featured
          </Badge>
        )}
        {onToggleSave && (
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
          {l.is_negotiable && l.price !== null && (
            <span className="text-[10px] font-medium uppercase text-muted-foreground">Negotiable</span>
          )}
        </div>
        <h3 className="mt-1 line-clamp-2 text-sm font-medium text-foreground/90">{l.title}</h3>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {l.city ?? "India"}
          </span>
          <span>{timeAgo(l.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}
