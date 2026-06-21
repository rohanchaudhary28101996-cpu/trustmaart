import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

type GeminiPart = { text: string } | { inline_data: { mime_type: string; data: string } };

function dataUrlToInlineData(dataUrl: string): { mime_type: string; data: string } {
  const m = dataUrl.match(/^data:(.+?);base64,(.*)$/);
  if (!m) throw new Error("Invalid image data");
  return { mime_type: m[1], data: m[2] };
}

async function callGemini(opts: { system: string; parts: GeminiPart[]; temperature?: number }): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("AI is not configured");
  const res = await fetch(`${GEMINI_URL}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: opts.system }] },
      contents: [{ role: "user", parts: opts.parts }],
      generationConfig: {
        temperature: opts.temperature ?? 0.4,
        responseMimeType: "application/json",
      },
    }),
  });
  if (res.status === 429) throw new Error("AI is busy, please try again in a moment.");
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`AI error (${res.status}): ${text.slice(0, 200)}`);
  }
  const json = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  return json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
}

function extractJson<T>(text: string): T {
  // strip markdown fences
  const cleaned = text.replace(/```json|```/g, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  const raw = match ? match[0] : cleaned;
  return JSON.parse(raw) as T;
}

const GenerateInput = z.object({
  notes: z.string().max(800).optional().default(""),
  imageDataUrls: z.array(z.string().min(20).max(2_000_000)).max(4).optional().default([]),
});

export const generateListing = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => GenerateInput.parse(data))
  .handler(async ({ data }) => {
    if (!data.notes.trim() && (!data.imageDataUrls || data.imageDataUrls.length === 0)) {
      throw new Error("Add a few words or upload a photo first");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: cats } = await supabaseAdmin
      .from("categories")
      .select("slug")
      .eq("type", "product")
      .order("position");
    const categorySlugs = (cats ?? []).map((c) => c.slug).join(",");
    const sys = `You help Indian sellers on TrustMaart (a second-hand product marketplace) write professional product listings. Always reply in valid JSON only, no prose, no markdown. Currency is INR (₹). Keep tone trustworthy and clear. Use any uploaded photos to identify the product, brand, model, and condition.`;
    const textPart = data.notes.trim()
      ? `Seller notes:\n"""${data.notes.trim()}"""\n\n`
      : `(No notes — infer everything from the photos.)\n\n`;
    const userText = `${textPart}Return JSON with this exact shape:\n{\n  "title": string (max 80 chars, catchy + specific, include brand/model if visible),\n  "description": string (120-400 chars, friendly, mentions key features and condition),\n  "category_slug": one of [${categorySlugs}],\n  "condition": one of ["new","like_new","good","fair","used"],\n  "tags": array of 3-6 short keywords,\n  "suggested_price_inr": number,\n  "price_note": short string explaining the price\n}`;
    const parts: GeminiPart[] = [{ text: userText }];
    for (const url of data.imageDataUrls ?? []) {
      parts.push({ inline_data: dataUrlToInlineData(url) });
    }
    const out = await callGemini({ system: sys, parts, temperature: 0.4 });
    try {
      return extractJson<{
        title: string;
        description: string;
        category_slug: string;
        condition: string | null;
        tags: string[];
        suggested_price_inr: number | null;
        price_note: string;
      }>(out);
    } catch {
      throw new Error("AI returned an unexpected response. Try again with more detail.");
    }
  });


const FinderInput = z.object({ q: z.string().min(2).max(300) });

export const aiSearchListings = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => FinderInput.parse(data))
  .handler(async ({ data }) => {
    const sys = `You convert Indian buyer queries into structured search filters for TrustMaart (a second-hand product marketplace). Reply ONLY in JSON.`;
    const userMsg = `Query: "${data.q}"\nReturn JSON:\n{\n  "keywords": string (a short search phrase),\n  "category_slug": string|null (one of mobiles,electronics,vehicles,furniture,fashion,appliances,books,sports,real-estate,pets),\n  "max_price_inr": number|null,\n  "min_price_inr": number|null,\n  "city": string|null,\n  "condition": "new"|"like_new"|"good"|"fair"|"used"|null,\n  "summary": string (one short sentence to show the buyer)\n}`;
    const out = await callGemini({ system: sys, parts: [{ text: userMsg }], temperature: 0.2 });
    let parsed: {
      keywords: string;
      category_slug: string | null;
      max_price_inr: number | null;
      min_price_inr: number | null;
      city: string | null;
      condition: "new" | "like_new" | "good" | "fair" | "used" | null;
      summary: string;
    };
    try {
      parsed = extractJson(out);
    } catch {
      parsed = {
        keywords: data.q,
        category_slug: null,
        max_price_inr: null,
        min_price_inr: null,
        city: null,
        condition: null,
        summary: `Showing results for "${data.q}".`,
      };
    }
    // Now run a database search — always products only, live listings only
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("listings")
      .select("id,title,price,is_negotiable,city,cover_image,created_at,type,is_featured,condition")
      .eq("status", "active")
      .eq("moderation_status", "live")
      .eq("type", "product");
    if (parsed.condition) q = q.eq("condition", parsed.condition);
    if (parsed.max_price_inr) q = q.lte("price", parsed.max_price_inr);
    if (parsed.min_price_inr) q = q.gte("price", parsed.min_price_inr);
    if (parsed.city) q = q.ilike("city", `%${parsed.city}%`);
    if (parsed.keywords) q = q.ilike("search_text", `%${parsed.keywords.toLowerCase()}%`);
    if (parsed.category_slug) {
      const { data: cat } = await supabaseAdmin
        .from("categories")
        .select("id")
        .eq("slug", parsed.category_slug)
        .maybeSingle();
      if (cat?.id) q = q.eq("category_id", cat.id);
    }
    q = q.order("created_at", { ascending: false }).limit(24);
    const { data: rows } = await q;
    return { filters: parsed, rows: rows ?? [] };
  });
