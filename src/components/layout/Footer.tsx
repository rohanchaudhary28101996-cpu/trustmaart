import { Link } from "@tanstack/react-router";
import { Shield, Sparkles, Headphones } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-secondary/30 pb-20 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground font-bold">
              T
            </div>
            <span className="text-lg font-extrabold">
              Trust<span className="text-primary">Maart</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            India's modern marketplace for second-hand products and local services.
          </p>
          <div className="mt-4 flex gap-3 text-muted-foreground text-xs">
            <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> Trust</span>
            <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" /> AI-powered</span>
            <span className="flex items-center gap-1"><Headphones className="h-3.5 w-3.5" /> Support</span>
          </div>
        </div>
        <FooterCol title="Marketplace" links={[
          ["Browse products", "/browse"],
          ["Sell something", "/sell"],
          ["AI search", "/search"],
        ]} />

        <FooterCol title="Company" links={[
          ["About TrustMaart", "/about"],
          ["Help & Support", "/help"],
          ["Contact us", "/contact"],
        ]} />
        <FooterCol title="Account" links={[
          ["Sign in", "/auth"],
          ["Dashboard", "/dashboard"],
          ["Wishlist", "/wishlist"],
        ]} />
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TrustMaart. Made for India.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map(([label, to]) => (
          <li key={to}>
            <Link to={to} className="hover:text-foreground transition-colors">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
