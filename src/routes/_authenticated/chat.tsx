import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { AppImage } from "@/components/AppImage";
import { UserAvatar } from "@/components/UserAvatar";
import { myConversations } from "@/lib/chat.functions";
import { timeAgo } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/chat")({
  component: ChatLayout,
});

type Convo = {
  id: string;
  last_message_at: string | null;
  last_message_preview: string | null;
  buyer_id: string;
  seller_id: string;
  me: string;
  listing?: { id: string; title: string; cover_image: string | null; price: number | null } | null;
  buyer?: { id: string; full_name: string | null; avatar_url: string | null } | null;
  seller?: { id: string; full_name: string | null; avatar_url: string | null } | null;
};

function ChatLayout() {
  const { data = [], isLoading } = useQuery({ queryKey: ["my-conversations"], queryFn: () => myConversations() });
  const matchRoute = useMatchRoute();
  const isDetail = !!matchRoute({ to: "/chat/$id" });

  return (
    <AppShell hideFooter>
      <div className="mx-auto flex h-full max-w-6xl">
        <aside className={`w-full overflow-y-auto border-r md:w-80 md:block ${isDetail ? "hidden md:block" : ""}`}>
          <div className="border-b px-4 py-3">
            <h1 className="flex items-center gap-2 text-lg font-semibold"><MessageCircle className="h-5 w-5 text-primary" /> Inbox</h1>
          </div>
          {isLoading ? (
            <p className="p-4 text-sm text-muted-foreground">Loading…</p>
          ) : data.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No conversations yet. Start chatting from any listing.</p>
          ) : (
            <ul>
              {(data as Convo[]).map((c) => {
                const other = c.me === c.buyer_id ? c.seller : c.buyer;
                return (
                  <li key={c.id}>
                    <Link
                      to="/chat/$id"
                      params={{ id: c.id }}
                      className="flex gap-3 border-b p-3 hover:bg-secondary/50"
                      activeProps={{ className: "bg-secondary/70" }}
                    >
                      <UserAvatar avatarPath={other?.avatar_url} name={other?.full_name} className="h-10 w-10 text-sm" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-sm font-medium">{other?.full_name ?? "User"}</span>
                          {c.last_message_at && <span className="shrink-0 text-[10px] text-muted-foreground">{timeAgo(c.last_message_at)}</span>}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">{c.listing?.title}</div>
                        <div className="truncate text-xs text-muted-foreground">{c.last_message_preview ?? "Start the conversation"}</div>
                      </div>
                      {c.listing?.cover_image && (
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                          <AppImage bucket="listing-images" path={c.listing.cover_image} alt={c.listing.title} className="h-full w-full" />
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
        <section className={`flex-1 ${isDetail ? "" : "hidden md:flex md:items-center md:justify-center"}`}>
          {isDetail ? (
            <Outlet />
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              <MessageCircle className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-2">Select a conversation to start chatting</p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
