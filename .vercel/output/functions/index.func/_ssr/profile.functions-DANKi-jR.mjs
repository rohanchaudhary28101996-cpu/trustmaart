import { c as createServerRpc } from "./createServerRpc-B5m1FNZk.mjs";
import { c as createServerFn } from "./server-D1062Wfa.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DjebvYAq.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, b as booleanType, e as enumType } from "../_libs/zod.mjs";
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
const getMyProfile_createServerFn_handler = createServerRpc({
  id: "5dbf46616266e7bfe81c82694a91090a42de6200b3efc1b9d156faf41ac3a479",
  name: "getMyProfile",
  filename: "src/lib/profile.functions.ts"
}, (opts) => getMyProfile.__executeServer(opts));
const getMyProfile = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyProfile_createServerFn_handler, async ({
  context
}) => {
  const {
    data
  } = await context.supabase.from("profiles").select("*").eq("id", context.userId).maybeSingle();
  return data;
});
const updateMyProfile_createServerFn_handler = createServerRpc({
  id: "af00eb763dce352dc2f42ef901ef426a138feb40fdc7f79166552837a77fae5f",
  name: "updateMyProfile",
  filename: "src/lib/profile.functions.ts"
}, (opts) => updateMyProfile.__executeServer(opts));
const updateMyProfile = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  full_name: stringType().min(1).max(80),
  phone: stringType().max(20).optional(),
  city: stringType().max(80).optional(),
  state: stringType().max(80).optional(),
  bio: stringType().max(400).optional(),
  avatar_url: stringType().max(400).optional()
}).parse(data)).handler(updateMyProfile_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("profiles").update({
    full_name: data.full_name,
    phone: data.phone || null,
    city: data.city || null,
    state: data.state || null,
    bio: data.bio || null,
    avatar_url: data.avatar_url || null
  }).eq("id", context.userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
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
const adminOverview_createServerFn_handler = createServerRpc({
  id: "a5759035b101d382aecd7edab30b6923d8efce2a66b01c5541ca221660bac89b",
  name: "adminOverview",
  filename: "src/lib/profile.functions.ts"
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
  const [users, sellers, providers, ads, pending, live, rejected, chats, reports] = await Promise.all([supabaseAdmin.from("profiles").select("id", {
    count: "exact",
    head: true
  }), supabaseAdmin.from("listings").select("owner_id", {
    count: "exact",
    head: true
  }).eq("type", "product"), supabaseAdmin.from("listings").select("owner_id", {
    count: "exact",
    head: true
  }).eq("type", "service"), supabaseAdmin.from("listings").select("id", {
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
  }).eq("moderation_status", "rejected"), supabaseAdmin.from("conversations").select("id", {
    count: "exact",
    head: true
  }), supabaseAdmin.from("reports").select("id", {
    count: "exact",
    head: true
  }).eq("status", "open")]);
  return {
    users: users.count ?? 0,
    sellers: sellers.count ?? 0,
    providers: providers.count ?? 0,
    ads: ads.count ?? 0,
    pending: pending.count ?? 0,
    live: live.count ?? 0,
    rejected: rejected.count ?? 0,
    conversations: chats.count ?? 0,
    openReports: reports.count ?? 0
  };
});
const adminListUsers_createServerFn_handler = createServerRpc({
  id: "e213d2c3fc44b9dd1ee0e758fb61c7ee6972f5add1ba86759f0ac0a1a5902720",
  name: "adminListUsers",
  filename: "src/lib/profile.functions.ts"
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
  id: "bf696d0d6a8b78b4d00fa326e19a24cadc7bb83d4264fee1bfec5ed68ab73f18",
  name: "adminToggleUserFlag",
  filename: "src/lib/profile.functions.ts"
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
  return {
    ok: true
  };
});
const adminAssignRole_createServerFn_handler = createServerRpc({
  id: "edc740512f3f0332a24d6ba64f1bb38d4568c827b2911998a68988dbb71293d6",
  name: "adminAssignRole",
  filename: "src/lib/profile.functions.ts"
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
  return {
    ok: true
  };
});
const adminListListings_createServerFn_handler = createServerRpc({
  id: "33d4a23d9f3972527b2f0240ad209dbb1d65fa2cf85b34838807e1be58181ae9",
  name: "adminListListings",
  filename: "src/lib/profile.functions.ts"
}, (opts) => adminListListings.__executeServer(opts));
const adminListListings = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  moderation_status: enumType(["pending", "live", "rejected", "changes_required", "suspended", "expired"]).optional(),
  q: stringType().max(120).optional()
}).default({}).parse(data ?? {})).handler(adminListListings_createServerFn_handler, async ({
  data,
  context
}) => {
  await ensureAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  let q = supabaseAdmin.from("listings").select("id,title,type,status,moderation_status,price,is_featured,city,cover_image,created_at,owner_id,rejection_reason,category_id").order("created_at", {
    ascending: false
  }).limit(200);
  if (data.moderation_status) q = q.eq("moderation_status", data.moderation_status);
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
  id: "76fba8e5c99e5ad0dd2dc32cf3d3d54f2bf016128971123fa3b7db9bd2dff074",
  name: "adminModerateListing",
  filename: "src/lib/profile.functions.ts"
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
  if (data.action === "delete") {
    const {
      error: error2
    } = await supabaseAdmin.from("listings").delete().eq("id", data.id);
    if (error2) throw new Error(error2.message);
    return {
      ok: true
    };
  }
  if (data.action === "feature") {
    await supabaseAdmin.from("listings").update({
      is_featured: !!data.featured
    }).eq("id", data.id);
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
  return {
    ok: true
  };
});
const adminUpdateListing_createServerFn_handler = createServerRpc({
  id: "773a683c90526cbe29c3930fb82fba742220873dcd213d2233ed538f5305bfc2",
  name: "adminUpdateListing",
  filename: "src/lib/profile.functions.ts"
}, (opts) => adminUpdateListing.__executeServer(opts));
const adminUpdateListing = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  id: stringType().uuid(),
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
  if (data.status) patch.status = data.status;
  if (typeof data.is_featured === "boolean") patch.is_featured = data.is_featured;
  const {
    error
  } = await supabaseAdmin.from("listings").update(patch).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminListReports_createServerFn_handler = createServerRpc({
  id: "04a60b6cf2d62afe8f61f35a62d2396981927c6b60d224241bc57424b95cd588",
  name: "adminListReports",
  filename: "src/lib/profile.functions.ts"
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
  id: "b7c6116bde526e15a1da3dc517259ef58fd7fff56ee71c47d0cd8cf603fdefdd",
  name: "adminResolveReport",
  filename: "src/lib/profile.functions.ts"
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
  return {
    ok: true
  };
});
export {
  adminAssignRole_createServerFn_handler,
  adminListListings_createServerFn_handler,
  adminListReports_createServerFn_handler,
  adminListUsers_createServerFn_handler,
  adminModerateListing_createServerFn_handler,
  adminOverview_createServerFn_handler,
  adminResolveReport_createServerFn_handler,
  adminToggleUserFlag_createServerFn_handler,
  adminUpdateListing_createServerFn_handler,
  getMyProfile_createServerFn_handler,
  updateMyProfile_createServerFn_handler
};
