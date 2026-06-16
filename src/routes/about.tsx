import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Sparkles, Shield, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About TrustMaart — India's modern marketplace" },
      { name: "description", content: "TrustMaart is India's AI-powered marketplace for second-hand products and local services. Built for trust, speed and simplicity." },
      { property: "og:title", content: "About TrustMaart" },
      { property: "og:description", content: "AI-powered second-hand marketplace and local services for India." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <AppShell>
      <section className="gradient-hero">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary" /> Our story
          </div>
          <h1 className="mt-4 text-balance text-3xl font-extrabold tracking-tight md:text-5xl">
            India's modern marketplace, built on <span className="text-primary">trust</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            TrustMaart helps millions of Indians buy, sell, and hire — locally and safely.
            From pre-loved phones to neighbourhood electricians, we make discovery effortless with AI
            and conversations human with real-time chat.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button asChild className="gradient-primary text-primary-foreground">
              <Link to="/browse">Browse products</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/sell">Sell on TrustMaart</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-12 md:grid-cols-3">
        {[
          { icon: Sparkles, title: "AI-powered", desc: "Auto-generated listings and natural-language search make every transaction faster." },
          { icon: Shield, title: "Trust & safety first", desc: "Verified sellers, in-app chat, and a dedicated moderation team." },
          { icon: Users, title: "Hyper-local", desc: "Find buyers, sellers and service providers in your own city and locality." },
        ].map((v) => (
          <div key={v.title} className="rounded-2xl border bg-card p-6 shadow-card">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <v.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-3 text-lg font-bold">{v.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="rounded-3xl border bg-card p-8 shadow-card">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <Globe className="h-4 w-4" /> Our mission
          </div>
          <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
            Make second-hand the first choice for every Indian household.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every product reused saves money and the planet. TrustMaart's mission is to make buying and
            selling pre-owned goods — and finding trusted local services — as simple as sending a message.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
