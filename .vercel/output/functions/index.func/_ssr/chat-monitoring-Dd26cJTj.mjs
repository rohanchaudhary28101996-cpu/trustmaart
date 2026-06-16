import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AdminShell } from "./AdminShell-BehEEcw_.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { B as Badge } from "./badge-YM7oB01y.mjs";
import { C as Card } from "./card-BtiUI6Md.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-D9SBQmWA.mjs";
import { j as adminGetConversations, k as adminGetMessages } from "./admin.functions-ByUlPAk_.mjs";
import { t as timeAgo } from "./format-CVlb_WBO.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { S as Search, M as MessageCircle, t as User, h as Calendar, E as Eye } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./router-a4rHr5mp.mjs";
import "./client-DHBFCFA_.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./server-d-TQUncW.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-CeqtaOs5.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
function ChatMonitoringPage() {
  const [q, setQ] = reactExports.useState("");
  const [selectedConv, setSelectedConv] = reactExports.useState(null);
  const {
    data: conversations = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-conversations"],
    queryFn: () => adminGetConversations()
  });
  const {
    data: messages = []
  } = useQuery({
    queryKey: ["admin-messages", selectedConv?.id],
    queryFn: () => selectedConv ? adminGetMessages({
      data: {
        conversation_id: selectedConv.id
      }
    }) : Promise.resolve([]),
    enabled: !!selectedConv
  });
  const filtered = conversations.filter((c) => {
    const listingTitle = c.listing?.title ?? "";
    const buyerName = c.buyer?.full_name ?? "";
    const sellerName = c.seller?.full_name ?? "";
    return !q || listingTitle.toLowerCase().includes(q.toLowerCase()) || buyerName.toLowerCase().includes(q.toLowerCase()) || sellerName.toLowerCase().includes(q.toLowerCase());
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Chat Monitoring" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "View all conversations between buyers and sellers." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search conversations…", className: "pl-9" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "h-9 px-3", children: [
          filtered.length,
          " conversations"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-2", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 text-center text-sm text-muted-foreground", children: "No conversations found." }) : filtered.map((c) => {
        const listing = c.listing;
        const buyer = c.buyer;
        const seller = c.seller;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex flex-wrap items-center gap-3 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: listing?.title ?? "Unknown listing" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3 w-3" }),
                " Buyer: ",
                buyer?.full_name ?? "—"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3 w-3" }),
                " Seller: ",
                seller?.full_name ?? "—"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
                " Last message: ",
                c.last_message_at ? timeAgo(c.last_message_at) : "—"
              ] })
            ] }),
            c.last_message_preview && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 truncate text-xs text-muted-foreground", children: c.last_message_preview })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => setSelectedConv(c), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "mr-1 h-3 w-3" }),
            " View Chat"
          ] })
        ] }, c.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!selectedConv, onOpenChange: () => setSelectedConv(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[80vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Conversation" }) }),
      selectedConv && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted p-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Listing:" }),
            " ",
            selectedConv.listing?.title ?? "—"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Buyer:" }),
            " ",
            selectedConv.buyer?.full_name ?? "—"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Seller:" }),
            " ",
            selectedConv.seller?.full_name ?? "—"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-sm text-muted-foreground", children: "No messages" }) : messages.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${m.sender_id === selectedConv.buyer_id ? "justify-start" : "justify-end"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[80%] rounded-xl px-3 py-2 text-sm ${m.sender_id === selectedConv.buyer_id ? "bg-muted" : "bg-primary text-primary-foreground"}`, children: [
          m.body && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: m.body }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-0.5 text-[10px] ${m.sender_id === selectedConv.buyer_id ? "text-muted-foreground" : "text-primary-foreground/70"}`, children: timeAgo(m.created_at) })
        ] }) }, m.id)) })
      ] })
    ] }) })
  ] });
}
export {
  ChatMonitoringPage as component
};
