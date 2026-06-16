import { c as createServerRpc } from "./createServerRpc-B5m1FNZk.mjs";
import { c as createServerFn } from "./server-D1062Wfa.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DjebvYAq.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, n as numberType, e as enumType, s as stringType, a as arrayType, b as booleanType } from "../_libs/zod.mjs";
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
const FiltersSchema = objectType({
  type: enumType(["product", "service"]).optional(),
  q: stringType().max(200).optional(),
  category: stringType().max(100).optional(),
  city: stringType().max(120).optional(),
  minPrice: numberType().min(0).max(99999999).optional(),
  maxPrice: numberType().min(0).max(99999999).optional(),
  condition: enumType(["new", "like_new", "good", "fair", "used"]).optional(),
  brand: stringType().max(80).optional(),
  sort: enumType(["newest", "price_asc", "price_desc"]).default("newest").optional(),
  limit: numberType().min(1).max(60).default(24).optional(),
  offset: numberType().min(0).max(1e4).default(0).optional()
}).default({});
const listListings_createServerFn_handler = createServerRpc({
  id: "393d89a201a164777207ef82e19865ca3f8316688118ad59b082ec3b97df7e37",
  name: "listListings",
  filename: "src/lib/listings.functions.ts"
}, (opts) => listListings.__executeServer(opts));
const listListings = createServerFn({
  method: "POST"
}).inputValidator((data) => FiltersSchema.parse(data ?? {})).handler(listListings_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  let q = supabaseAdmin.from("listings").select("id,title,price,is_negotiable,city,cover_image,created_at,type,is_featured,condition,brand,category_id", {
    count: "exact"
  }).eq("status", "active").eq("moderation_status", "live");
  if (data.type) q = q.eq("type", data.type);
  if (data.condition) q = q.eq("condition", data.condition);
  if (data.brand) q = q.ilike("brand", `%${data.brand}%`);
  if (data.city) q = q.ilike("city", `%${data.city}%`);
  if (data.minPrice !== void 0) q = q.gte("price", data.minPrice);
  if (data.maxPrice !== void 0) q = q.lte("price", data.maxPrice);
  if (data.q) q = q.ilike("search_text", `%${data.q.toLowerCase()}%`);
  if (data.category) {
    const {
      data: cat
    } = await supabaseAdmin.from("categories").select("id").eq("slug", data.category).maybeSingle();
    if (cat?.id) q = q.eq("category_id", cat.id);
  }
  if (data.sort === "price_asc") q = q.order("price", {
    ascending: true,
    nullsFirst: false
  });
  else if (data.sort === "price_desc") q = q.order("price", {
    ascending: false,
    nullsFirst: false
  });
  else q = q.order("created_at", {
    ascending: false
  });
  q = q.range(data.offset ?? 0, (data.offset ?? 0) + (data.limit ?? 24) - 1);
  const {
    data: rows,
    error,
    count
  } = await q;
  if (error) throw new Error(error.message);
  return {
    rows: rows ?? [],
    total: count ?? 0
  };
});
const getListing_createServerFn_handler = createServerRpc({
  id: "3534642b2e7440be71e815e5e597a1650d0dfc52d9ceb96bbaad3e6a46f731ec",
  name: "getListing",
  filename: "src/lib/listings.functions.ts"
}, (opts) => getListing.__executeServer(opts));
const getListing = createServerFn({
  method: "POST"
}).inputValidator((data) => objectType({
  id: stringType().uuid()
}).parse(data)).handler(getListing_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data: listing,
    error
  } = await supabaseAdmin.from("listings").select("*").eq("id", data.id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!listing) return null;
  const [{
    data: images
  }, {
    data: profile
  }, {
    data: serviceDetails
  }, {
    data: similar
  }] = await Promise.all([supabaseAdmin.from("listing_images").select("id,url,position").eq("listing_id", data.id).order("position"), supabaseAdmin.from("profiles").select("id,full_name,avatar_url,city,is_verified,created_at").eq("id", listing.owner_id).maybeSingle(), supabaseAdmin.from("service_details").select("*").eq("listing_id", data.id).maybeSingle(), supabaseAdmin.from("listings").select("id,title,price,is_negotiable,city,cover_image,created_at,type,is_featured,condition").eq("status", "active").eq("moderation_status", "live").eq("type", listing.type).eq("category_id", listing.category_id ?? "00000000-0000-0000-0000-000000000000").neq("id", listing.id).limit(8)]);
  await supabaseAdmin.from("listings").update({
    view_count: (listing.view_count ?? 0) + 1
  }).eq("id", listing.id);
  return {
    listing,
    images: images ?? [],
    seller: profile,
    serviceDetails,
    similar: similar ?? []
  };
});
const getCategories_createServerFn_handler = createServerRpc({
  id: "87771d619d7854c69bd188721738141e8ea717eebbdd58b7d4ae4a00d9bcef56",
  name: "getCategories",
  filename: "src/lib/listings.functions.ts"
}, (opts) => getCategories.__executeServer(opts));
const getCategories = createServerFn({
  method: "GET"
}).handler(getCategories_createServerFn_handler, async () => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data,
    error
  } = await supabaseAdmin.from("categories").select("id,slug,name_en,name_hi,icon,type,position").order("position");
  if (error) throw new Error(error.message);
  return data ?? [];
});
const getHomeData_createServerFn_handler = createServerRpc({
  id: "74f792f9b217353d0be406db090078b1cc389635f934a9183d962781bf453677",
  name: "getHomeData",
  filename: "src/lib/listings.functions.ts"
}, (opts) => getHomeData.__executeServer(opts));
const getHomeData = createServerFn({
  method: "GET"
}).handler(getHomeData_createServerFn_handler, async () => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const select = "id,title,price,is_negotiable,city,cover_image,created_at,type,is_featured,condition";
  const [{
    data: featured
  }, {
    data: recent
  }, {
    data: services
  }, {
    data: cats
  }] = await Promise.all([supabaseAdmin.from("listings").select(select).eq("status", "active").eq("moderation_status", "live").eq("is_featured", true).limit(8), supabaseAdmin.from("listings").select(select).eq("status", "active").eq("moderation_status", "live").eq("type", "product").order("created_at", {
    ascending: false
  }).limit(12), supabaseAdmin.from("listings").select(select).eq("status", "active").eq("moderation_status", "live").eq("type", "service").order("created_at", {
    ascending: false
  }).limit(8), supabaseAdmin.from("categories").select("id,slug,name_en,name_hi,icon,type").order("position").limit(20)]);
  return {
    featured: featured ?? [],
    recent: recent ?? [],
    services: services ?? [],
    categories: cats ?? []
  };
});
const CreateListingSchema = objectType({
  type: enumType(["product", "service"]),
  title: stringType().min(3).max(120),
  description: stringType().max(4e3).optional(),
  price: numberType().min(0).max(99999999).nullable().optional(),
  is_negotiable: booleanType().default(true),
  condition: enumType(["new", "like_new", "good", "fair", "used"]).nullable().optional(),
  brand: stringType().max(80).optional(),
  category_id: stringType().uuid().nullable().optional(),
  city: stringType().max(120).optional(),
  state: stringType().max(120).optional(),
  tags: arrayType(stringType().max(40)).max(20).optional(),
  images: arrayType(stringType().min(1).max(500)).max(10).default([]),
  service_experience: numberType().min(0).max(80).nullable().optional(),
  service_availability: stringType().max(200).optional(),
  service_areas: arrayType(stringType().max(80)).max(20).optional()
});
const createListing_createServerFn_handler = createServerRpc({
  id: "e6bd60a3d681f193640aea255c53be02cf065005566c7fb0afcf870257d8e520",
  name: "createListing",
  filename: "src/lib/listings.functions.ts"
}, (opts) => createListing.__executeServer(opts));
const createListing = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => CreateListingSchema.parse(data)).handler(createListing_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  if (data.images.length > 10) throw new Error("Maximum 10 images allowed");
  const {
    data: created,
    error
  } = await supabase.from("listings").insert({
    owner_id: userId,
    type: data.type,
    title: data.title.trim(),
    description: data.description?.trim() || null,
    price: data.price ?? null,
    is_negotiable: data.is_negotiable,
    condition: data.condition ?? null,
    brand: data.brand?.trim() || null,
    category_id: data.category_id ?? null,
    city: data.city?.trim() || null,
    state: data.state?.trim() || null,
    tags: data.tags ?? [],
    cover_image: data.images[0] ?? null,
    status: "active"
  }).select("id").single();
  if (error) throw new Error(error.message);
  if (data.images.length) {
    const rows = data.images.map((url, i) => ({
      listing_id: created.id,
      url,
      position: i
    }));
    const {
      error: imgErr
    } = await supabase.from("listing_images").insert(rows);
    if (imgErr) throw new Error(imgErr.message);
  }
  if (data.type === "service") {
    await supabase.from("service_details").insert({
      listing_id: created.id,
      experience_years: data.service_experience ?? null,
      availability: data.service_availability ?? null,
      areas_served: data.service_areas ?? []
    });
  }
  return {
    id: created.id
  };
});
const deleteListing_createServerFn_handler = createServerRpc({
  id: "355748bb4fe1e0a54a381e93ab4522e771d97f4bef08293a6bcb103a57b5d2f2",
  name: "deleteListing",
  filename: "src/lib/listings.functions.ts"
}, (opts) => deleteListing.__executeServer(opts));
const deleteListing = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  id: stringType().uuid()
}).parse(data)).handler(deleteListing_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("listings").delete().eq("id", data.id).eq("owner_id", context.userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const updateListingStatus_createServerFn_handler = createServerRpc({
  id: "ca9246f7ca9b35eb9816f7008419b40ddfa90dafa388844852066c7e98ed2d0b",
  name: "updateListingStatus",
  filename: "src/lib/listings.functions.ts"
}, (opts) => updateListingStatus.__executeServer(opts));
const updateListingStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  id: stringType().uuid(),
  status: enumType(["active", "sold", "removed", "draft"])
}).parse(data)).handler(updateListingStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("listings").update({
    status: data.status
  }).eq("id", data.id).eq("owner_id", context.userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const myListings_createServerFn_handler = createServerRpc({
  id: "70be780304ba6b12fb42601c2c1bccd033eea5e9b82e04ac3c2198e8acabe916",
  name: "myListings",
  filename: "src/lib/listings.functions.ts"
}, (opts) => myListings.__executeServer(opts));
const myListings = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(myListings_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("listings").select("id,title,price,status,view_count,cover_image,created_at,type").eq("owner_id", context.userId).order("created_at", {
    ascending: false
  }).limit(100);
  if (error) throw new Error(error.message);
  return data ?? [];
});
const toggleWishlist_createServerFn_handler = createServerRpc({
  id: "09384ce19f4064db87feba772538a61ed2c3e8a5de8ea87f5a77858fa3774673",
  name: "toggleWishlist",
  filename: "src/lib/listings.functions.ts"
}, (opts) => toggleWishlist.__executeServer(opts));
const toggleWishlist = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  listing_id: stringType().uuid()
}).parse(data)).handler(toggleWishlist_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: existing
  } = await context.supabase.from("wishlist").select("user_id").eq("user_id", context.userId).eq("listing_id", data.listing_id).maybeSingle();
  if (existing) {
    await context.supabase.from("wishlist").delete().eq("user_id", context.userId).eq("listing_id", data.listing_id);
    return {
      saved: false
    };
  }
  await context.supabase.from("wishlist").insert({
    user_id: context.userId,
    listing_id: data.listing_id
  });
  return {
    saved: true
  };
});
const myWishlist_createServerFn_handler = createServerRpc({
  id: "198c7e18751773f0185f326677f867c3fd23b8cacd40eb5163da49c551ad4387",
  name: "myWishlist",
  filename: "src/lib/listings.functions.ts"
}, (opts) => myWishlist.__executeServer(opts));
const myWishlist = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(myWishlist_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("wishlist").select("listing:listings(id,title,price,is_negotiable,city,cover_image,created_at,type,is_featured,condition)").eq("user_id", context.userId).order("created_at", {
    ascending: false
  }).limit(100);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => r.listing).filter(Boolean);
});
const reportContent_createServerFn_handler = createServerRpc({
  id: "b4d8a9c5a2dd7343c80d58e6f438947b6c1341cb00f57a2e1cbefdbde5395404",
  name: "reportContent",
  filename: "src/lib/listings.functions.ts"
}, (opts) => reportContent.__executeServer(opts));
const reportContent = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  target_type: enumType(["listing", "user", "message"]),
  target_id: stringType().uuid(),
  reason: stringType().min(3).max(500)
}).parse(data)).handler(reportContent_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("reports").insert({
    reporter_id: context.userId,
    target_type: data.target_type,
    target_id: data.target_id,
    reason: data.reason
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  createListing_createServerFn_handler,
  deleteListing_createServerFn_handler,
  getCategories_createServerFn_handler,
  getHomeData_createServerFn_handler,
  getListing_createServerFn_handler,
  listListings_createServerFn_handler,
  myListings_createServerFn_handler,
  myWishlist_createServerFn_handler,
  reportContent_createServerFn_handler,
  toggleWishlist_createServerFn_handler,
  updateListingStatus_createServerFn_handler
};
