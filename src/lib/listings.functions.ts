import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const FiltersSchema = z.object({
  type: z.enum(["product", "service"]).optional(),
  q: z.string().max(200).optional(),
  category: z.string().max(100).optional(),
  city: z.string().max(120).optional(),
  minPrice: z.number().min(0).max(99999999).optional(),
  maxPrice: z.number().min(0).max(99999999).optional(),
  condition: z.enum(["new", "like_new", "good", "fair", "used"]).optional(),
  brand: z.string().max(80).optional(),
  sort: z.enum(["newest", "price_asc", "price_desc"]).default("newest").optional(),
  limit: z.number().min(1).max(60).default(24).optional(),
  offset: z.number().min(0).max(10000).default(0).optional(),
}).default({});

export const listListings = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => FiltersSchema.parse(data ?? {}))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("listings")
      .select(
        "id,title,price,is_negotiable,city,cover_image,created_at,type,is_featured,condition,brand,category_id,status",
        { count: "exact" },
      )
      .in("status", ["active", "sold"])
      .eq("moderation_status", "live");
    if (data.type) q = q.eq("type", data.type);
    if (data.condition) q = q.eq("condition", data.condition);
    if (data.brand) q = q.ilike("brand", `%${data.brand}%`);
    if (data.city) q = q.ilike("city", `%${data.city}%`);
    if (data.minPrice !== undefined) q = q.gte("price", data.minPrice);
    if (data.maxPrice !== undefined) q = q.lte("price", data.maxPrice);
    if (data.q) q = q.ilike("search_text", `%${data.q.toLowerCase()}%`);
    if (data.category) {
      const { data: cat } = await supabaseAdmin
        .from("categories")
        .select("id")
        .eq("slug", data.category)
        .maybeSingle();
      if (cat?.id) q = q.eq("category_id", cat.id);
    }
    if (data.sort === "price_asc") q = q.order("price", { ascending: true, nullsFirst: false });
    else if (data.sort === "price_desc") q = q.order("price", { ascending: false, nullsFirst: false });
    else q = q.order("created_at", { ascending: false });
    q = q.range(data.offset ?? 0, (data.offset ?? 0) + (data.limit ?? 24) - 1);
    const { data: rows, error, count } = await q;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [], total: count ?? 0 };
  });

export const getListing = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: listing, error } = await supabaseAdmin
      .from("listings")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!listing) return null;
    const [{ data: images }, { data: profile }, { data: serviceDetails }, { data: similar }] = await Promise.all([
      supabaseAdmin.from("listing_images").select("id,url,position").eq("listing_id", data.id).order("position"),
      supabaseAdmin
        .from("profiles")
        .select("id,full_name,avatar_url,city,is_verified,created_at,phone")
        .eq("id", listing.owner_id)
        .maybeSingle(),
      supabaseAdmin.from("service_details").select("*").eq("listing_id", data.id).maybeSingle(),
      listing.category_id
        ? supabaseAdmin
            .from("listings")
            .select("id,title,price,is_negotiable,city,cover_image,created_at,type,is_featured,condition")
            .eq("status", "active")
            .eq("moderation_status", "live")
            .eq("type", listing.type)
            .eq("category_id", listing.category_id)
            .neq("id", listing.id)
            .limit(8)
        : Promise.resolve({ data: [] }),
    ]);
    // bump view
    await supabaseAdmin.from("listings").update({ view_count: (listing.view_count ?? 0) + 1 }).eq("id", listing.id);
    return {
      listing,
      images: images ?? [],
      seller: profile,
      serviceDetails,
      similar: similar ?? [],
    };
  });

export const getCategories = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("id,slug,name_en,name_hi,icon,type,position")
    .order("position");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getHomeData = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => {
    const d = (data ?? {}) as Record<string, unknown>;
    return { city: typeof d.city === "string" ? d.city : "" };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const select = "id,title,price,is_negotiable,city,cover_image,created_at,type,is_featured,condition,status";
    const base = () => supabaseAdmin.from("listings").select(select).eq("status", "active").eq("moderation_status", "live");
    const [{ data: featured }, { data: recent }, { data: nearby }, { data: services }, { data: cats }] = await Promise.all([
      base().eq("is_featured", true).limit(8),
      base().eq("type", "product").order("created_at", { ascending: false }).limit(12),
      data.city
        ? base().eq("type", "product").ilike("city", `%${data.city}%`).order("created_at", { ascending: false }).limit(8)
        : Promise.resolve({ data: [] }),
      base().eq("type", "service").order("created_at", { ascending: false }).limit(8),
      supabaseAdmin.from("categories").select("id,slug,name_en,name_hi,icon,type").order("position").limit(20),
    ]);
    return {
      featured: featured ?? [],
      recent: recent ?? [],
      nearby: nearby ?? [],
      services: services ?? [],
      categories: cats ?? [],
      city: data.city,
    };
  });

