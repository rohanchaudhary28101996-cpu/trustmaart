import { c as createServerRpc } from "./createServerRpc-DJw-wm9Z.mjs";
import { c as createServerFn } from "./server-d-TQUncW.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CeqtaOs5.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, b as booleanType, e as enumType, n as numberType } from "../_libs/zod.mjs";
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
async function ensureAdmin(supabase, userId) {
  const {
    data
  } = await supabase.from("user_roles").select("role").eq("user_id", userId).in("role", ["admin", "super_admin", "moderator"]);
  if (!data || data.length === 0) throw new Error("Forbidden: admin only");
}
async function ensureSuperAdmin(supabase, userId) {
  const {
    data
  } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "super_admin").maybeSingle();
  if (!data) throw new Error("Forbidden: super admin only");
}
async function logAdminAction(adminId, adminEmail, action, targetType, targetId, details = {}) {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  await supabaseAdmin.from("admin_action_logs").insert({
    admin_id: adminId,
    admin_email: adminEmail,
    action,
    target_type: targetType,
    target_id: targetId,
    details
  });
}
const adminOverview_createServerFn_handler = createServerRpc({
  id: "65dbdd42678d4cf3348f8143806993df600c6d6e2d11eded1594324413609a95",
  name: "adminOverview",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminOverview.__executeServer(opts));
const adminOverview = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminOverview_createServerFn_handler, async ({
  context
}) => {
  await ensureAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const [users, sellers, ads, pending, live, rejected, suspended, chats, reports, products] = await Promise.all([supabaseAdmin.from("profiles").select("id", {
    count: "exact",
    head: true
  }), supabaseAdmin.from("listings").select("owner_id", {
    count: "exact",
    head: true
  }).eq("type", "product"), supabaseAdmin.from("listings").select("id", {
    count: "exact",
    head: true
  }), supabaseAdmin.from("listings").select("id", {
    count: "exact",
    head: true
  }).eq("moderation_status", "pending"), supabaseAdmin.from("listings").select("id", {
    count: "exact",
    head: true
  }).eq("moderation_status", "live"), supabaseAdmin.from("listings").select("id", {
    count: "exact",
    head: true
  }).eq("moderation_status", "rejected"), supabaseAdmin.from("listings").select("id", {
    count: "exact",
    head: true
  }).eq("moderation_status", "suspended"), supabaseAdmin.from("conversations").select("id", {
    count: "exact",
    head: true
  }), supabaseAdmin.from("reports").select("id", {
    count: "exact",
    head: true
  }).eq("status", "open"), supabaseAdmin.from("listings").select("id", {
    count: "exact",
    head: true
  }).eq("type", "product")]);
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
    products: products.count ?? 0
  };
});
const adminListUsers_createServerFn_handler = createServerRpc({
  id: "35cf6cc28f61c798a570ec39672552de8ed250f60706565e25b34a66f0c5b240",
  name: "adminListUsers",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListUsers.__executeServer(opts));
const adminListUsers = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  q: stringType().max(120).optional()
}).default({}).parse(data ?? {})).handler(adminListUsers_createServerFn_handler, async ({
  data,
  context
}) => {
  await ensureAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  let q = supabaseAdmin.from("profiles").select("id,full_name,avatar_url,city,phone,is_verified,is_blocked,created_at").order("created_at", {
    ascending: false
  }).limit(200);
  if (data.q) q = q.ilike("full_name", `%${data.q}%`);
  const {
    data: profiles
  } = await q;
  const ids = (profiles ?? []).map((p) => p.id);
  const {
    data: roles
  } = ids.length ? await supabaseAdmin.from("user_roles").select("user_id,role").in("user_id", ids) : {
    data: []
  };
  const roleMap = /* @__PURE__ */ new Map();
  (roles ?? []).forEach((r) => {
    const arr = roleMap.get(r.user_id) ?? [];
    arr.push(r.role);
    roleMap.set(r.user_id, arr);
  });
  return (profiles ?? []).map((p) => ({
    ...p,
    roles: roleMap.get(p.id) ?? []
  }));
});
const adminToggleUserFlag_createServerFn_handler = createServerRpc({
  id: "6548020cae1978a1af1957c128181f0952d8107458a6a421b51cf5b3868e47e4",
  name: "adminToggleUserFlag",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminToggleUserFlag.__executeServer(opts));
const adminToggleUserFlag = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  user_id: stringType().uuid(),
  flag: enumType(["is_verified", "is_blocked"]),
  value: booleanType()
}).parse(data)).handler(adminToggleUserFlag_createServerFn_handler, async ({
  data,
  context
}) => {
  await ensureAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const patch = data.flag === "is_verified" ? {
    is_verified: data.value
  } : {
    is_blocked: data.value
  };
  const {
    error
  } = await supabaseAdmin.from("profiles").update(patch).eq("id", data.user_id);
  if (error) throw new Error(error.message);
  const {
    data: user
  } = await supabaseAdmin.auth.admin.getUserById(data.user_id);
  await logAdminAction(context.userId, user?.user?.email ?? "admin", data.flag === "is_verified" ? data.value ? "verify_user" : "unverify_user" : data.value ? "ban_user" : "unban_user", "user", data.user_id, {
    flag: data.flag,
    value: data.value
  });
  return {
    ok: true
  };
});
const adminAssignRole_createServerFn_handler = createServerRpc({
  id: "c39f0463c9489f3f30a5c28a63c3c970343ad9d21cfd932473b2525683655898",
  name: "adminAssignRole",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminAssignRole.__executeServer(opts));
const adminAssignRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  user_id: stringType().uuid(),
  role: enumType(["admin", "moderator", "user"]),
  grant: booleanType()
}).parse(data)).handler(adminAssignRole_createServerFn_handler, async ({
  data,
  context
}) => {
  await ensureSuperAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  if (data.grant) {
    await supabaseAdmin.from("user_roles").insert({
      user_id: data.user_id,
      role: data.role
    });
  } else {
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id).eq("role", data.role);
  }
  await logAdminAction(context.userId, "", data.grant ? "grant_role" : "revoke_role", "user", data.user_id, {
    role: data.role
  });
  return {
    ok: true
  };
});
const adminListListings_createServerFn_handler = createServerRpc({
  id: "b196496908122569ad0085069a64c275b09878c8a7ff8d73d8d8d648c8b7163d",
  name: "adminListListings",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListListings.__executeServer(opts));
const adminListListings = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  moderation_status: enumType(["pending", "live", "rejected", "changes_required", "suspended", "expired"]).optional(),
  type: enumType(["product", "service"]).optional(),
  q: stringType().max(120).optional()
}).default({}).parse(data ?? {})).handler(adminListListings_createServerFn_handler, async ({
  data,
  context
}) => {
  await ensureAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  let q = supabaseAdmin.from("listings").select("id,title,type,status,moderation_status,price,is_featured,city,cover_image,created_at,owner_id,rejection_reason,category_id,condition,description").order("created_at", {
    ascending: false
  }).limit(200);
  if (data.moderation_status) q = q.eq("moderation_status", data.moderation_status);
  if (data.type) q = q.eq("type", data.type);
  if (data.q) q = q.ilike("title", `%${data.q}%`);
  const {
    data: listings
  } = await q;
  const ownerIds = Array.from(new Set((listings ?? []).map((l) => l.owner_id)));
  const {
    data: owners
  } = ownerIds.length ? await supabaseAdmin.from("profiles").select("id,full_name,phone").in("id", ownerIds) : {
    data: []
  };
  const ownerMap = new Map((owners ?? []).map((o) => [o.id, o]));
  const emailMap = /* @__PURE__ */ new Map();
  for (const uid of ownerIds) {
    try {
      const {
        data: u
      } = await supabaseAdmin.auth.admin.getUserById(uid);
      if (u?.user?.email) emailMap.set(uid, u.user.email);
    } catch {
    }
  }
  return (listings ?? []).map((l) => ({
    ...l,
    seller_name: ownerMap.get(l.owner_id)?.full_name ?? null,
    seller_phone: ownerMap.get(l.owner_id)?.phone ?? null,
    seller_email: emailMap.get(l.owner_id) ?? null
  }));
});
const adminModerateListing_createServerFn_handler = createServerRpc({
  id: "a011cfa9ec035c18aa07fcf7bb34a1b841a71427cc072482532e0fa849222272",
  name: "adminModerateListing",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminModerateListing.__executeServer(opts));
const adminModerateListing = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  id: stringType().uuid(),
  action: enumType(["approve", "reject", "request_changes", "suspend", "delete", "feature"]),
  reason: stringType().max(1e3).optional(),
  featured: booleanType().optional()
}).parse(data)).handler(adminModerateListing_createServerFn_handler, async ({
  data,
  context
}) => {
  await ensureAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data: listing,
    error: lErr
  } = await supabaseAdmin.from("listings").select("id,owner_id,title").eq("id", data.id).single();
  if (lErr || !listing) throw new Error("Listing not found");
  const {
    data: adminProfile
  } = await supabaseAdmin.from("profiles").select("full_name").eq("id", context.userId).maybeSingle();
  const adminEmail = adminProfile?.full_name ?? "Admin";
  if (data.action === "delete") {
    const {
      error: error2
    } = await supabaseAdmin.from("listings").delete().eq("id", data.id);
    if (error2) throw new Error(error2.message);
    await logAdminAction(context.userId, adminEmail, "delete_listing", "listing", data.id, {
      title: listing.title
    });
    return {
      ok: true
    };
  }
  if (data.action === "feature") {
    await supabaseAdmin.from("listings").update({
      is_featured: !!data.featured
    }).eq("id", data.id);
    await logAdminAction(context.userId, adminEmail, data.featured ? "feature_listing" : "unfeature_listing", "listing", data.id, {});
    return {
      ok: true
    };
  }
  const map = {
    approve: {
      moderation_status: "live",
      rejection_reason: null,
      status: "active"
    },
    reject: {
      moderation_status: "rejected",
      rejection_reason: data.reason ?? "Not approved"
    },
    request_changes: {
      moderation_status: "changes_required",
      rejection_reason: data.reason ?? "Changes required"
    },
    suspend: {
      moderation_status: "suspended",
      rejection_reason: data.reason ?? "Suspended by admin"
    }
  };
  const patch = {
    ...map[data.action],
    reviewed_at: (/* @__PURE__ */ new Date()).toISOString(),
    reviewed_by: context.userId
  };
  const {
    error
  } = await supabaseAdmin.from("listings").update(patch).eq("id", data.id);
  if (error) throw new Error(error.message);
  const messages = {
    approve: `Congratulations! Your ad "${listing.title}" has been approved and is now live on TrustMaart.`,
    reject: `Your ad "${listing.title}" was not approved. ${data.reason ?? "Please review and resubmit."}`,
    request_changes: `Your ad "${listing.title}" needs changes. ${data.reason ?? "Please review feedback and resubmit."}`,
    suspend: `Your ad "${listing.title}" has been suspended. ${data.reason ?? ""}`
  };
  await supabaseAdmin.from("notifications").insert({
    user_id: listing.owner_id,
    type: `listing_${data.action}`,
    payload: {
      listing_id: listing.id,
      title: listing.title,
      message: messages[data.action],
      reason: data.reason ?? null
    }
  });
  await logAdminAction(context.userId, adminEmail, `${data.action}_listing`, "listing", data.id, {
    title: listing.title,
    reason: data.reason ?? null
  });
  return {
    ok: true
  };
});
const adminUpdateListing_createServerFn_handler = createServerRpc({
  id: "ebbdcd8384982fed07cdff162dda885fc585e0e802eb0571204a69813f595aa1",
  name: "adminUpdateListing",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminUpdateListing.__executeServer(opts));
const adminUpdateListing = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  id: stringType().uuid(),
  title: stringType().min(1).max(120).optional(),
  description: stringType().max(4e3).optional(),
  price: numberType().min(0).max(99999999).nullable().optional(),
  category_id: stringType().uuid().nullable().optional(),
  status: enumType(["active", "removed", "sold"]).optional(),
  is_featured: booleanType().optional()
}).parse(data)).handler(adminUpdateListing_createServerFn_handler, async ({
  data,
  context
}) => {
  await ensureAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const patch = {};
  if (data.title !== void 0) patch.title = data.title;
  if (data.description !== void 0) patch.description = data.description;
  if (data.price !== void 0) patch.price = data.price;
  if (data.category_id !== void 0) patch.category_id = data.category_id;
  if (data.status) patch.status = data.status;
  if (typeof data.is_featured === "boolean") patch.is_featured = data.is_featured;
  if (Object.keys(patch).length === 0) return {
    ok: true
  };
  const {
    error
  } = await supabaseAdmin.from("listings").update(patch).eq("id", data.id);
  if (error) throw new Error(error.message);
  await logAdminAction(context.userId, "", "edit_listing", "listing", data.id, patch);
  return {
    ok: true
  };
});
const adminListReports_createServerFn_handler = createServerRpc({
  id: "4331efd96cf8818a0aa9d7d502d9086b7c2de6e0db941a88fa49b3ef6326520f",
  name: "adminListReports",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListReports.__executeServer(opts));
const adminListReports = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListReports_createServerFn_handler, async ({
  context
}) => {
  await ensureAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data
  } = await supabaseAdmin.from("reports").select("id,target_type,target_id,reason,status,created_at,reporter_id").order("created_at", {
    ascending: false
  }).limit(200);
  return data ?? [];
});
const adminResolveReport_createServerFn_handler = createServerRpc({
  id: "b5a5f30d97379d1e54170e047e986dff82320bb167efffa9d4b6ce8283833f02",
  name: "adminResolveReport",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminResolveReport.__executeServer(opts));
const adminResolveReport = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  id: stringType().uuid(),
  status: enumType(["reviewed", "dismissed", "actioned"])
}).parse(data)).handler(adminResolveReport_createServerFn_handler, async ({
  data,
  context
}) => {
  await ensureAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    error
  } = await supabaseAdmin.from("reports").update({
    status: data.status
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  await logAdminAction(context.userId, "", `resolve_report_${data.status}`, "report", data.id, {});
  return {
    ok: true
  };
});
const adminGetActionLogs_createServerFn_handler = createServerRpc({
  id: "db75d74dab33093ea565d9568a2a2e96d4bdfd916e41ae8d725b48fa87bea198",
  name: "adminGetActionLogs",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminGetActionLogs.__executeServer(opts));
const adminGetActionLogs = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  limit: numberType().min(1).max(200).default(100),
  offset: numberType().min(0).default(0)
}).default({}).parse(data ?? {})).handler(adminGetActionLogs_createServerFn_handler, async ({
  data,
  context
}) => {
  await ensureAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data: logs,
    error
  } = await supabaseAdmin.from("admin_action_logs").select("*").order("created_at", {
    ascending: false
  }).range(data.offset, data.offset + data.limit - 1);
  if (error) {
    const isSchemaCacheMiss = error.code === "PGRST205" || error.message.toLowerCase().includes("schema cache");
    if (isSchemaCacheMiss) return [];
    throw new Error(error.message);
  }
  return logs ?? [];
});
const adminGetConversations_createServerFn_handler = createServerRpc({
  id: "0ad7a7f6a267705e687cdc555797871df6a32479bad1e95b86dcad5cc16f9671",
  name: "adminGetConversations",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminGetConversations.__executeServer(opts));
const adminGetConversations = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminGetConversations_createServerFn_handler, async ({
  context
}) => {
  await ensureAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data
  } = await supabaseAdmin.from("conversations").select("id,last_message_at,last_message_preview,buyer_id,seller_id,listing:listings(id,title,cover_image,price),buyer:profiles!conversations_buyer_id_fkey(id,full_name,avatar_url),seller:profiles!conversations_seller_id_fkey(id,full_name,avatar_url)").order("last_message_at", {
    ascending: false
  }).limit(200);
  return data ?? [];
});
const adminGetMessages_createServerFn_handler = createServerRpc({
  id: "ba3a06e540e88842e998f975bfbc4f3e405fb6199b9c2a8fb3ecdd6bb5234eb0",
  name: "adminGetMessages",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminGetMessages.__executeServer(opts));
const adminGetMessages = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  conversation_id: stringType().uuid()
}).parse(data)).handler(adminGetMessages_createServerFn_handler, async ({
  data,
  context
}) => {
  await ensureAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data: msgs
  } = await supabaseAdmin.from("messages").select("id,body,image_url,sender_id,read_at,created_at").eq("conversation_id", data.conversation_id).order("created_at", {
    ascending: true
  }).limit(200);
  return msgs ?? [];
});
export {
  adminAssignRole_createServerFn_handler,
  adminGetActionLogs_createServerFn_handler,
  adminGetConversations_createServerFn_handler,
  adminGetMessages_createServerFn_handler,
  adminListListings_createServerFn_handler,
  adminListReports_createServerFn_handler,
  adminListUsers_createServerFn_handler,
  adminModerateListing_createServerFn_handler,
  adminOverview_createServerFn_handler,
  adminResolveReport_createServerFn_handler,
  adminToggleUserFlag_createServerFn_handler,
  adminUpdateListing_createServerFn_handler
};
