import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

async function ensureAdmin(supabase: import("@supabase/supabase-js").SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["admin", "super_admin", "moderator"]);
  if (!data || data.length === 0) throw new Error("Forbidden: admin only");
}

async function ensureSuperAdmin(supabase: import("@supabase/supabase-js").SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "super_admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden: super admin only");
}

async function logAdminAction(
  adminId: string,
  adminEmail: string,
  action: string,
  targetType: string,
  targetId: string | null,
  details: Record<string, unknown> = {},
) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("admin_action_logs").insert({
    admin_id: adminId,
    admin_email: adminEmail,
    action,
    target_type: targetType,
    target_id: targetId,
    details: details as never,
  });

}

export const adminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [
      users,
      sellers,
      ads,
      pending,
      live,
      rejected,
      suspended,
      chats,
      reports,
      products,
    ] = await Promise.all([
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("listings").select("owner_id", { count: "exact", head: true }).eq("type", "product"),
      supabaseAdmin.from("listings").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("listings").select("id", { count: "exact", head: true }).eq("moderation_status", "pending"),
      supabaseAdmin.from("listings").select("id", { count: "exact", head: true }).eq("moderation_status", "live"),
      supabaseAdmin.from("listings").select("id", { count: "exact", head: true }).eq("moderation_status", "rejected"),
      supabaseAdmin.from("listings").select("id", { count: "exact", head: true }).eq("moderation_status", "suspended"),
      supabaseAdmin.from("conversations").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("reports").select("id", { count: "exact", head: true }).eq("status", "open"),
      supabaseAdmin.from("listings").select("id", { count: "exact", head: true }).eq("type", "product"),
    ]);
    return {
      users: users.count ?? 0,
      sellers: sellers.count ?? 0,
      ads: ads.count ?? 0,
      pending: pending.count ?? 0,
      live: live.count ?? 0,
      rejected: rejected.count ?? 0,
      suspended: suspended.count ?? 0,
      conversations: chats.count ?? 0,
      openReports: reports.count ?? 0,
      products: products.count ?? 0,
    };
  });

export const adminListUsers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ q: z.string().max(120).optional() }).default({}).parse(data ?? {}))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("profiles")
      .select("id,full_name,avatar_url,city,phone,is_verified,is_blocked,created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data.q) q = q.ilike("full_name", `%${data.q}%`);
    const { data: profiles } = await q;
    const ids = (profiles ?? []).map((p) => p.id);
    const { data: roles } = ids.length
      ? await supabaseAdmin.from("user_roles").select("user_id,role").in("user_id", ids)
      : { data: [] as Array<{ user_id: string; role: string }> };
    const roleMap = new Map<string, string[]>();
    (roles ?? []).forEach((r) => {
      const arr = roleMap.get(r.user_id) ?? [];
      arr.push(r.role);
      roleMap.set(r.user_id, arr);
    });
    return (profiles ?? []).map((p) => ({ ...p, roles: roleMap.get(p.id) ?? [] }));
  });

export const adminToggleUserFlag = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({
      user_id: z.string().uuid(),
      flag: z.enum(["is_verified", "is_blocked"]),
      value: z.boolean(),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch = data.flag === "is_verified" ? { is_verified: data.value } : { is_blocked: data.value };
    const { error } = await supabaseAdmin.from("profiles").update(patch).eq("id", data.user_id);
    if (error) throw new Error(error.message);

    const { data: user } = await supabaseAdmin.auth.admin.getUserById(data.user_id);
    await logAdminAction(
      context.userId,
      user?.user?.email ?? "admin",
      data.flag === "is_verified" ? (data.value ? "verify_user" : "unverify_user") : data.value ? "ban_user" : "unban_user",
      "user",
      data.user_id,
      { flag: data.flag, value: data.value },
    );
    return { ok: true };
  });

