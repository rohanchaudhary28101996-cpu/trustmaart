import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const startOrGetConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ listing_id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: listing, error: lerr } = await supabase
      .from("listings")
      .select("id,owner_id")
      .eq("id", data.listing_id)
      .maybeSingle();
    if (lerr || !listing) throw new Error("Listing not found");
    if (listing.owner_id === userId) throw new Error("You cannot chat with yourself");
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("listing_id", data.listing_id)
      .eq("buyer_id", userId)
      .eq("seller_id", listing.owner_id)
      .maybeSingle();
    if (existing) return { id: existing.id };
    const { data: created, error } = await supabase
      .from("conversations")
      .insert({ listing_id: data.listing_id, buyer_id: userId, seller_id: listing.owner_id })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: created.id };
  });

export const myConversations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { userId } = context;
    const { data, error } = await supabaseAdmin
      .from("conversations")
      .select("id,last_message_at,last_message_preview,buyer_id,seller_id,listing_id")
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order("last_message_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    const convs = data ?? [];
    if (!convs.length) return [];

    const profileIds = [...new Set(convs.flatMap((c) => [c.buyer_id, c.seller_id]))];
    const listingIds = [...new Set(convs.map((c) => c.listing_id).filter(Boolean))];

    const [{ data: profiles }, { data: listings }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id,full_name,avatar_url").in("id", profileIds),
      supabaseAdmin.from("listings").select("id,title,cover_image,price").in("id", listingIds),
    ]);

    const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));
    const listingMap = Object.fromEntries((listings ?? []).map((l) => [l.id, l]));

    return convs.map((c) => ({
      ...c,
      me: userId,
      buyer: profileMap[c.buyer_id] ?? null,
      seller: profileMap[c.seller_id] ?? null,
      listing: c.listing_id ? listingMap[c.listing_id] ?? null : null,
    }));
  });

export const getConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { userId } = context;
    const { data: conv, error } = await supabaseAdmin
      .from("conversations")
      .select("id,buyer_id,seller_id,listing_id")
      .eq("id", data.id)
      .maybeSingle();
    if (error || !conv) throw new Error("Conversation not found");
    if (conv.buyer_id !== userId && conv.seller_id !== userId) throw new Error("Forbidden");

    const [{ data: buyer }, { data: seller }, { data: listing }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id,full_name,avatar_url,is_verified").eq("id", conv.buyer_id).maybeSingle(),
      supabaseAdmin.from("profiles").select("id,full_name,avatar_url,is_verified").eq("id", conv.seller_id).maybeSingle(),
      conv.listing_id ? supabaseAdmin.from("listings").select("id,title,price,is_negotiable,cover_image,type").eq("id", conv.listing_id).maybeSingle() : Promise.resolve({ data: null }),
    ]);
    const convWithRelations = { ...conv, buyer, seller, listing: listing ?? null };
    const { data: messages } = await supabaseAdmin
      .from("messages")
      .select("id,body,image_url,sender_id,read_at,created_at")
      .eq("conversation_id", data.id)
      .order("created_at", { ascending: true })
      .limit(200);
    // mark others' messages as read
    await supabaseAdmin
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("conversation_id", data.id)
      .neq("sender_id", userId)
      .is("read_at", null);
    return { conversation: convWithRelations, messages: messages ?? [], me: userId };
  });

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({
      conversation_id: z.string().uuid(),
      body: z.string().max(2000).optional(),
      image_url: z.string().max(500).optional(),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    if (!data.body?.trim() && !data.image_url) throw new Error("Empty message");
    const { error } = await context.supabase.from("messages").insert({
      conversation_id: data.conversation_id,
      sender_id: context.userId,
      body: data.body?.trim() || null,
      image_url: data.image_url || null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
