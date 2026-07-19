import { Link, useLocation } from "@tanstack/react-router";
import { Home, Grid3X3, Plus, MessageCircle, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Capacitor } from "@capacitor/core";

const tabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/browse", icon: Grid3X3, label: "Browse" },
  { to: "/_authenticated/sell", icon: Plus, label: "Sell", highlight: true },
  { to: "/_authenticated/chat", icon: MessageCircle, label: "Chat" },
  { to: "/_authenticated/profile", icon: User, label: "Me" },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  if (!Capacitor.isNativePlatform()) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ to, icon: Icon, label, highlight }) => {
          const href = to.startsWith("/_authenticated") ? to.replace("/_authenticated", "") : to;
          const authHref = to.startsWith("/_authenticated") ? href : to;
          const finalHref = to.startsWith("/_authenticated") && !user ? "/auth" : authHref;

          const isActive =
            finalHref === "/" ? pathname === "/" : pathname.startsWith(finalHref);

          return (
            <Link
              key={to}
              to={finalHref as "/"}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full"
            >
              <div className={`flex items-center justify-center rounded-full transition-colors
                ${highlight
                  ? "h-12 w-12 bg-primary shadow-lg"
                  : "h-8 w-8"
                }`}>
                <Icon
                  className={`transition-colors
                    ${highlight
                      ? "h-6 w-6 text-white"
                      : isActive
                        ? "h-5 w-5 text-primary"
                        : "h-5 w-5 text-muted-foreground"
                    }`}
                />
              </div>
              {!highlight && (
                <span className={`text-[10px] font-medium transition-colors
                  ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