export const adminAssignRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({
      user_id: z.string().uuid(),
      role: z.enum(["admin", "moderator", "user"]),
      grant: z.boolean(),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await ensureSuperAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.grant) {
      await supabaseAdmin.from("user_roles").insert({ user_id: data.user_id, role: data.role });
    } else {
      await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id).eq("role", data.role);
    }
    await logAdminAction(context.userId, "", data.grant ? "grant_role" : "revoke_role", "user", data.user_id, { role: data.role });
    return { ok: true };
  });

export const adminListListings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({
      moderation_status: z.enum(["pending", "live", "rejected", "changes_required", "suspended", "expired"]).optional(),
      type: z.enum(["product", "service"]).optional(),
      q: z.string().max(120).optional(),
    }).default({}).parse(data ?? {}),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("listings")
      .select("id,title,type,status,moderation_status,price,is_featured,city,cover_image,created_at,owner_id,rejection_reason,category_id,condition,description")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data.moderation_status) q = q.eq("moderation_status", data.moderation_status);
    if (data.type) q = q.eq("type", data.type);
    if (data.q) q = q.ilike("title", `%${data.q}%`);
    const { data: listings } = await q;
    const ownerIds = Array.from(new Set((listings ?? []).map((l) => l.owner_id)));
    const { data: owners } = ownerIds.length
      ? await supabaseAdmin.from("profiles").select("id,full_name,phone").in("id", ownerIds)
      : { data: [] as Array<{ id: string; full_name: string | null; phone: string | null }> };
    const ownerMap = new Map((owners ?? []).map((o) => [o.id, o]));
    const emailMap = new Map<string, string>();
    for (const uid of ownerIds) {
      try {
        const { data: u } = await supabaseAdmin.auth.admin.getUserById(uid);
        if (u?.user?.email) emailMap.set(uid, u.user.email);
      } catch { /* noop */ }
    }
    return (listings ?? []).map((l) => ({
      ...l,
      seller_name: ownerMap.get(l.owner_id)?.full_name ?? null,
      seller_phone: ownerMap.get(l.owner_id)?.phone ?? null,
      seller_email: emailMap.get(l.owner_id) ?? null,
    }));
  });

export const adminModerateListing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({
      id: z.string().uuid(),
      action: z.enum(["approve", "reject", "request_changes", "suspend", "delete", "feature"]),
      reason: z.string().max(1000).optional(),
      featured: z.boolean().optional(),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: listing, error: lErr } = await supabaseAdmin
      .from("listings").select("id,owner_id,title").eq("id", data.id).single();
    if (lErr || !listing) throw new Error("Listing not found");

    const { data: adminProfile } = await supabaseAdmin.from("profiles").select("full_name").eq("id", context.userId).maybeSingle();
    const adminEmail = adminProfile?.full_name ?? "Admin";

    if (data.action === "delete") {
      const { error } = await supabaseAdmin.from("listings").delete().eq("id", data.id);
      if (error) throw new Error(error.message);
      await logAdminAction(context.userId, adminEmail, "delete_listing", "listing", data.id, { title: listing.title });
      return { ok: true };
    }
    if (data.action === "feature") {
      await supabaseAdmin.from("listings").update({ is_featured: !!data.featured }).eq("id", data.id);
      await logAdminAction(context.userId, adminEmail, data.featured ? "feature_listing" : "unfeature_listing", "listing", data.id, {});
      return { ok: true };
    }

    const map = {
      approve: { moderation_status: "live" as const, rejection_reason: null, status: "active" as const },
      reject: { moderation_status: "rejected" as const, rejection_reason: data.reason ?? "Not approved" },
      request_changes: { moderation_status: "changes_required" as const, rejection_reason: data.reason ?? "Changes required" },
      suspend: { moderation_status: "suspended" as const, rejection_reason: data.reason ?? "Suspended by admin" },
    };
    const patch = { ...map[data.action], reviewed_at: new Date().toISOString(), reviewed_by: context.userId };
    const { error } = await supabaseAdmin.from("listings").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);

    const messages: Record<string, string> = {
      approve: `Congratulations! Your ad "${listing.title}" has been approved and is now live on TrustMaart.`,
      reject: `Your ad "${listing.title}" was not approved. ${data.reason ?? "Please review and resubmit."}`,
      request_changes: `Your ad "${listing.title}" needs changes. ${data.reason ?? "Please review feedback and resubmit."}`,
      suspend: `Your ad "${listing.title}" has been suspended. ${data.reason ?? ""}`,
    };
    await supabaseAdmin.from("notifications").insert({
      user_id: listing.owner_id,
      type: `listing_${data.action}`,
      payload: { listing_id: listing.id, title: listing.title, message: messages[data.action], reason: data.reason ?? null },
    });

    await logAdminAction(context.userId, adminEmail, `${data.action}_listing`, "listing", data.id, {
      title: listing.title,
      reason: data.reason ?? null,
    });
    return { ok: true };
  });

