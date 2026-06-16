import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { l as listListings, c as catsQuery } from "./router-CyR1fJhL.mjs";
import { e as useSearch, d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { a as useSuspenseQuery, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-zCSM-AT2.mjs";
import { L as ListingCard } from "./ListingCard-DSOYv4XB.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { L as Label } from "./label-C8WJLhmR.mjs";
import { B as Button, c as cn } from "./button-DjOZMqFS.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CUSP6kj8.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { X, F as Funnel } from "../_libs/lucide-react.mjs";
import { o as objectType, e as enumType, c as coerce, s as stringType } from "../_libs/zod.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./client-BHmQHd0X.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./server-D1062Wfa.mjs";
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
import "./auth-middleware-DjebvYAq.mjs";
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
import "./format-CVlb_WBO.mjs";
import "./AppImage-DPeZY0bG.mjs";
import "./storage-BFg0-6YF.mjs";
import "./badge-YM7oB01y.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("animate-pulse rounded-md bg-primary/10", className), ...props });
}
objectType({
  q: stringType().optional(),
  category: stringType().optional(),
  city: stringType().optional(),
  minPrice: coerce.number().optional(),
  maxPrice: coerce.number().optional(),
  condition: enumType(["new", "like_new", "good", "fair", "used"]).optional(),
  sort: enumType(["newest", "price_asc", "price_desc"]).optional()
});
function BrowsePage() {
  const s = useSearch({
    from: "/browse"
  });
  const navigate = useNavigate();
  const {
    data: cats
  } = useSuspenseQuery(catsQuery);
  const filters = {
    type: "product",
    ...s
  };
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["listings", filters],
    queryFn: () => listListings({
      data: filters
    })
  });
  const update = (patch) => navigate({
    to: "/browse",
    search: {
      ...s,
      ...patch
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-extrabold", children: "Browse products" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: s.sort ?? "newest", onValueChange: (v) => update({
        sort: v
      }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "newest", children: "Newest" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "price_asc", children: "Price: Low → High" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "price_desc", children: "Price: High → Low" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-[260px_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterPanel, { s, update, cats: cats.filter((c) => c.type === "product") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4", children: Array.from({
        length: 8
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[4/5] rounded-2xl" }, i)) }) : data && data.rows.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-3 text-sm text-muted-foreground", children: [
          data.total,
          " results"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4", children: data.rows.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(ListingCard, { l }, l.id)) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border bg-card p-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No listings match those filters." }) }) })
    ] })
  ] }) });
}
function FilterPanel({
  s,
  update,
  cats
}) {
  const [open, setOpen] = reactExports.useState(false);
  const content = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Filters" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => update({
        q: void 0,
        category: void 0,
        city: void 0,
        minPrice: void 0,
        maxPrice: void 0,
        condition: void 0
      }), children: "Clear" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Search" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: s.q ?? "", onChange: (e) => update({
        q: e.target.value || void 0
      }), placeholder: "Keyword" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: s.category ?? "all", onValueChange: (v) => update({
        category: v === "all" ? void 0 : v
      }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All categories" }),
          cats.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.slug, children: c.name_en }, c.id))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "City" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: s.city ?? "", onChange: (e) => update({
        city: e.target.value || void 0
      }), placeholder: "e.g. Mumbai" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Min ₹" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: s.minPrice ?? "", onChange: (e) => update({
          minPrice: e.target.value ? Number(e.target.value) : void 0
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Max ₹" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: s.maxPrice ?? "", onChange: (e) => update({
          maxPrice: e.target.value ? Number(e.target.value) : void 0
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Condition" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: s.condition ?? "any", onValueChange: (v) => update({
        condition: v === "any" ? void 0 : v
      }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "any", children: "Any" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "new", children: "New" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "like_new", children: "Like new" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "good", children: "Good" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "fair", children: "Fair" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "used", children: "Used" })
        ] })
      ] })
    ] })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "hidden rounded-2xl border bg-card p-4 shadow-card lg:block", children: content }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setOpen((o) => !o), className: "w-full", children: [
        open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-2 h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "mr-2 h-4 w-4" }),
        open ? "Close filters" : "Show filters"
      ] }),
      open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 rounded-2xl border bg-card p-4", children: content })
    ] })
  ] });
}
export {
  BrowsePage as component
};
