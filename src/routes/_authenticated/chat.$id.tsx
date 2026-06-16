import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppImage } from "@/components/AppImage";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { getConversation, sendMessage } from "@/lib/chat.functions";
import { formatINR, timeAgo } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/chat/$id")({
  component: ChatThread,
});

type Msg = { id: string; body: string | null; image_url: string | null; sender_id: string; created_at: string; read_at: string | null };

function ChatThread() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["conversation", id],
    queryFn: () => getConversation({ data: { id } }),
  });
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.messages?.length]);

  useEffect(() => {
    const ch = supabase
      .channel(`messages:${id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${id}` },
        () => qc.invalidateQueries({ queryKey: ["conversation", id] }),
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [id, qc]);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (!text) return;
    setSending(true);
    setBody("");
    try {
      await sendMessage({ data: { conversation_id: id, body: text } });
      qc.invalidateQueries({ queryKey: ["conversation", id] });
      qc.invalidateQueries({ queryKey: ["my-conversations"] });
    } catch (e) { toast.error((e as Error).message); setBody(text); }
    finally { setSending(false); }
  }

  if (isLoading || !data) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const me = data.me;
  const conv = data.conversation as unknown as {
    buyer_id: string; seller_id: string;
    listing?: { id: string; title: string; cover_image: string | null; price: number | null } | null;
    buyer?: { id: string; full_name: string | null; avatar_url: string | null } | null;
    seller?: { id: string; full_name: string | null; avatar_url: string | null } | null;
  };
  const other = me === conv.buyer_id ? conv.seller : conv.buyer;
  const msgs = (data.messages as Msg[]) ?? [];

  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex items-center gap-2 border-b px-3 py-2">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => navigate({ to: "/chat" })}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/15 text-primary text-sm font-semibold">
            {(other?.full_name ?? "U").slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{other?.full_name ?? "User"}</div>
          {conv.listing && (
            <Link to="/listing/$id" params={{ id: conv.listing.id }} className="truncate text-xs text-muted-foreground hover:text-primary">
              {conv.listing.title}
            </Link>
          )}
        </div>
        {conv.listing && (
          <Link to="/listing/$id" params={{ id: conv.listing.id }} className="flex items-center gap-2 rounded-lg border bg-card px-2 py-1 text-xs">
            <div className="h-8 w-8 overflow-hidden rounded bg-muted">
              <AppImage bucket="listing-images" path={conv.listing.cover_image} alt={conv.listing.title} className="h-full w-full" />
            </div>
            <span className="hidden font-semibold sm:inline">{conv.listing.price !== null ? formatINR(conv.listing.price) : "Contact"}</span>
          </Link>
        )}
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto bg-secondary/30 px-3 py-4">
        {msgs.length === 0 && (
          <p className="text-center text-xs text-muted-foreground">Say hi! Be respectful and stay safe — never share OTPs or pay in advance.</p>
        )}
        {msgs.map((m) => {
          const mine = m.sender_id === me;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${mine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card text-foreground rounded-bl-sm"}`}>
                {m.body && <p className="whitespace-pre-wrap break-words">{m.body}</p>}
                <div className={`mt-0.5 text-[10px] ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{timeAgo(m.created_at)}</div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form onSubmit={onSend} className="flex items-center gap-2 border-t bg-background px-3 py-2">
        <Input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type a message"
          maxLength={2000}
          className="flex-1 rounded-full bg-secondary/60"
        />
        <Button type="submit" size="icon" disabled={sending || !body.trim()} className="rounded-full gradient-primary text-primary-foreground">
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}