export const adminUpdateListing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({
      id: z.string().uuid(),
      title: z.string().min(1).max(120).optional(),
      description: z.string().max(4000).optional(),
      price: z.number().min(0).max(99999999).nullable().optional(),
      category_id: z.string().uuid().nullable().optional(),
      status: z.enum(["active", "removed", "sold"]).optional(),
      is_featured: z.boolean().optional(),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: Record<string, unknown> = {};
    if (data.title !== undefined) patch.title = data.title;
    if (data.description !== undefined) patch.description = data.description;
    if (data.price !== undefined) patch.price = data.price;
    if (data.category_id !== undefined) patch.category_id = data.category_id;
    if (data.status) patch.status = data.status;
    if (typeof data.is_featured === "boolean") patch.is_featured = data.is_featured;
    if (Object.keys(patch).length === 0) return { ok: true };
    const { error } = await supabaseAdmin.from("listings").update(patch as never).eq("id", data.id);
    if (error) throw new Error(error.message);
    await logAdminAction(context.userId, "", "edit_listing", "listing", data.id, patch);
    return { ok: true };
  });

export const adminListReports = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("reports")
      .select("id,target_type,target_id,reason,status,created_at,reporter_id")
      .order("created_at", { ascending: false })
      .limit(200);
    return data ?? [];
  });

export const adminResolveReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["reviewed", "dismissed", "actioned"]),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("reports").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    await logAdminAction(context.userId, "", `resolve_report_${data.status}`, "report", data.id, {});
    return { ok: true };
  });

export const adminGetActionLogs = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({
      limit: z.number().min(1).max(200).default(100),
      offset: z.number().min(0).default(0),
    }).default({}).parse(data ?? {}),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: logs, error } = await supabaseAdmin
      .from("admin_action_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .range(data.offset, data.offset + data.limit - 1);
    if (error) {
      const isSchemaCacheMiss = error.code === "PGRST205" || error.message.toLowerCase().includes("schema cache");
      if (isSchemaCacheMiss) return [];
      throw new Error(error.message);
    }
    return logs ?? [];
  });

export const adminGetConversations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("conversations")
      .select(
        "id,last_message_at,last_message_preview,buyer_id,seller_id,listing:listings(id,title,cover_image,price),buyer:profiles!conversations_buyer_id_fkey(id,full_name,avatar_url),seller:profiles!conversations_seller_id_fkey(id,full_name,avatar_url)",
      )
      .order("last_message_at", { ascending: false })
      .limit(200);
    type ConvRow = {
      id: string;
      last_message_at: string | null;
      last_message_preview: string | null;
      buyer_id: string;
      seller_id: string;
      listing: { id: string; title: string; cover_image: string | null; price: number | null } | null;
      buyer: { id: string; full_name: string | null; avatar_url: string | null } | null;
      seller: { id: string; full_name: string | null; avatar_url: string | null } | null;
    };
    return (data ?? []) as unknown as ConvRow[];
  });

export const adminGetMessages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ conversation_id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: msgs } = await supabaseAdmin
      .from("messages")
      .select("id,body,image_url,sender_id,read_at,created_at")
      .eq("conversation_id", data.conversation_id)
      .order("created_at", { ascending: true })
      .limit(200);
    return msgs ?? [];
  });
