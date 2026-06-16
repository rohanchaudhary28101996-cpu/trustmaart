import { c as createServerRpc } from "./createServerRpc-DJw-wm9Z.mjs";
import { c as createServerFn } from "./server-d-TQUncW.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CeqtaOs5.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const startOrGetConversation_createServerFn_handler = createServerRpc({
  id: "ac766ebe0f2f7cb834e9ec2ba6c71d63a798a62b9a2decd13584c84af700339c",
  name: "startOrGetConversation",
  filename: "src/lib/chat.functions.ts"
}, (opts) => startOrGetConversation.__executeServer(opts));
const startOrGetConversation = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  listing_id: stringType().uuid()
}).parse(data)).handler(startOrGetConversation_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: listing,
    error: lerr
  } = await supabase.from("listings").select("id,owner_id").eq("id", data.listing_id).maybeSingle();
  if (lerr || !listing) throw new Error("Listing not found");
  if (listing.owner_id === userId) throw new Error("You cannot chat with yourself");
  const {
    data: existing
  } = await supabase.from("conversations").select("id").eq("listing_id", data.listing_id).eq("buyer_id", userId).eq("seller_id", listing.owner_id).maybeSingle();
  if (existing) return {
    id: existing.id
  };
  const {
    data: created,
    error
  } = await supabase.from("conversations").insert({
    listing_id: data.listing_id,
    buyer_id: userId,
    seller_id: listing.owner_id
  }).select("id").single();
  if (error) throw new Error(error.message);
  return {
    id: created.id
  };
});
const myConversations_createServerFn_handler = createServerRpc({
  id: "5ad9aecc6a3ae821d30eea8d464da3dd435188bc6016292a95ed6f7f0ba86ee7",
  name: "myConversations",
  filename: "src/lib/chat.functions.ts"
}, (opts) => myConversations.__executeServer(opts));
const myConversations = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(myConversations_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data,
    error
  } = await supabase.from("conversations").select("id,last_message_at,last_message_preview,buyer_id,seller_id,listing:listings(id,title,cover_image,price),buyer:profiles!conversations_buyer_id_fkey(id,full_name,avatar_url),seller:profiles!conversations_seller_id_fkey(id,full_name,avatar_url)").or(`buyer_id.eq.${userId},seller_id.eq.${userId}`).order("last_message_at", {
    ascending: false
  }).limit(100);
  if (error) throw new Error(error.message);
  return (data ?? []).map((c) => ({
    ...c,
    me: userId
  }));
});
const getConversation_createServerFn_handler = createServerRpc({
  id: "da1aad61dcc8d005620d36d755091c11966e643eef886b2f2a190860280db654",
  name: "getConversation",
  filename: "src/lib/chat.functions.ts"
}, (opts) => getConversation.__executeServer(opts));
const getConversation = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  id: stringType().uuid()
}).parse(data)).handler(getConversation_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: conv,
    error
  } = await supabase.from("conversations").select("id,buyer_id,seller_id,listing:listings(id,title,price,is_negotiable,cover_image,type),buyer:profiles!conversations_buyer_id_fkey(id,full_name,avatar_url,is_verified),seller:profiles!conversations_seller_id_fkey(id,full_name,avatar_url,is_verified)").eq("id", data.id).maybeSingle();
  if (error || !conv) throw new Error("Conversation not found");
  if (conv.buyer_id !== userId && conv.seller_id !== userId) throw new Error("Forbidden");
  const {
    data: messages
  } = await supabase.from("messages").select("id,body,image_url,sender_id,read_at,created_at").eq("conversation_id", data.id).order("created_at", {
    ascending: true
  }).limit(200);
  await supabase.from("messages").update({
    read_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("conversation_id", data.id).neq("sender_id", userId).is("read_at", null);
  return {
    conversation: conv,
    messages: messages ?? [],
    me: userId
  };
});
const sendMessage_createServerFn_handler = createServerRpc({
  id: "4f34919086f2a4130097c5da5423c36b625cea14ed1b142c70bfe1b53f9fd398",
  name: "sendMessage",
  filename: "src/lib/chat.functions.ts"
}, (opts) => sendMessage.__executeServer(opts));
const sendMessage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  conversation_id: stringType().uuid(),
  body: stringType().max(2e3).optional(),
  image_url: stringType().max(500).optional()
}).parse(data)).handler(sendMessage_createServerFn_handler, async ({
  data,
  context
}) => {
  if (!data.body?.trim() && !data.image_url) throw new Error("Empty message");
  const {
    error
  } = await context.supabase.from("messages").insert({
    conversation_id: data.conversation_id,
    sender_id: context.userId,
    body: data.body?.trim() || null,
    image_url: data.image_url || null
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  getConversation_createServerFn_handler,
  myConversations_createServerFn_handler,
  sendMessage_createServerFn_handler,
  startOrGetConversation_createServerFn_handler
};
