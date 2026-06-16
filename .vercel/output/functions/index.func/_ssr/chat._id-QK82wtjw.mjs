import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { A as AppImage } from "./AppImage-DPeZY0bG.mjs";
import { A as Avatar, b as AvatarFallback } from "./avatar-FlEjym4Y.mjs";
import { s as supabase } from "./client-BHmQHd0X.mjs";
import { s as sendMessage, g as getConversation } from "./chat.functions-CcCNCDLt.mjs";
import { f as formatINR, t as timeAgo } from "./format-CVlb_WBO.mjs";
import { p as Route } from "./router-CyR1fJhL.mjs";
import "../_libs/seroval.mjs";
import { L as LoaderCircle, g as ArrowLeft, af as Send } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./storage-BFg0-6YF.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./server-D1062Wfa.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-DjebvYAq.mjs";
import "../_libs/zod.mjs";
function ChatThread() {
  const {
    id
  } = Route.useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["conversation", id],
    queryFn: () => getConversation({
      data: {
        id
      }
    })
  });
  const [body, setBody] = reactExports.useState("");
  const [sending, setSending] = reactExports.useState(false);
  const endRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [data?.messages?.length]);
  reactExports.useEffect(() => {
    const ch = supabase.channel(`messages:${id}`).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "messages",
      filter: `conversation_id=eq.${id}`
    }, () => qc.invalidateQueries({
      queryKey: ["conversation", id]
    })).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [id, qc]);
  async function onSend(e) {
    e.preventDefault();
    const text = body.trim();
    if (!text) return;
    setSending(true);
    setBody("");
    try {
      await sendMessage({
        data: {
          conversation_id: id,
          body: text
        }
      });
      qc.invalidateQueries({
        queryKey: ["conversation", id]
      });
      qc.invalidateQueries({
        queryKey: ["my-conversations"]
      });
    } catch (e2) {
      toast.error(e2.message);
      setBody(text);
    } finally {
      setSending(false);
    }
  }
  if (isLoading || !data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) });
  }
  const me = data.me;
  const conv = data.conversation;
  const other = me === conv.buyer_id ? conv.seller : conv.buyer;
  const msgs = data.messages ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full w-full flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center gap-2 border-b px-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "md:hidden", onClick: () => navigate({
        to: "/chat"
      }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-9 w-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/15 text-primary text-sm font-semibold", children: (other?.full_name ?? "U").slice(0, 1).toUpperCase() }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-semibold", children: other?.full_name ?? "User" }),
        conv.listing && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/listing/$id", params: {
          id: conv.listing.id
        }, className: "truncate text-xs text-muted-foreground hover:text-primary", children: conv.listing.title })
      ] }),
      conv.listing && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/listing/$id", params: {
        id: conv.listing.id
      }, className: "flex items-center gap-2 rounded-lg border bg-card px-2 py-1 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 overflow-hidden rounded bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppImage, { bucket: "listing-images", path: conv.listing.cover_image, alt: conv.listing.title, className: "h-full w-full" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden font-semibold sm:inline", children: conv.listing.price !== null ? formatINR(conv.listing.price) : "Contact" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2 overflow-y-auto bg-secondary/30 px-3 py-4", children: [
      msgs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground", children: "Say hi! Be respectful and stay safe — never share OTPs or pay in advance." }),
      msgs.map((m) => {
        const mine = m.sender_id === me;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${mine ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${mine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card text-foreground rounded-bl-sm"}`, children: [
          m.body && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap break-words", children: m.body }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-0.5 text-[10px] ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`, children: timeAgo(m.created_at) })
        ] }) }, m.id);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: endRef })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: onSend, className: "flex items-center gap-2 border-t bg-background px-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: body, onChange: (e) => setBody(e.target.value), placeholder: "Type a message", maxLength: 2e3, className: "flex-1 rounded-full bg-secondary/60" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "icon", disabled: sending || !body.trim(), className: "rounded-full gradient-primary text-primary-foreground", children: sending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) })
    ] })
  ] });
}
export {
  ChatThread as component
};
