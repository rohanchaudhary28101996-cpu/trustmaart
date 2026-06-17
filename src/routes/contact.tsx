import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { submitContactMessage } from "@/lib/contact.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact TrustMaart" },
      { name: "description", content: "Get in touch with TrustMaart — our support team replies within a few hours." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(5, "Message is too short").max(2000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setBusy(true);
    try {
      await submitContactMessage({ data: parsed.data });
      setForm({ name: "", email: "", message: "" });
      toast.success("Thanks! We'll get back to you soon.");
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <section className="gradient-hero">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Contact us</h1>
          <p className="mt-3 text-muted-foreground">
            Have a question, partnership idea or feedback? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-10 md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <InfoCard icon={Mail} title="Email" text="support@trustmaart.in" />
          <InfoCard icon={Phone} title="Phone" text="+91 80000 00000" />
          <InfoCard icon={MapPin} title="Office" text="Bengaluru, Karnataka, India" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border bg-card p-6 shadow-card">
          <div className="grid gap-2">
            <Label htmlFor="name">Your name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={2000} />
          </div>
          <Button type="submit" disabled={busy} className="w-full gradient-primary text-primary-foreground">
            {busy ? "Sending…" : "Send message"}
          </Button>
        </form>
      </section>
    </AppShell>
  );
}

function InfoCard({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-3 text-sm font-semibold text-muted-foreground">{title}</h3>
      <p className="mt-1 text-base font-bold">{text}</p>
    </div>
  );
}
