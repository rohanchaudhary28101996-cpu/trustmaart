import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("id", context.userId)
      .maybeSingle();
    return data;
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({
      full_name: z.string().min(1).max(80),
      phone: z.string().max(20).optional(),
      city: z.string().max(80).optional(),
      state: z.string().max(80).optional(),
      bio: z.string().max(400).optional(),
      avatar_url: z.string().max(400).optional(),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        phone: data.phone || null,
        city: data.city || null,
        state: data.state || null,
        bio: data.bio || null,
        avatar_url: data.avatar_url || null,
      })
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ====== Admin ======
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

export const adminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [users, sellers, providers, ads, pending, live, rejected, chats, reports] = await Promise.all([
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("listings").select("owner_id", { count: "exact", head: true }).eq("type", "product"),
      supabaseAdmin.from("listings").select("owner_id", { count: "exact", head: true }).eq("type", "service"),
      supabaseAdmin.from("listings").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("listings").select("id", { count: "exact", head: true }).eq("moderation_status", "pending"),
      supabaseAdmin.from("listings").select("id", { count: "exact", head: true }).eq("moderation_status", "live"),
      supabaseAdmin.from("listings").select("id", { count: "exact", head: true }).eq("moderation_status", "rejected"),
      supabaseAdmin.from("conversations").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("reports").select("id", { count: "exact", head: true }).eq("status", "open"),
    ]);
    return {
      users: users.count ?? 0,
      sellers: sellers.count ?? 0,
      providers: providers.count ?? 0,
      ads: ads.count ?? 0,
      pending: pending.count ?? 0,
      live: live.count ?? 0,
      rejected: rejected.count ?? 0,
      conversations: chats.count ?? 0,
      openReports: reports.count ?? 0,
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
    return { ok: true };
  });

export const adminListListings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({
      moderation_status: z.enum(["pending", "live", "rejected", "changes_required", "suspended", "expired"]).optional(),
      q: z.string().max(120).optional(),
    }).default({}).parse(data ?? {}),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("listings")
      .select("id,title,type,status,moderation_status,price,is_featured,city,cover_image,created_at,owner_id,rejection_reason,category_id")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data.moderation_status) q = q.eq("moderation_status", data.moderation_status);
    if (data.q) q = q.ilike("title", `%${data.q}%`);
    const { data: listings } = await q;
    const ownerIds = Array.from(new Set((listings ?? []).map((l) => l.owner_id)));
    const { data: owners } = ownerIds.length
      ? await supabaseAdmin.from("profiles").select("id,full_name,phone").in("id", ownerIds)
      : { data: [] as Array<{ id: string; full_name: string | null; phone: string | null }> };
    const ownerMap = new Map((owners ?? []).map((o) => [o.id, o]));
    // get emails via auth admin
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

    if (data.action === "delete") {
      const { error } = await supabaseAdmin.from("listings").delete().eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true };
    }
    if (data.action === "feature") {
      await supabaseAdmin.from("listings").update({ is_featured: !!data.featured }).eq("id", data.id);
      return { ok: true };
    }

    const map = {
      approve: { moderation_status: "live", rejection_reason: null, status: "active" },
      reject: { moderation_status: "rejected", rejection_reason: data.reason ?? "Not approved" },
      request_changes: { moderation_status: "changes_required", rejection_reason: data.reason ?? "Changes required" },
      suspend: { moderation_status: "suspended", rejection_reason: data.reason ?? "Suspended by admin" },
    } as const;
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
    return { ok: true };
  });

export const adminUpdateListing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["active", "removed", "sold"]).optional(),
      is_featured: z.boolean().optional(),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: { status?: "active" | "removed" | "sold"; is_featured?: boolean } = {};
    if (data.status) patch.status = data.status;
    if (typeof data.is_featured === "boolean") patch.is_featured = data.is_featured;
    const { error } = await supabaseAdmin.from("listings").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
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
    return { ok: true };
  });
