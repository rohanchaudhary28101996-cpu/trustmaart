import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AdminShell } from "./AdminShell-CeObc2vi.mjs";
import { C as Card } from "./card-BtiUI6Md.mjs";
import { B as Badge } from "./badge-YM7oB01y.mjs";
import { s as supabase } from "./client-BHmQHd0X.mjs";
import { t as timeAgo } from "./format-CVlb_WBO.mjs";
import { c as cn } from "./button-DjOZMqFS.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { a1 as CheckCheck, a2 as CircleAlert, a3 as Info, a4 as MessageSquare } from "../_libs/lucide-react.mjs";
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
import "./router-CyR1fJhL.mjs";
import "./server-D1062Wfa.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-DjebvYAq.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/tailwind-merge.mjs";
function AdminNotificationsPage() {
  const {
    data: notifications = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("notifications").select("*").order("created_at", {
        ascending: false
      }).limit(100);
      return data ?? [];
    }
  });
  const typeIcon = (type) => {
    if (type.includes("listing_approve")) return /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "h-4 w-4 text-emerald-500" });
    if (type.includes("listing_reject")) return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-rose-500" });
    if (type.includes("listing_suspend")) return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-500" });
    if (type.includes("listing_request_changes")) return /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-sky-500" });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-4 w-4 text-primary" });
  };
  const typeColor = (type) => {
    if (type.includes("listing_approve")) return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400";
    if (type.includes("listing_reject")) return "bg-rose-500/15 text-rose-700 dark:text-rose-400";
    if (type.includes("listing_suspend")) return "bg-amber-500/15 text-amber-700 dark:text-amber-400";
    if (type.includes("listing_request_changes")) return "bg-sky-500/15 text-sky-700 dark:text-sky-400";
    return "bg-muted text-foreground";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Notifications" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "All platform notifications and alerts." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-2", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }) : notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 text-center text-sm text-muted-foreground", children: "No notifications yet." }) : notifications.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn("flex items-start gap-3 p-3", !n.read_at && "border-primary/40"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 shrink-0", children: typeIcon(n.type) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium capitalize", children: n.type.replace(/_/g, " ") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("capitalize", typeColor(n.type)), variant: "secondary", children: n.type.replace(/_/g, " ") }),
          !n.read_at && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "default", className: "h-5 px-1.5 text-[10px]", children: "New" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm text-muted-foreground", children: typeof n.payload?.message === "string" ? n.payload.message : JSON.stringify(n.payload) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: timeAgo(n.created_at) })
      ] })
    ] }, n.id)) })
  ] }) });
}
export {
  AdminNotificationsPage as component
};
