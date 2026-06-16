import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, Plus, MessageCircle, User as UserIcon, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

type NavItem = { to: string; label: string; icon: typeof Home; highlight?: boolean };

export function MobileNav() {
  const { pathname } = useLocation();
  const { isAdmin } = useAuth();

  const items: NavItem[] = [
    { to: "/", label: "Home", icon: Home },
    { to: "/browse", label: "Browse", icon: Search },
    { to: "/sell", label: "Sell", icon: Plus, highlight: true },
    { to: "/chat", label: "Chat", icon: MessageCircle },
    isAdmin
      ? { to: "/admin/dashboard", label: "Admin", icon: Crown }
      : { to: "/dashboard", label: "Me", icon: UserIcon },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur md:hidden">
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 py-1.5">
        {items.map((it) => {
          const active = pathname === it.to || (it.to !== "/" && pathname.startsWith(it.to));
          const Icon = it.icon;
          return (
            <li key={it.to} className="flex-1">
              <Link
                to={it.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-medium",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full",
                    it.highlight && "gradient-primary text-primary-foreground shadow-card",
                    active && !it.highlight && "bg-primary/10",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
