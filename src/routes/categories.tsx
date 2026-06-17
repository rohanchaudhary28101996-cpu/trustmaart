import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import * as Icons from "lucide-react";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { getCategories } from "@/lib/listings.functions";

const catsQuery = queryOptions({ queryKey: ["categories"], queryFn: () => getCategories() });

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "All Categories — TrustMaart" },
      { name: "description", content: "Browse all categories on TrustMaart — buy and sell anything across India." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catsQuery),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data: cats } = useSuspenseQuery(catsQuery);

  const products = cats.filter((c) => c.type === "product");
  const services = cats.filter((c) => c.type === "service");

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">All Categories</h1>
        <p className="mt-1 text-muted-foreground">Browse everything available on TrustMaart</p>

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold">Products</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {products.map((c) => (
              <CategoryTile key={c.id} slug={c.slug} name={c.name_en} icon={c.icon} />
            ))}
          </div>
        </section>

        {services.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-bold">Services</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {services.map((c) => (
                <CategoryTile key={c.id} slug={c.slug} name={c.name_en} icon={c.icon} />
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}

function toPascalCase(str: string) {
  return str.replace(/(^\w|-\w)/g, (c) => c.replace("-", "").toUpperCase());
}

function CategoryTile({ slug, name, icon }: { slug: string; name: string; icon: string | null }) {
  const key = icon ? toPascalCase(icon) : null;
  const Icon = (key && (Icons as unknown as Record<string, typeof Sparkles>)[key]) || Sparkles;
  return (
    <Link
      to="/browse"
      search={{ category: slug }}
      className="group flex flex-col items-center gap-2 rounded-2xl border bg-card p-3 text-center shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
    >
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-xs font-medium">{name}</span>
    </Link>
  );
}
