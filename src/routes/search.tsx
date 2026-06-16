import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Search as SearchIcon, Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListingCard } from "@/components/ListingCard";
import { aiSearchListings } from "@/lib/ai.functions";

const search = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/search")({
  validateSearch: search,
  component: SearchPage,
  errorComponent: ({ error }) => (
    <AppShell><div className="p-6 text-sm text-destructive">{error.message}</div></AppShell>
  ),
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [input, setInput] = useState(q ?? "");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["ai-search", q],
    queryFn: () => aiSearchListings({ data: { q: q! } }),
    enabled: !!q && q.length >= 2,
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) navigate({ to: "/search", search: { q: input.trim() } });
          }}
        >
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Ask in plain English: "used iPhone under 25000 in Delhi"'
              className="h-12 rounded-full bg-secondary/60 pl-9"
            />
          </div>
          <Button type="submit" size="lg" className="rounded-full gradient-primary text-primary-foreground">
            <Sparkles className="mr-2 h-4 w-4" /> Ask AI
          </Button>
        </form>

        {q && (
          <div className="mt-6">
            {isLoading || isFetching ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> AI is searching…
              </div>
            ) : data ? (
              <>
                <div className="mb-4 rounded-xl border bg-card/60 p-4">
                  <p className="text-sm"><Sparkles className="mr-1 inline h-4 w-4 text-primary" />{data.filters.summary}</p>
                </div>
                {data.rows.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No results yet. Try different keywords.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                    {data.rows.map((l) => <ListingCard key={l.id} l={l} />)}
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}
      </div>
    </AppShell>
  );
}
