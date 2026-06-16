import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-Dy2WFMSs.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { L as ListingCard } from "./ListingCard-CRlLKKtP.mjs";
import { a as aiSearchListings } from "./ai.functions-BarVfyC3.mjs";
import { R as Route$t } from "./router-a4rHr5mp.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import { S as Search, a as Sparkles, L as LoaderCircle } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
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
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "./avatar-FlEjym4Y.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./format-CVlb_WBO.mjs";
import "./AppImage-DppwVylY.mjs";
import "./storage-Djyz8_2-.mjs";
import "./client-DHBFCFA_.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./badge-YM7oB01y.mjs";
import "./server-d-TQUncW.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/zod.mjs";
import "./auth-middleware-CeqtaOs5.mjs";
function SearchPage() {
  const {
    q
  } = Route$t.useSearch();
  const navigate = useNavigate();
  const [input, setInput] = reactExports.useState(q ?? "");
  const {
    data,
    isLoading,
    isFetching
  } = useQuery({
    queryKey: ["ai-search", q],
    queryFn: () => aiSearchListings({
      data: {
        q
      }
    }),
    enabled: !!q && q.length >= 2
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "flex gap-2", onSubmit: (e) => {
      e.preventDefault();
      if (input.trim()) navigate({
        to: "/search",
        search: {
          q: input.trim()
        }
      });
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: input, onChange: (e) => setInput(e.target.value), placeholder: 'Ask in plain English: "used iPhone under 25000 in Delhi"', className: "h-12 rounded-full bg-secondary/60 pl-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", size: "lg", className: "rounded-full gradient-primary text-primary-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mr-2 h-4 w-4" }),
        " Ask AI"
      ] })
    ] }),
    q && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: isLoading || isFetching ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
      " AI is searching…"
    ] }) : data ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-xl border bg-card/60 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mr-1 inline h-4 w-4 text-primary" }),
        data.filters.summary
      ] }) }),
      data.rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No results yet. Try different keywords." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4", children: data.rows.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(ListingCard, { l }, l.id)) })
    ] }) : null })
  ] }) });
}
export {
  SearchPage as component
};
