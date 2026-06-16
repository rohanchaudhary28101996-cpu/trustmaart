import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useI18n, h as homeQuery } from "./router-a4rHr5mp.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { a as Sparkles, S as Search, Z as Zap, M as MessageCircle, f as Shield, B as BadgeCheck, A as ArrowRight, I as Icons } from "../_libs/lucide-react.mjs";
import { A as AppShell } from "./AppShell-Dy2WFMSs.mjs";
import { L as ListingCard } from "./ListingCard-CRlLKKtP.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
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
import "./AppImage-DppwVylY.mjs";
import "./storage-Djyz8_2-.mjs";
import "./badge-YM7oB01y.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function HomePage() {
  const {
    data
  } = useSuspenseQuery(homeQuery);
  const {
    t
  } = useI18n();
  const navigate = useNavigate();
  const [q, setQ] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "gradient-hero", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 pb-12 pt-10 md:pb-20 md:pt-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-primary" }),
        " AI-powered marketplace"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-balance text-3xl font-extrabold tracking-tight md:text-5xl", children: t("hero.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-3 max-w-xl text-muted-foreground", children: t("hero.subtitle") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        if (q.trim()) navigate({
          to: "/search",
          search: {
            q: q.trim()
          }
        });
      }, className: "mx-auto mt-6 flex max-w-2xl items-center gap-2 rounded-2xl border bg-card p-2 shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "ml-2 h-4 w-4 shrink-0 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: t("hero.search"), className: "h-10 border-0 bg-transparent shadow-none focus-visible:ring-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", className: "rounded-xl gradient-primary text-primary-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mr-1 h-4 w-4" }),
          " ",
          t("hero.ai_search")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground", children: ["iPhone", "Sofa", "Royal Enfield", "Laptop", "Furniture"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
        to: "/search",
        search: {
          q: s
        }
      }), className: "rounded-full border bg-background/80 px-3 py-1 transition-colors hover:bg-accent", children: s }, s)) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { title: t("section.categories"), link: {
        label: t("label.view_all"),
        to: "/browse"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10", children: data.categories.filter((c) => c.type === "product").slice(0, 10).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryTile, { slug: c.slug, name: c.name_en, icon: c.icon }, c.id)) })
    ] }),
    data.featured.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { title: t("section.featured"), link: {
        label: t("label.view_all"),
        to: "/browse"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4", children: data.featured.slice(0, 8).map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(ListingCard, { l }, l.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { title: t("section.recent"), link: {
        label: t("label.view_all"),
        to: "/browse"
      } }),
      data.recent.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4", children: data.recent.slice(0, 8).map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(ListingCard, { l }, l.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-4 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-3xl border bg-card shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-center gap-4 p-8 md:p-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
          " AI Listing Assistant"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-extrabold tracking-tight md:text-3xl", children: t("section.ai") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Just describe your item — AI writes the title, description, picks a category, and suggests a fair price. List in under a minute." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "gradient-primary text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/sell", children: "Try AI Listing" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/search", search: {
            q: ""
          }, children: "AI Product Finder" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "gradient-hero relative grid place-items-center p-8 md:p-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm rounded-2xl border bg-card p-4 shadow-elevated", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-medium text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-primary" }),
          " AI suggestion"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 text-base font-bold", children: "iPhone 12 Pro 128GB, blue — like-new" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Selling my well-kept iPhone 12 Pro. No scratches, all accessories included. Battery health 89%." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-baseline justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-extrabold", children: "₹38,000" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Suggested price" })
        ] })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-center text-2xl font-extrabold tracking-tight md:text-3xl", children: t("section.how") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-5 md:grid-cols-3", children: [{
        icon: Zap,
        title: "Post in seconds",
        desc: "Upload photos, let AI write the listing, publish to thousands of buyers."
      }, {
        icon: MessageCircle,
        title: "Chat directly",
        desc: "Real-time private messages — agree on price and meet locally."
      }, {
        icon: Shield,
        title: "Built-in safety",
        desc: "Verified sellers, easy reporting, and a dedicated trust team."
      }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-card p-6 shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 text-lg font-bold", children: s.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: s.desc })
      ] }, s.title)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-4 pb-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl border bg-gradient-to-br from-primary/10 via-accent/30 to-transparent p-8 md:p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid items-center gap-6 md:grid-cols-[1fr_auto]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1 text-xs font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-3 w-3 text-primary" }),
          " Trust & safety"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-2xl font-extrabold md:text-3xl", children: t("section.trust") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-2xl text-muted-foreground", children: "Phone-verified sellers, in-app chat (we never share your number), one-tap reporting, and a moderation team that reviews every report." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", className: "gradient-primary text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/help", children: [
        "Learn more ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1 h-4 w-4" })
      ] }) })
    ] }) }) })
  ] });
}
function SectionHeader({
  title,
  link
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-extrabold tracking-tight md:text-2xl", children: title }),
    link && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: link.to, className: "text-sm font-medium text-primary hover:underline", children: [
      link.label,
      " →"
    ] })
  ] });
}
function CategoryTile({
  slug,
  name,
  icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/browse", search: {
    category: slug
  }, className: "group flex flex-col items-center gap-2 rounded-2xl border bg-card p-3 text-center shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconRender, { name: icon, className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: name })
  ] });
}
function IconRender({
  name,
  className
}) {
  const Icon = name && Icons[name] || Sparkles;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className });
}
function EmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-2xl border bg-card p-10 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No listings yet — be the first to post!" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-4 gradient-primary text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/sell", children: "Post your ad" }) })
  ] });
}
export {
  HomePage as component
};
