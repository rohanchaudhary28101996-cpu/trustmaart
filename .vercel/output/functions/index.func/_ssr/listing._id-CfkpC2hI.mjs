import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { b as Route$k, u as useAuth, d as listingQuery, t as toggleWishlist } from "./router-a4rHr5mp.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-Dy2WFMSs.mjs";
import { A as AppImage } from "./AppImage-DppwVylY.mjs";
import { B as Button, c as cn } from "./button-DjOZMqFS.mjs";
import { L as ListingCard } from "./ListingCard-CRlLKKtP.mjs";
import { B as Badge } from "./badge-YM7oB01y.mjs";
import { R as Root } from "../_libs/radix-ui__react-separator.mjs";
import { t as timeAgo, f as formatINR, C as CONDITION_LABEL } from "./format-CVlb_WBO.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { g as ArrowLeft, e as MapPin, h as Calendar, B as BadgeCheck, M as MessageCircle, H as Heart, i as Share2, c as ShieldCheck, j as ZoomIn, k as ChevronLeft, l as ChevronRight } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./client-DHBFCFA_.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./server-d-TQUncW.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./auth-middleware-CeqtaOs5.mjs";
import "../_libs/zod.mjs";
import "./input-D_U8fI25.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "./avatar-FlEjym4Y.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "./storage-Djyz8_2-.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function ListingImageGallery({
  images,
  title
}) {
  const [index, setIndex] = reactExports.useState(0);
  const [lightboxOpen, setLightboxOpen] = reactExports.useState(false);
  const total = images.length;
  const hasImages = total > 0;
  const goNext = reactExports.useCallback(() => {
    setIndex((i) => (i + 1) % total);
  }, [total]);
  const goPrev = reactExports.useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);
  reactExports.useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, goNext, goPrev]);
  if (!hasImages) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppImage, { bucket: "listing-images", path: null, alt: title, className: "h-full w-full" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted sm:aspect-[16/10]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AppImage,
        {
          bucket: "listing-images",
          path: images[index].url,
          alt: `${title} — photo ${index + 1} of ${total}`,
          className: "h-full w-full cursor-zoom-in"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setLightboxOpen(true),
          className: "absolute inset-0 z-10 cursor-zoom-in",
          "aria-label": "Open fullscreen gallery"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm", children: [
        index + 1,
        " / ",
        total
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setLightboxOpen(true),
          className: "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80",
          "aria-label": "Open fullscreen",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { className: "h-4 w-4" })
        }
      ),
      total > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "secondary",
            size: "icon",
            className: "absolute left-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm hover:bg-background",
            onClick: goPrev,
            "aria-label": "Previous image",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "secondary",
            size: "icon",
            className: "absolute right-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm hover:bg-background",
            onClick: goNext,
            "aria-label": "Next image",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5" })
          }
        )
      ] })
    ] }),
    total > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-1 scrollbar-thin", children: images.map((img, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setIndex(i),
        className: cn(
          "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:h-20 sm:w-20",
          i === index ? "border-primary ring-1 ring-primary" : "border-transparent opacity-70 hover:opacity-100"
        ),
        "aria-label": `Go to image ${i + 1}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          AppImage,
          {
            bucket: "listing-images",
            path: img.url,
            alt: `Thumbnail ${i + 1}`,
            className: "h-full w-full"
          }
        )
      },
      img.id
    )) }),
    lightboxOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4",
        onClick: () => setLightboxOpen(false),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative max-h-full max-w-5xl",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                AppImage,
                {
                  bucket: "listing-images",
                  path: images[index].url,
                  alt: `${title} — fullscreen`,
                  className: "max-h-[85vh] w-auto rounded-lg object-contain"
                }
              ),
              total > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "secondary",
                    size: "icon",
                    className: "absolute left-2 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30",
                    onClick: goPrev,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "secondary",
                    size: "icon",
                    className: "absolute right-2 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30",
                    onClick: goNext,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1 text-sm text-white backdrop-blur-sm", children: [
                index + 1,
                " / ",
                total
              ] })
            ]
          }
        )
      }
    )
  ] });
}
const Separator = reactExports.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    ref,
    decorative,
    orientation,
    className: cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    ),
    ...props
  }
));
Separator.displayName = Root.displayName;
function ListingDetailPage() {
  const {
    id
  } = Route$k.useParams();
  const {
    data
  } = useSuspenseQuery(listingQuery(id));
  const {
    user
  } = useAuth();
  const [saved, setSaved] = reactExports.useState(false);
  if (!data || !data.listing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl px-4 py-20 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Listing not found" }) }) });
  }
  const {
    listing,
    images,
    seller,
    similar
  } = data;
  const isOwner = user?.id === listing.owner_id;
  const handleSave = async () => {
    if (!user) {
      toast.info("Sign in to save listings");
      return;
    }
    const res = await toggleWishlist({
      data: {
        listing_id: listing.id
      }
    });
    setSaved(res.saved);
    toast.success(res.saved ? "Saved to wishlist" : "Removed from wishlist");
  };
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          url
        });
      } catch {
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-4 sm:py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex items-center gap-2 text-sm text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/browse", className: "inline-flex items-center gap-1 hover:text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      " Back to browse"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-[1fr_380px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ListingImageGallery, { images, title: listing.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-card p-5 shadow-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold leading-snug sm:text-2xl", children: listing.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5" }),
                  " ",
                  listing.city ?? "India",
                  listing.state && `, ${listing.state}`
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }),
                  " ",
                  timeAgo(listing.created_at)
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-extrabold tracking-tight", children: listing.price !== null ? formatINR(listing.price) : "Contact" }),
              listing.is_negotiable && listing.price !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "mt-1", children: "Negotiable" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm sm:grid-cols-3", children: [
            listing.condition && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Condition" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: CONDITION_LABEL[listing.condition] })
            ] }),
            listing.brand && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Brand" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: listing.brand })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium capitalize", children: listing.type })
            ] }),
            listing.view_count !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Views" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: listing.view_count })
            ] })
          ] }),
          listing.description && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground", children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap text-sm leading-relaxed text-foreground/90", children: listing.description })
            ] })
          ] }),
          listing.tags && listing.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: listing.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: tag }, tag)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-card p-5 shadow-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold uppercase tracking-wide text-muted-foreground", children: "Seller" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppImage, { bucket: "avatars", path: seller?.avatar_url, alt: seller?.full_name ?? "Seller", className: "h-full w-full" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 font-semibold", children: [
                seller?.full_name ?? "Anonymous",
                seller?.is_verified && /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-4 w-4 text-primary" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: seller?.city ? `From ${seller.city}` : "TrustMaart seller" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
            !isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full gap-2", size: "lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
              " Chat with seller"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "gap-2", onClick: handleSave, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: cn("h-4 w-4", saved && "fill-destructive text-destructive") }),
                saved ? "Saved" : "Save"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "gap-2", onClick: handleShare, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4" }),
                " Share"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border bg-card p-5 shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "TrustMaart never asks for OTP or payment outside the platform. Meet in safe public places and verify the product before paying." })
        ] }) })
      ] })
    ] }),
    similar.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-lg font-bold", children: "Similar listings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4", children: similar.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(ListingCard, { l }, l.id)) })
    ] })
  ] }) });
}
export {
  ListingDetailPage as component
};
