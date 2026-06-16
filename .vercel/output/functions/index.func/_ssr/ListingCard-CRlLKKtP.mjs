import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { f as formatINR, t as timeAgo } from "./format-CVlb_WBO.mjs";
import { A as AppImage } from "./AppImage-DppwVylY.mjs";
import { B as Badge } from "./badge-YM7oB01y.mjs";
import { B as Button, c as cn } from "./button-DjOZMqFS.mjs";
import { B as BadgeCheck, H as Heart, e as MapPin } from "../_libs/lucide-react.mjs";
function ListingCard({
  l,
  onToggleSave,
  saved
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/listing/$id",
      params: { id: l.id },
      className: "group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[4/3] overflow-hidden bg-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AppImage,
            {
              bucket: "listing-images",
              path: l.cover_image,
              alt: l.title,
              className: "h-full w-full transition-transform group-hover:scale-105"
            }
          ),
          l.is_featured && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "absolute left-2 top-2 gap-1 bg-warning text-warning-foreground hover:bg-warning", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-3 w-3" }),
            " Featured"
          ] }),
          onToggleSave && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "icon",
              variant: "secondary",
              className: "absolute right-2 top-2 h-8 w-8 rounded-full bg-background/85 backdrop-blur",
              onClick: (e) => {
                e.preventDefault();
                onToggleSave();
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: cn("h-4 w-4", saved && "fill-destructive text-destructive") })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold tracking-tight", children: l.price !== null ? formatINR(l.price) : "Contact" }),
            l.is_negotiable && l.price !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium uppercase text-muted-foreground", children: "Negotiable" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 line-clamp-2 text-sm font-medium text-foreground/90", children: l.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
              " ",
              l.city ?? "India"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: timeAgo(l.created_at) })
          ] })
        ] })
      ]
    }
  );
}
export {
  ListingCard as L
};
