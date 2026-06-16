import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  MessageCircle, Search, Eye, Calendar,
  User,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { adminGetConversations, adminGetMessages } from "@/lib/admin.functions";
import { timeAgo } from "@/lib/format";

export const Route = createFileRoute("/admin/chat-monitoring")({
  ssr: false,
  component: ChatMonitoringPage,
});

function ChatMonitoringPage() {
  const [q, setQ] = useState("");
  const [selectedConv, setSelectedConv] = useState<null | Awaited<ReturnType<typeof adminGetConversations>>[number]>(null);

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["admin-conversations"],
    queryFn: () => adminGetConversations(),
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["admin-messages", selectedConv?.id],
    queryFn: () => selectedConv ? adminGetMessages({ data: { conversation_id: selectedConv.id } }) : Promise.resolve([]),
    enabled: !!selectedConv,
  });

  const filtered = conversations.filter((c) => {
    const listingTitle = (c.listing as unknown as { title?: string })?.title ?? "";
    const buyerName = (c.buyer as unknown as { full_name?: string })?.full_name ?? "";
    const sellerName = (c.seller as unknown as { full_name?: string })?.full_name ?? "";
    return !q || listingTitle.toLowerCase().includes(q.toLowerCase()) || buyerName.toLowerCase().includes(q.toLowerCase()) || sellerName.toLowerCase().includes(q.toLowerCase());
  });

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Chat Monitoring</h1>
        <p className="mt-1 text-sm text-muted-foreground">View all conversations between buyers and sellers.</p>

        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search conversations…" className="pl-9" />
          </div>
          <Badge variant="secondary" className="h-9 px-3">{filtered.length} conversations</Badge>
        </div>

        <div className="mt-4 grid gap-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : filtered.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">No conversations found.</Card>
          ) : (
            filtered.map((c) => {
              const listing = c.listing as unknown as { id: string; title: string; cover_image: string | null; price: number | null } | null;
              const buyer = c.buyer as unknown as { id: string; full_name: string | null; avatar_url: string | null } | null;
              const seller = c.seller as unknown as { id: string; full_name: string | null; avatar_url: string | null } | null;
              return (
                <Card key={c.id} className="flex flex-wrap items-center gap-3 p-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-primary" />
                      <span className="font-medium">{listing?.title ?? "Unknown listing"}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> Buyer: {buyer?.full_name ?? "—"}</span>
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> Seller: {seller?.full_name ?? "—"}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Last message: {c.last_message_at ? timeAgo(c.last_message_at) : "—"}</span>
                    </div>
                    {c.last_message_preview && (
                      <div className="mt-1 truncate text-xs text-muted-foreground">{c.last_message_preview}</div>
                    )}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setSelectedConv(c)}>
                    <Eye className="mr-1 h-3 w-3" /> View Chat
                  </Button>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <Dialog open={!!selectedConv} onOpenChange={() => setSelectedConv(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Conversation</DialogTitle></DialogHeader>
          {selectedConv && (
            <div className="space-y-3">
              <div className="rounded-lg bg-muted p-3 text-sm">
                <p><b>Listing:</b> {(selectedConv.listing as unknown as { title?: string })?.title ?? "—"}</p>
                <p><b>Buyer:</b> {(selectedConv.buyer as unknown as { full_name?: string })?.full_name ?? "—"}</p>
                <p><b>Seller:</b> {(selectedConv.seller as unknown as { full_name?: string })?.full_name ?? "—"}</p>
              </div>
              <div className="space-y-2">
                {messages.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">No messages</p>
                ) : (
                  messages.map((m: { id: string; body: string | null; sender_id: string; created_at: string }) => (
                    <div key={m.id} className={`flex ${m.sender_id === selectedConv.buyer_id ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${m.sender_id === selectedConv.buyer_id ? "bg-muted" : "bg-primary text-primary-foreground"}`}>
                        {m.body && <p>{m.body}</p>}
                        <div className={`mt-0.5 text-[10px] ${m.sender_id === selectedConv.buyer_id ? "text-muted-foreground" : "text-primary-foreground/70"}`}>{timeAgo(m.created_at)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
