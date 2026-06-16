import type { ReactNode } from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, Users, Clock, CircleCheck as CheckCircle2, Circle as XCircle, TriangleAlert as AlertTriangle, MessageCircle, Bell, Settings, LogOut, Shield, Menu, X, Crown, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

type NavItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { to: "/admin/users", label: "Users", icon: <Users className="h-4 w-4" /> },
  { to: "/admin/pending-ads", label: "Pending Approval", icon: <Clock className="h-4 w-4" /> },
  { to: "/admin/live-listings", label: "Live Ads", icon: <CheckCircle2 className="h-4 w-4" /> },
  { to: "/admin/rejected-listings", label: "Rejected Ads", icon: <XCircle className="h-4 w-4" /> },
  { to: "/admin/reported-listings", label: "Reports", icon: <AlertTriangle className="h-4 w-4" /> },
  { to: "/admin/chat-monitoring", label: "Chat Monitoring", icon: <MessageCircle className="h-4 w-4" /> },
  { to: "/admin/notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
  { to: "/admin/action-logs", label: "Action Logs", icon: <History className="h-4 w-4" /> },
  { to: "/admin/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { user, isSuperAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.invalidate();
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-card md:flex">
        <div className="flex items-center gap-2 border-b px-5 py-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-card">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-bold">TrustMaart Admin</div>
            <div className="text-[11px] text-muted-foreground">
              {isSuperAdmin ? "Super Admin" : "Admin"}
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {navItems.map((it) => (
            <AdminNavLink key={it.to} item={it} />
          ))}
        </nav>

        <div className="border-t p-3">
          <div className="mb-2 flex items-center gap-2 px-2">
            <div className="h-7 w-7 overflow-hidden rounded-full bg-muted">
              <span className="grid h-full w-full place-items-center text-xs font-bold text-primary">
                {(user?.email ?? "A").slice(0, 1).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <div className="truncate text-xs font-medium">{user?.email ?? "Admin"}</div>
            </div>
            {isSuperAdmin && <Crown className="h-3 w-3 shrink-0 text-amber-500" />}
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
          <div className="mt-2 text-center text-[10px] text-muted-foreground">TrustMaart Admin v1.0</div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-card px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg gradient-primary text-primary-foreground">
              <Shield className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold">Admin</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen((o) => !o)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {mobileOpen && (
          <div className="border-b bg-card md:hidden">
            <nav className="p-2">
              {navItems.map((it) => (
                <AdminNavLink key={it.to} item={it} onClick={() => setMobileOpen(false)} />
              ))}
              <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </nav>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

function AdminNavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const router = useRouter();
  const currentPath = router.state.location.pathname;
  const isActive = currentPath === item.to || currentPath.startsWith(item.to + "/");

  return (
    <Link
      to={item.to}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
        isActive
          ? "bg-primary text-primary-foreground shadow-card"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
      onClick={onClick}
    >
      {item.icon}
      {item.label}
    </Link>
  );
}
