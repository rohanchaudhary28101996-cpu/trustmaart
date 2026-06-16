import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { b as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as AdminShell } from "./AdminShell-CeObc2vi.mjs";
import { c as cn, B as Button } from "./button-DjOZMqFS.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { B as Badge } from "./badge-YM7oB01y.mjs";
import { C as Card } from "./card-BtiUI6Md.mjs";
import { d as adminListReports, e as adminResolveReport } from "./admin.functions-BHbih5rP.mjs";
import { t as timeAgo } from "./format-CVlb_WBO.mjs";
import "../_libs/seroval.mjs";
import { S as Search, s as Flag, t as User, h as Calendar, u as CircleCheck, E as Eye, v as Circle } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "./router-CyR1fJhL.mjs";
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
import "./auth-middleware-DjebvYAq.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function ReportedListingsPage() {
  const qc = useQueryClient();
  const [q, setQ] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const {
    data: reports = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-reports", q, statusFilter],
    queryFn: () => adminListReports()
  });
  const filtered = reports.filter((r) => {
    const matchesSearch = !q || r.reason.toLowerCase().includes(q.toLowerCase()) || r.target_id.toLowerCase().includes(q.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  async function resolve(id, status) {
    try {
      await adminResolveReport({
        data: {
          id,
          status
        }
      });
      qc.invalidateQueries({
        queryKey: ["admin-reports"]
      });
      qc.invalidateQueries({
        queryKey: ["admin-overview"]
      });
      toast.success(`Report ${status}`);
    } catch (e) {
      toast.error(e.message);
    }
  }
  const statusColor = {
    open: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
    reviewed: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
    dismissed: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
    actioned: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Reported Listings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Review user reports and take action." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search reports…", className: "pl-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "h-9 rounded-md border bg-background px-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "open", children: "Open" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "reviewed", children: "Reviewed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "dismissed", children: "Dismissed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "actioned", children: "Actioned" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "h-9 px-3", children: [
        filtered.length,
        " reports"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-2", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 text-center text-sm text-muted-foreground", children: "No reports found." }) : filtered.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex flex-wrap items-center gap-3 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-4 w-4 text-rose-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium capitalize", children: [
            "[",
            r.target_type,
            "] ",
            r.target_id.slice(0, 8),
            "…"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("capitalize", statusColor[r.status]), variant: "secondary", children: r.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3 w-3" }),
            " Reporter: ",
            r.reporter_id.slice(0, 8),
            "…"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
            " ",
            timeAgo(r.created_at)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm", children: r.reason })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
        r.status === "open" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "bg-emerald-600 text-white hover:bg-emerald-700", onClick: () => resolve(r.id, "actioned"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mr-1 h-3 w-3" }),
            " Action"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => resolve(r.id, "reviewed"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "mr-1 h-3 w-3" }),
            " Reviewed"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", onClick: () => resolve(r.id, "dismissed"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "mr-1 h-3 w-3" }),
            " Dismiss"
          ] })
        ] }),
        r.status !== "open" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Resolved" })
      ] })
    ] }, r.id)) })
  ] }) });
}
export {
  ReportedListingsPage as component
};
