import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { LifeBuoy, ShieldCheck, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Support — TrustMaart" },
      { name: "description", content: "Get answers about buying, selling, safety and AI features on TrustMaart." },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  { q: "How do I list a product?", a: "Tap 'Sell' from the menu, upload up to 10 photos, and let our AI assistant generate the title, description and price. You can edit anything before publishing." },
  { q: "Is TrustMaart free to use?", a: "Yes — creating an account, listing items and chatting with buyers or sellers is completely free." },
  { q: "How does chat work?", a: "Once you find a listing you like, tap 'Chat with seller'. Messages are delivered in real time and we never share your phone number." },
  { q: "How do I stay safe?", a: "Always meet in a public place, inspect the item before paying, and avoid sharing OTPs. Use the 'Report' button on any suspicious listing or user." },
  { q: "What is the AI Listing Assistant?", a: "Upload photos and a short note — our AI writes a polished title, description and suggests a fair price. You stay in full control and can edit before publishing." },
  { q: "How do I get a verified badge?", a: "Verify your phone number and complete your profile. Sellers with consistent positive reviews are eligible for the verified badge." },
];

function HelpPage() {
  return (
    <AppShell>
      <section className="gradient-hero">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <LifeBuoy className="h-3 w-3 text-primary" /> Help center
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">How can we help?</h1>
          <p className="mt-3 text-muted-foreground">
            Browse common questions or reach out to our support team — we usually reply within a few hours.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10">
        <Accordion type="single" collapsible className="rounded-2xl border bg-card shadow-card">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`q-${i}`} className="px-4">
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h3 className="mt-3 text-lg font-bold">Trust & Safety</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Tips for safer transactions, fraud prevention, and reporting suspicious users.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <MessageCircle className="h-5 w-5" />
            </span>
            <h3 className="mt-3 text-lg font-bold">Still need help?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Our support team is here to help. Drop us a message and we'll get back to you.
            </p>
            <Button asChild className="mt-3 gradient-primary text-primary-foreground">
              <Link to="/contact">Contact support</Link>
            </Button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
