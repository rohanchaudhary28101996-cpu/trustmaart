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
  MapPin,
  ChevronDown,
  X,
  Navigation,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import { useCity, POPULAR_CITIES, useStoredLocation } from "@/lib/city";
import { getMyProfile } from "@/lib/profile.functions";

export function Header() {
  const { user, isSuperAdmin, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useI18n();
  const { city, setCity } = useCity();
  const { lat, useMyLocation, setPincode, pincode, clear: clearLocation } = useStoredLocation();
  const navigate = useNavigate();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [pincodeInput, setPincodeInput] = useState(pincode);
  const [locating, setLocating] = useState(false);
  const { data: myProfile } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => getMyProfile(),
    enabled: !!user,
  });

  async function onUseMyLocation() {
    setLocating(true);
    try {
      await useMyLocation();
      toast.success("Showing listings near you");
      setCityOpen(false);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLocating(false);
    }
  }

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate({ to: "/search", search: { q: q.trim() } });
  };

  const filteredCities = POPULAR_CITIES.filter((c) =>
    !cityInput || c.toLowerCase().includes(cityInput.toLowerCase())
  );

  const locationLabel = lat !== null ? "Near you" : pincode ? `Pincode ${pincode}` : city || "All India";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      {cityOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" onClick={() => setCityOpen(false)}>
          <div className="w-full max-w-md rounded-2xl border bg-card shadow-elevated p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Select your location</h3>
              <Button variant="ghost" size="icon" onClick={() => setCityOpen(false)}><X className="h-4 w-4" /></Button>
            </div>

            <Button
              type="button"
              variant={lat !== null ? "default" : "outline"}
              className="mb-3 w-full"
              onClick={onUseMyLocation}
              disabled={locating}
            >
              {locating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Navigation className="mr-2 h-4 w-4" />}
              {locating ? "Locating…" : lat !== null ? "Using your current location" : "Use my current location"}
            </Button>

            <div className="mb-3 flex items-center gap-2">
              <Input
                placeholder="Or enter your pincode"
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                inputMode="numeric"
              />
              <Button
                type="button"
                variant="outline"
                disabled={pincodeInput.length !== 6}
                onClick={() => { setPincode(pincodeInput); toast.success("Showing listings near pincode " + pincodeInput); setCityOpen(false); }}
              >
                Apply
              </Button>
            </div>

            {(lat !== null || pincode) && (
              <button
                className="mb-3 w-full text-left text-xs text-muted-foreground hover:text-foreground"
                onClick={() => { clearLocation(); setPincodeInput(""); }}
              >
                ✕ Clear precise location
              </button>
            )}

            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> or pick a city <div className="h-px flex-1 bg-border" />
            </div>

            <Input
              placeholder="Search city…"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              className="mb-3"
            />
            {city && (
              <button
                className="mb-2 w-full text-left text-sm text-muted-foreground hover:text-foreground"
                onClick={() => { setCity(""); setCityOpen(false); setCityInput(""); }}
              >
                ✕ Clear — show all India
              </button>
            )}
            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {filteredCities.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCity(c); setCityOpen(false); setCityInput(""); }}
                  className={`rounded-xl border px-2 py-2 text-sm text-left transition-colors hover:bg-primary/10 ${city === c ? "border-primary bg-primary/10 font-medium text-primary" : ""}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
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
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => setCityOpen(true)}
          >
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="max-w-[80px] truncate">{locationLabel}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
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
                  <UserAvatar
                    avatarPath={myProfile?.avatar_url}
                    name={myProfile?.full_name ?? user.email}
                    className="h-8 w-8 text-xs"
                  />
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

      <div className="border-t border-border/60 px-4 py-2 md:hidden">
        <form onSubmit={onSearch} className="flex-1">
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
        <button
          type="button"
          onClick={() => setCityOpen(true)}
          className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span className="max-w-[160px] truncate">{locationLabel}</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
    </header>
  );
}
