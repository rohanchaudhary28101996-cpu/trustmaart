import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell } from "./AppShell-Dy2WFMSs.mjs";
import { s as supabase } from "./client-DHBFCFA_.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { u as useAuth } from "./router-a4rHr5mp.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { r as Bell, a1 as CheckCheck } from "../_libs/lucide-react.mjs";
import { f as formatDistanceToNow } from "../_libs/date-fns.mjs";
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
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "./avatar-FlEjym4Y.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./server-d-TQUncW.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-CeqtaOs5.mjs";
import "../_libs/zod.mjs";
function NotificationsPage() {
  const {
    user
  } = useAuth();
  const [items, setItems] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const load = async () => {
    setLoading(true);
    const {
      data
    } = await supabase.from("notifications").select("*").order("created_at", {
      ascending: false
    }).limit(50);
    setItems(data ?? []);
    setLoading(false);
  };
  reactExports.useEffect(() => {
    if (!user) return;
    load();
    const ch = supabase.channel(`notif-${user.id}`).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "notifications",
      filter: `user_id=eq.${user.id}`
    }, () => load()).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user]);
  const markAllRead = async () => {
    if (!user) return;
    await supabase.from("notifications").update({
      read_at: (/* @__PURE__ */ new Date()).toISOString()
    }).is("read_at", null).eq("user_id", user.id);
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-3xl px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-extrabold tracking-tight", children: "Notifications" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: markAllRead, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "mr-1 h-4 w-4" }),
        " Mark all read"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 space-y-2", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border bg-card p-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No notifications yet." }) }) : items.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-2xl border bg-card p-4 shadow-card ${!n.read_at ? "border-primary/40" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold capitalize", children: n.type.replace(/_/g, " ") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm text-muted-foreground", children: typeof n.payload?.message === "string" ? n.payload.message : JSON.stringify(n.payload) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 text-xs text-muted-foreground", children: formatDistanceToNow(new Date(n.created_at), {
        addSuffix: true
      }) })
    ] }) }, n.id)) })
  ] }) });
}
export {
  NotificationsPage as component
};
