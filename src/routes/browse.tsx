import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useState, useEffect } from "react";
import { getStoredCity } from "@/lib/city";
import { AppShell } from "@/components/layout/AppShell";
import { ListingCard } from "@/components/ListingCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { listListings, getCategories } from "@/lib/listings.functions";
import { Filter, X } from "lucide-react";

const search = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  city: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  condition: z.enum(["new", "like_new", "good", "fair", "used"]).optional(),
  sort: z.enum(["newest", "price_asc", "price_desc"]).optional(),
});

const catsQuery = queryOptions({ queryKey: ["categories"], queryFn: () => getCategories() });

export const Route = createFileRoute("/browse")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Browse products on TrustMaart" },
      { name: "description", content: "Discover second-hand products from trusted sellers across India." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catsQuery),
  component: BrowsePage,
});

function BrowsePage() {
  const s = useSearch({ from: "/browse" });
  const navigate = useNavigate();
  const { data: cats } = useSuspenseQuery(catsQuery);

  useEffect(() => {
    if (!s.city) {
      const stored = getStoredCity();
      if (stored) navigate({ to: "/browse", search: { ...s, city: stored }, replace: true });
    }
  }, []);

  const filters = { type: "product" as const, ...s };
  const { data, isLoading } = useQuery({
    queryKey: ["listings", filters],
    queryFn: () => listListings({ data: filters }),
  });

  const update = (patch: Partial<typeof s>) =>
    navigate({ to: "/browse", search: { ...s, ...patch } });

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold">Browse products</h1>
          <Select value={s.sort ?? "newest"} onValueChange={(v) => update({ sort: v as typeof s.sort })}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price_asc">Price: Low → High</SelectItem>
              <SelectItem value="price_desc">Price: High → Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <FilterPanel
            s={s}
            update={update}
            cats={cats.filter((c) => c.type === "product")}
          />
          <div>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
                ))}
              </div>
            ) : data && data.rows.length ? (
              <>
                <p className="mb-3 text-sm text-muted-foreground">{data.total} results</p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {data.rows.map((l) => (
                    <ListingCard key={l.id} l={l} />
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border bg-card p-10 text-center">
                <p className="text-sm text-muted-foreground">No listings match those filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

type SearchT = z.infer<typeof search>;
function FilterPanel({
  s,
  update,
  cats,
}: {
  s: SearchT;
  update: (patch: Partial<SearchT>) => void;
  cats: { id: string; slug: string; name_en: string }[];
}) {
  const [open, setOpen] = useState(false);
  const content = (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={() => update({ q: undefined, category: undefined, city: undefined, minPrice: undefined, maxPrice: undefined, condition: undefined })}>Clear</Button>
      </div>
      <div>
        <Label>Search</Label>
        <Input value={s.q ?? ""} onChange={(e) => update({ q: e.target.value || undefined })} placeholder="Keyword" />
      </div>
      <div>
        <Label>Category</Label>
        <Select value={s.category ?? "all"} onValueChange={(v) => update({ category: v === "all" ? undefined : v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {cats.map((c) => <SelectItem key={c.id} value={c.slug}>{c.name_en}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>City</Label>
        <Input value={s.city ?? ""} onChange={(e) => update({ city: e.target.value || undefined })} placeholder="e.g. Mumbai" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Min ₹</Label>
          <Input type="number" value={s.minPrice ?? ""} onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : undefined })} />
        </div>
        <div>
          <Label>Max ₹</Label>
          <Input type="number" value={s.maxPrice ?? ""} onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })} />
        </div>
      </div>
      <div>
        <Label>Condition</Label>
        <Select value={s.condition ?? "any"} onValueChange={(v) => update({ condition: v === "any" ? undefined : (v as SearchT["condition"]) })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="like_new">Like new</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="fair">Fair</SelectItem>
            <SelectItem value="used">Used</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
  return (
    <>
      <aside className="hidden rounded-2xl border bg-card p-4 shadow-card lg:block">{content}</aside>
      <div className="lg:hidden">
        <Button variant="outline" onClick={() => setOpen((o) => !o)} className="w-full">
          {open ? <X className="mr-2 h-4 w-4" /> : <Filter className="mr-2 h-4 w-4" />}
          {open ? "Close filters" : "Show filters"}
        </Button>
        {open && <div className="mt-3 rounded-2xl border bg-card p-4">{content}</div>}
      </div>
    </>
  );
}
