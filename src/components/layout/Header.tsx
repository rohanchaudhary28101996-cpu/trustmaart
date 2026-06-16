import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import {
  Search,
  Plus,
  MessageCircle,
  Heart,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Crown,
  Moon,
  Sun,
  Languages,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";

export function Header() {
  const { user, isSuperAdmin, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();
  const router = useRouter();
  const [q, setQ] = useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate({ to: "/search", search: { q: q.trim() } });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground font-bold shadow-card">
            T
          </div>
          <span className="hidden text-lg font-extrabold tracking-tight sm:inline">
            Trust<span className="text-primary">Maart</span>
          </span>
        </Link>

        <form onSubmit={onSearch} className="hidden flex-1 md:flex">
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("hero.search")}
              className="h-10 rounded-full bg-secondary/60 pl-9 pr-4"
            />
          </div>
        </form>

        <nav className="ml-auto flex items-center gap-1">
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link to="/browse">{t("nav.browse")}</Link>
          </Button>

          <Button asChild size="sm" className="rounded-full gradient-primary text-primary-foreground shadow-card">
            <Link to="/sell">
              <Plus className="mr-1 h-4 w-4" />
              {t("nav.sell")}
            </Link>
          </Button>

          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {isSuperAdmin && (
            <Button asChild size="sm" variant="outline" className="hidden md:inline-flex gap-1 text-amber-600 border-amber-200 hover:bg-amber-50">
              <Link to="/admin/dashboard">
                <Crown className="h-4 w-4" />
                Admin Panel
              </Link>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Language">
                <Languages className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLang("en")}>
                English {lang === "en" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("hi")}>
                हिंदी {lang === "hi" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                      {(user.email ?? "U").slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {t("nav.dashboard")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/chat">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {t("nav.chat")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/wishlist">
                    <Heart className="mr-2 h-4 w-4" />
                    {t("nav.wishlist")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <UserIcon className="mr-2 h-4 w-4" />
                    {t("nav.profile")}
                  </Link>
                </DropdownMenuItem>
                {isSuperAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin/dashboard">
                      <Crown className="mr-2 h-4 w-4 text-amber-500" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut();
                    router.invalidate();
                    navigate({ to: "/" });
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link to="/auth">{t("nav.login")}</Link>
            </Button>
          )}
        </nav>
      </div>

      <form onSubmit={onSearch} className="border-t border-border/60 px-4 py-2 md:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("hero.search")}
            className="h-10 rounded-full bg-secondary/60 pl-9 pr-4"
          />
        </div>
      </form>
    </header>
  );
}
