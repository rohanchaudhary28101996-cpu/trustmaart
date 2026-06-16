import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AdminShell } from "./AdminShell-BehEEcw_.mjs";
import { C as Card } from "./card-BtiUI6Md.mjs";
import { B as Badge } from "./badge-YM7oB01y.mjs";
import { l as adminGetActionLogs } from "./admin.functions-ByUlPAk_.mjs";
import { t as timeAgo } from "./format-CVlb_WBO.mjs";
import { c as cn } from "./button-DjOZMqFS.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { _ as History, t as User, h as Calendar, a9 as FileText } from "../_libs/lucide-react.mjs";
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
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/tailwind-merge.mjs";
function ActionLogsPage() {
  const {
    data: logs = [],
    error,
    isError,
    isLoading
  } = useQuery({
    queryKey: ["admin-action-logs"],
    queryFn: () => adminGetActionLogs({
      data: {
        limit: 100,
        offset: 0
      }
    }),
    retry: 1
  });
  const actionColor = {
    approve_listing: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    reject_listing: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
    suspend_listing: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    delete_listing: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
    edit_listing: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
    feature_listing: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
    unfeature_listing: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
    verify_user: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    unverify_user: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
    ban_user: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
    unban_user: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    grant_role: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
    revoke_role: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
    resolve_report_reviewed: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
    resolve_report_dismissed: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
    resolve_report_actioned: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Action Logs" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Complete audit trail of all admin actions." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-2", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-8 text-center text-sm text-muted-foreground", children: [
      "Could not load action logs: ",
      error instanceof Error ? error.message : "Please try again."
    ] }) : logs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 text-center text-sm text-muted-foreground", children: "No action logs yet." }) : logs.map((log) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "flex flex-wrap items-center gap-3 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("capitalize", actionColor[log.action] ?? "bg-muted text-foreground"), variant: "secondary", children: log.action.replace(/_/g, " ") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "inline h-3 w-3 mr-0.5" }),
          log.admin_email || log.admin_id?.slice(0, 8) + "…"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "inline h-3 w-3 mr-0.5" }),
          " ",
          timeAgo(log.created_at)
        ] }),
        log.target_type && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Target: ",
          log.target_type
        ] }),
        log.target_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "ID: ",
          log.target_id.slice(0, 8),
          "…"
        ] })
      ] }),
      log.details && Object.keys(log.details).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "inline h-3 w-3 mr-0.5" }),
        JSON.stringify(log.details).slice(0, 120)
      ] })
    ] }) }, log.id)) })
  ] }) });
}
export {
  ActionLogsPage as component
};
