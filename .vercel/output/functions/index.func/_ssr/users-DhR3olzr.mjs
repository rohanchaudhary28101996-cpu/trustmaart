import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { b as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as AdminShell } from "./AdminShell-BehEEcw_.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { B as Badge } from "./badge-YM7oB01y.mjs";
import { C as Card } from "./card-BtiUI6Md.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-D9SBQmWA.mjs";
import { a as adminListUsers, b as adminToggleUserFlag, c as adminAssignRole } from "./admin.functions-ByUlPAk_.mjs";
import { t as timeAgo } from "./format-CVlb_WBO.mjs";
import { u as useAuth } from "./router-a4rHr5mp.mjs";
import "../_libs/seroval.mjs";
import { S as Search, m as Crown, B as BadgeCheck, n as UserCheck, o as Ban, f as Shield, p as ShoppingBag, M as MessageCircle } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "./server-d-TQUncW.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-CeqtaOs5.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
import "./client-DHBFCFA_.mjs";
function UsersPage() {
  const qc = useQueryClient();
  const {
    isSuperAdmin
  } = useAuth();
  const [q, setQ] = reactExports.useState("");
  const [viewUser, setViewUser] = reactExports.useState(null);
  const {
    data: users = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-users", q],
    queryFn: () => adminListUsers({
      data: {
        q: q || void 0
      }
    })
  });
  async function toggleFlag(uid, flag, value) {
    try {
      await adminToggleUserFlag({
        data: {
          user_id: uid,
          flag,
          value
        }
      });
      qc.invalidateQueries({
        queryKey: ["admin-users"]
      });
      toast.success(value ? flag === "is_verified" ? "User verified" : "User banned" : flag === "is_verified" ? "Verification removed" : "User unbanned");
    } catch (e) {
      toast.error(e.message);
    }
  }
  async function setRole(uid, role, grant) {
    try {
      await adminAssignRole({
        data: {
          user_id: uid,
          role,
          grant
        }
      });
      qc.invalidateQueries({
        queryKey: ["admin-users"]
      });
      toast.success(grant ? `Made ${role}` : `Revoked ${role}`);
    } catch (e) {
      toast.error(e.message);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Users" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Search, verify, ban, and manage user roles." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search by name…", className: "pl-9" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "h-9 px-3", children: [
          users.length,
          " users"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-2", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }) : users.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 text-center text-sm text-muted-foreground", children: "No users found." }) : users.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex flex-wrap items-center gap-3 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted", children: u.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u.avatar_url, alt: u.full_name ?? "User", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-full w-full place-items-center text-xs font-bold text-primary", children: (u.full_name ?? "U").slice(0, 1).toUpperCase() }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: u.full_name ?? "User" }),
            u.roles.includes("super_admin") && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "gap-1 bg-amber-500 hover:bg-amber-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3 w-3" }),
              " Super"
            ] }),
            u.roles.includes("admin") && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: "Admin" }),
            u.roles.includes("moderator") && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: "Mod" }),
            u.is_verified && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "gap-1 bg-emerald-500 hover:bg-emerald-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-3 w-3" }),
              " Verified"
            ] }),
            u.is_blocked && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", children: "Blocked" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            u.city ?? "—",
            " · ",
            u.phone ?? "no phone",
            " · joined ",
            timeAgo(u.created_at)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => setViewUser(u), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "mr-1 h-3 w-3" }),
            " View"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: u.is_verified ? "default" : "outline", onClick: () => toggleFlag(u.id, "is_verified", !u.is_verified), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "mr-1 h-3 w-3" }),
            " ",
            u.is_verified ? "Unverify" : "Verify"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: u.is_blocked ? "default" : "outline", onClick: () => toggleFlag(u.id, "is_blocked", !u.is_blocked), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "mr-1 h-3 w-3" }),
            " ",
            u.is_blocked ? "Unban" : "Ban"
          ] }),
          isSuperAdmin && !u.roles.includes("super_admin") && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: u.roles.includes("admin") ? "default" : "outline", onClick: () => setRole(u.id, "admin", !u.roles.includes("admin")), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "mr-1 h-3 w-3" }),
            " ",
            u.roles.includes("admin") ? "Revoke Admin" : "Make Admin"
          ] })
        ] })
      ] }, u.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!viewUser, onOpenChange: () => setViewUser(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "User Details" }) }),
      viewUser && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 overflow-hidden rounded-full bg-muted", children: viewUser.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: viewUser.avatar_url, alt: viewUser.full_name ?? "User", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-full w-full place-items-center text-sm font-bold text-primary", children: (viewUser.full_name ?? "U").slice(0, 1).toUpperCase() }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: viewUser.full_name ?? "User" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: viewUser.city ?? "—" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: viewUser.phone ?? "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Joined" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: timeAgo(viewUser.created_at) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Verified" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: viewUser.is_verified ? "Yes" : "No" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Blocked" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: viewUser.is_blocked ? "Yes" : "No" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 rounded-lg border bg-card p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "mx-auto h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: "Listings" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 rounded-lg border bg-card p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "mx-auto h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: "Chats" })
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  UsersPage as component
};
