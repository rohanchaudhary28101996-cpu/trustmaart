import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button, c as cn } from "./button-DjOZMqFS.mjs";
import { u as useAuth } from "./router-CyR1fJhL.mjs";
import { f as Shield, m as Crown, J as LogOut, X, V as Menu, D as LayoutDashboard, U as Users, W as Clock, u as CircleCheck, v as Circle, Y as TriangleAlert, M as MessageCircle, r as Bell, _ as History, $ as Settings } from "../_libs/lucide-react.mjs";
const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "h-4 w-4" }) },
  { to: "/admin/users", label: "Users", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }) },
  { to: "/admin/pending-ads", label: "Pending Approval", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }) },
  { to: "/admin/live-listings", label: "Live Ads", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }) },
  { to: "/admin/rejected-listings", label: "Rejected Ads", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-4 w-4" }) },
  { to: "/admin/reported-listings", label: "Reports", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }) },
  { to: "/admin/chat-monitoring", label: "Chat Monitoring", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }) },
  { to: "/admin/notifications", label: "Notifications", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4" }) },
  { to: "/admin/action-logs", label: "Action Logs", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4" }) },
  { to: "/admin/settings", label: "Settings", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4" }) }
];
function AdminShell({ children }) {
  const { user, isSuperAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const handleLogout = async () => {
    await signOut();
    router.invalidate();
    navigate({ to: "/admin/login" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen bg-muted/20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden w-64 shrink-0 flex-col border-r bg-card md:flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b px-5 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold", children: "TrustMaart Admin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: isSuperAdmin ? "Super Admin" : "Admin" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 overflow-y-auto p-2", children: navItems.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsx(AdminNavLink, { item: it }, it.to)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-2 px-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-full w-full place-items-center text-xs font-bold text-primary", children: (user?.email ?? "A").slice(0, 1).toUpperCase() }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-xs font-medium", children: user?.email ?? "Admin" }) }),
          isSuperAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3 w-3 shrink-0 text-amber-500" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "w-full justify-start text-muted-foreground", onClick: handleLogout, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "mr-2 h-4 w-4" }),
          " Logout"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-center text-[10px] text-muted-foreground", children: "TrustMaart Admin v1.0" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between border-b bg-card px-4 py-3 md:hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-8 w-8 place-items-center rounded-lg gradient-primary text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold", children: "Admin" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => setMobileOpen((o) => !o), children: mobileOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" }) })
      ] }),
      mobileOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b bg-card md:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "p-2", children: [
        navItems.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsx(AdminNavLink, { item: it, onClick: () => setMobileOpen(false) }, it.to)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "w-full justify-start text-muted-foreground", onClick: handleLogout, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "mr-2 h-4 w-4" }),
          " Logout"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto p-4 md:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl", children }) })
    ] })
  ] });
}
function AdminNavLink({ item, onClick }) {
  const router = useRouter();
  const currentPath = router.state.location.pathname;
  const isActive = currentPath === item.to || currentPath.startsWith(item.to + "/");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: item.to,
      className: cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
        isActive ? "bg-primary text-primary-foreground shadow-card" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      ),
      onClick,
      children: [
        item.icon,
        item.label
      ]
    }
  );
}
export {
  AdminShell as A
};
