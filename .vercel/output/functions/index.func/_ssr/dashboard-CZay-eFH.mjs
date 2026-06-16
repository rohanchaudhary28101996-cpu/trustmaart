import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AdminShell } from "./AdminShell-BehEEcw_.mjs";
import { i as adminOverview } from "./admin.functions-ByUlPAk_.mjs";
import { c as cn } from "./button-DjOZMqFS.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { U as Users, a8 as Package, p as ShoppingBag, W as Clock, u as CircleCheck, v as Circle, Y as TriangleAlert, M as MessageCircle, s as Flag } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "./router-a4rHr5mp.mjs";
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
import "./auth-middleware-CeqtaOs5.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function AdminDashboardPage() {
  const {
    data: stats,
    isLoading
  } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => adminOverview()
  });
  const cards = [{
    label: "Total Users",
    value: stats?.users ?? 0,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" }),
    tone: "text-blue-600"
  }, {
    label: "Total Products",
    value: stats?.products ?? 0,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5" }),
    tone: "text-emerald-600"
  }, {
    label: "Total Sellers",
    value: stats?.sellers ?? 0,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-5 w-5" }),
    tone: "text-sky-600"
  }, {
    label: "Pending Verification",
    value: stats?.pending ?? 0,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5" }),
    tone: "text-amber-600"
  }, {
    label: "Live Ads",
    value: stats?.live ?? 0,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5" }),
    tone: "text-emerald-600"
  }, {
    label: "Rejected Ads",
    value: stats?.rejected ?? 0,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-5 w-5" }),
    tone: "text-rose-600"
  }, {
    label: "Suspended Ads",
    value: stats?.suspended ?? 0,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5" }),
    tone: "text-orange-600"
  }, {
    label: "Total Chats",
    value: stats?.conversations ?? 0,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5" }),
    tone: "text-cyan-600"
  }, {
    label: "Open Reports",
    value: stats?.openReports ?? 0,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-5 w-5" }),
    tone: "text-red-600"
  }, {
    label: "Total Ads",
    value: stats?.ads ?? 0,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5" }),
    tone: "text-slate-600"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Dashboard" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Full platform overview at a glance." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4", children: isLoading ? Array.from({
      length: 10
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-pulse rounded-2xl border bg-card p-4 shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-20 rounded bg-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-8 w-16 rounded bg-muted" })
    ] }, i)) : cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { ...c }, c.label)) })
  ] }) });
}
function StatCard({
  label,
  value,
  icon,
  tone
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-card p-4 shadow-card transition hover:shadow-elevated", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("grid h-9 w-9 place-items-center rounded-xl bg-primary/10", tone), children: icon })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-2xl font-bold tracking-tight", children: value.toLocaleString() })
  ] });
}
export {
  AdminDashboardPage as component
};
