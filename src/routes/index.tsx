import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Sparkles, Search, Shield, MessageCircle, BadgeCheck, ArrowRight, Zap } from "lucide-react";
import * as Icons from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getHomeData } from "@/lib/listings.functions";
import { useI18n } from "@/lib/i18n";

const homeQuery = queryOptions({
  queryKey: ["home"],
  queryFn: () => getHomeData(),
  staleTime: 30_000,
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrustMaart — Buy & sell second-hand products across India" },
      { name: "description", content: "India's modern marketplace for second-hand products. AI-powered listings, real-time chat, trusted sellers." },
      { property: "og:title", content: "TrustMaart — Buy & sell second-hand products across India" },
      { property: "og:description", content: "AI-powered second-hand marketplace for India. Find deals on mobiles, electronics, furniture and more." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(homeQuery),
  component: HomePage,
});

function HomePage() {
  const { data } = useSuspenseQuery(homeQuery);
  const { t } = useI18n();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  return (
    <AppShell>
      {/* HERO */}
      <section className="gradient-hero">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-10 md:pb-20 md:pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" /> AI-powered marketplace
            </div>
            <h1 className="mt-4 text-balance text-3xl font-extrabold tracking-tight md:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t("hero.subtitle")}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (q.trim()) navigate({ to: "/search", search: { q: q.trim() } });
              }}
              className="mx-auto mt-6 flex max-w-2xl items-center gap-2 rounded-2xl border bg-card p-2 shadow-card"
            >
              <Search className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("hero.search")}
                className="h-10 border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <Button type="submit" className="rounded-xl gradient-primary text-primary-foreground">
                <Sparkles className="mr-1 h-4 w-4" /> {t("hero.ai_search")}
              </Button>
            </form>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              {["iPhone", "Sofa", "Royal Enfield", "Laptop", "Furniture"].map((s) => (
                <button
                  key={s}
                  onClick={() => navigate({ to: "/search", search: { q: s } })}
                  className="rounded-full border bg-background/80 px-3 py-1 transition-colors hover:bg-accent"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionHeader title={t("section.categories")} link={{ label: t("label.view_all"), to: "/categories" }} />
        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10">
          {data.categories
            .filter((c) => c.type === "product")
            .slice(0, 10)
            .map((c) => (
              <CategoryTile key={c.id} slug={c.slug} name={c.name_en} icon={c.icon} />
            ))}
        </div>
      </section>

      {/* FEATURED */}
      {data.featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-6">
          <SectionHeader title={t("section.featured")} link={{ label: t("label.view_all"), to: "/browse" }} />
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.featured.slice(0, 8).map((l) => (
              <ListingCard key={l.id} l={l} />
            ))}
          </div>
        </section>
      )}

      {/* RECENT */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <SectionHeader title={t("section.recent")} link={{ label: t("label.view_all"), to: "/browse" }} />
        {data.recent.length ? (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.recent.slice(0, 8).map((l) => (
              <ListingCard key={l.id} l={l} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>


      {/* AI ASSISTANT */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="overflow-hidden rounded-3xl border bg-card shadow-card">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col justify-center gap-4 p-8 md:p-10">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3 w-3" /> AI Listing Assistant
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">{t("section.ai")}</h2>
              <p className="text-muted-foreground">
                Just describe your item — AI writes the title, description, picks a category, and suggests a fair price. List in under a minute.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild className="gradient-primary text-primary-foreground">
                  <Link to="/sell">Try AI Listing</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/search" search={{ q: "" }}>AI Product Finder</Link>
                </Button>
              </div>
            </div>
            <div className="gradient-hero relative grid place-items-center p-8 md:p-10">
              <div className="w-full max-w-sm rounded-2xl border bg-card p-4 shadow-elevated">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-primary" /> AI suggestion
                </div>
                <h3 className="mt-2 text-base font-bold">iPhone 12 Pro 128GB, blue — like-new</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Selling my well-kept iPhone 12 Pro. No scratches, all accessories included. Battery health 89%.
                </p>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-lg font-extrabold">₹38,000</span>
                  <span className="text-xs text-muted-foreground">Suggested price</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="text-center text-2xl font-extrabold tracking-tight md:text-3xl">{t("section.how")}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            { icon: Zap, title: "Post in seconds", desc: "Upload photos, let AI write the listing, publish to thousands of buyers." },
            { icon: MessageCircle, title: "Chat directly", desc: "Real-time private messages — agree on price and meet locally." },
            { icon: Shield, title: "Built-in safety", desc: "Verified sellers, easy reporting, and a dedicated trust team." },
          ].map((s) => (
            <div key={s.title} className="rounded-2xl border bg-card p-6 shadow-card">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="rounded-3xl border bg-gradient-to-br from-primary/10 via-accent/30 to-transparent p-8 md:p-12">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1 text-xs font-semibold">
                <BadgeCheck className="h-3 w-3 text-primary" /> Trust & safety
              </div>
              <h2 className="mt-3 text-2xl font-extrabold md:text-3xl">{t("section.trust")}</h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Phone-verified sellers, in-app chat (we never share your number), one-tap reporting, and a moderation team that reviews every report.
              </p>
            </div>
            <Button asChild size="lg" className="gradient-primary text-primary-foreground">
              <Link to="/help">Learn more <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function SectionHeader({ title, link }: { title: string; link?: { label: string; to: string } }) {
  return (
    <div className="flex items-end justify-between">
      <h2 className="text-xl font-extrabold tracking-tight md:text-2xl">{title}</h2>
      {link && (
        <Link to={link.to} className="text-sm font-medium text-primary hover:underline">
          {link.label} →
        </Link>
      )}
    </div>
  );
}

function CategoryTile({ slug, name, icon }: { slug: string; name: string; icon: string | null }) {
  return (
    <Link
      to="/browse"
      search={{ category: slug }}
      className="group flex flex-col items-center gap-2 rounded-2xl border bg-card p-3 text-center shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
    >
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
        <IconRender name={icon} className="h-5 w-5" />
      </span>
      <span className="text-xs font-medium">{name}</span>
    </Link>
  );
}

function toPascalCase(str: string) {
  return str.replace(/(^\w|-\w)/g, (c) => c.replace("-", "").toUpperCase());
}

function IconRender({ name, className }: { name: string | null; className?: string }) {
  const key = name ? toPascalCase(name) : null;
  const Icon = (key && (Icons as unknown as Record<string, typeof Sparkles>)[key]) || Sparkles;
  return <Icon className={className} />;
}

function EmptyState() {
  return (
    <div className="mt-6 rounded-2xl border bg-card p-10 text-center">
      <p className="text-sm text-muted-foreground">No listings yet — be the first to post!</p>
      <Button asChild className="mt-4 gradient-primary text-primary-foreground">
        <Link to="/sell">Post your ad</Link>
      </Button>
    </div>
  );
}