const CreateListingSchema = z.object({
  type: z.enum(["product", "service"]),
  title: z.string().min(3).max(120),
  description: z.string().max(4000).optional(),
  price: z.number().min(0).max(99999999).nullable().optional(),
  is_negotiable: z.boolean().default(true),
  condition: z.enum(["new", "like_new", "good", "fair", "used"]).nullable().optional(),
  brand: z.string().max(80).optional(),
  category_id: z.string().uuid().nullable().optional(),
  city: z.string().max(120).optional(),
  state: z.string().max(120).optional(),
  tags: z.array(z.string().max(40)).max(20).optional(),
  images: z.array(z.string().min(1).max(500)).max(10).default([]),
  service_experience: z.number().min(0).max(80).nullable().optional(),
  service_availability: z.string().max(200).optional(),
  service_areas: z.array(z.string().max(80)).max(20).optional(),
});

export const createListing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => CreateListingSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    if (data.images.length > 10) throw new Error("Maximum 10 images allowed");
    const { data: created, error } = await supabase
      .from("listings")
      .insert({
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
        status: "active",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    if (data.images.length) {
      const rows = data.images.map((url, i) => ({ listing_id: created.id, url, position: i }));
      const { error: imgErr } = await supabase.from("listing_images").insert(rows);
      if (imgErr) throw new Error(imgErr.message);
    }
    if (data.type === "service") {
      await supabase.from("service_details").insert({
        listing_id: created.id,
        experience_years: data.service_experience ?? null,
        availability: data.service_availability ?? null,
        areas_served: data.service_areas ?? [],
      });
    }
    return { id: created.id };
  });

export const updateListing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({
      id: z.string().uuid(),
      title: z.string().min(3).max(120),
      description: z.string().max(4000).optional(),
      price: z.number().min(0).max(99999999).nullable().optional(),
      condition: z.enum(["new", "like_new", "good", "fair", "used"]).nullable().optional(),
      city: z.string().max(120).optional(),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const patch: Record<string, unknown> = {
      title: data.title.trim(),
      description: data.description?.trim() || null,
      price: data.price ?? null,
      condition: data.condition ?? null,
      city: data.city?.trim() || null,
    };
    const { error } = await context.supabase
      .from("listings")
      .update(patch as never)
      .eq("id", data.id)
      .eq("owner_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteListing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("listings").delete().eq("id", data.id).eq("owner_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateListingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["active", "sold", "removed", "draft"]),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("listings")
      .update({ status: data.status })
      .eq("id", data.id)
      .eq("owner_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const myListings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("listings")
      .select("id,title,price,status,view_count,cover_image,created_at,type")
      .eq("owner_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const toggleWishlist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ listing_id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: existing } = await context.supabase
      .from("wishlist")
      .select("user_id")
      .eq("user_id", context.userId)
      .eq("listing_id", data.listing_id)
      .maybeSingle();
    if (existing) {
      await context.supabase.from("wishlist").delete().eq("user_id", context.userId).eq("listing_id", data.listing_id);
      return { saved: false };
    }
    await context.supabase.from("wishlist").insert({ user_id: context.userId, listing_id: data.listing_id });
    return { saved: true };
  });

export const myWishlist = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("wishlist")
      .select("listing:listings(id,title,price,is_negotiable,city,cover_image,created_at,type,is_featured,condition)")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return ((data ?? [])
      .map((r: { listing: unknown }) => r.listing)
      .filter(Boolean)) as Array<{
        id: string; title: string; price: number | null; is_negotiable: boolean;
        city: string | null; cover_image: string | null; created_at: string;
        type: "product" | "service"; is_featured?: boolean; condition?: string | null;
      }>;
  });

export const reportContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({
      target_type: z.enum(["listing", "user", "message"]),
      target_id: z.string().uuid(),
      reason: z.string().min(3).max(500),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("reports").insert({
      reporter_id: context.userId,
      target_type: data.target_type,
      target_id: data.target_id,
      reason: data.reason,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
