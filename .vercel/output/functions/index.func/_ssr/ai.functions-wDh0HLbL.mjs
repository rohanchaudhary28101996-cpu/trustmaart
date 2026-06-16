import { c as createServerRpc } from "./createServerRpc-DJw-wm9Z.mjs";
import { c as createServerFn } from "./server-d-TQUncW.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, a as arrayType, s as stringType } from "../_libs/zod.mjs";
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
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";
async function callGateway(body) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("AI is not configured");
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk"
    },
    body: JSON.stringify({
      model: MODEL,
      ...body
    })
  });
  if (res.status === 429) throw new Error("AI is busy, please try again in a moment.");
  if (res.status === 402) throw new Error("AI credits exhausted. Please add credits to continue.");
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`AI error (${res.status}): ${text.slice(0, 200)}`);
  }
  const json = await res.json();
  return json.choices?.[0]?.message?.content?.trim() ?? "";
}
function extractJson(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  const raw = match ? match[0] : cleaned;
  return JSON.parse(raw);
}
const GenerateInput = objectType({
  notes: stringType().max(800).optional().default(""),
  imageDataUrls: arrayType(stringType().min(20).max(2e6)).max(4).optional().default([])
});
const generateListing_createServerFn_handler = createServerRpc({
  id: "a66931b8af7cacec5fa8202aca7a738160867b9b60ddc0d83cdc2b0255a14826",
  name: "generateListing",
  filename: "src/lib/ai.functions.ts"
}, (opts) => generateListing.__executeServer(opts));
const generateListing = createServerFn({
  method: "POST"
}).inputValidator((data) => GenerateInput.parse(data)).handler(generateListing_createServerFn_handler, async ({
  data
}) => {
  if (!data.notes.trim() && (!data.imageDataUrls || data.imageDataUrls.length === 0)) {
    throw new Error("Add a few words or upload a photo first");
  }
  const sys = `You help Indian sellers on TrustMaart (a second-hand product marketplace) write professional product listings. Always reply in valid JSON only, no prose, no markdown. Currency is INR (₹). Keep tone trustworthy and clear. Use any uploaded photos to identify the product, brand, model, and condition.`;
  const textPart = data.notes.trim() ? `Seller notes:
"""${data.notes.trim()}"""

` : `(No notes — infer everything from the photos.)

`;
  const userText = `${textPart}Return JSON with this exact shape:
{
  "title": string (max 80 chars, catchy + specific, include brand/model if visible),
  "description": string (120-400 chars, friendly, mentions key features and condition),
  "category_slug": one of [mobiles,electronics,vehicles,furniture,fashion,appliances,books,sports,real-estate,pets],
  "condition": one of ["new","like_new","good","fair","used"],
  "tags": array of 3-6 short keywords,
  "suggested_price_inr": number,
  "price_note": short string explaining the price
}`;
  const content = [{
    type: "text",
    text: userText
  }];
  for (const url of data.imageDataUrls ?? []) {
    content.push({
      type: "image_url",
      image_url: {
        url
      }
    });
  }
  const out = await callGateway({
    messages: [{
      role: "system",
      content: sys
    }, {
      role: "user",
      content
    }],
    temperature: 0.4
  });
  try {
    return extractJson(out);
  } catch {
    throw new Error("AI returned an unexpected response. Try again with more detail.");
  }
});
const FinderInput = objectType({
  q: stringType().min(2).max(300)
});
const aiSearchListings_createServerFn_handler = createServerRpc({
  id: "e57383333215c56a223f7e5d2e478aebc4c5b6c9deb319eaa6bb6da976fa557a",
  name: "aiSearchListings",
  filename: "src/lib/ai.functions.ts"
}, (opts) => aiSearchListings.__executeServer(opts));
const aiSearchListings = createServerFn({
  method: "POST"
}).inputValidator((data) => FinderInput.parse(data)).handler(aiSearchListings_createServerFn_handler, async ({
  data
}) => {
  const sys = `You convert Indian buyer queries into structured search filters for TrustMaart (a second-hand product marketplace). Reply ONLY in JSON.`;
  const userMsg = `Query: "${data.q}"
Return JSON:
{
  "keywords": string (a short search phrase),
  "category_slug": string|null (one of mobiles,electronics,vehicles,furniture,fashion,appliances,books,sports,real-estate,pets),
  "max_price_inr": number|null,
  "min_price_inr": number|null,
  "city": string|null,
  "condition": "new"|"like_new"|"good"|"fair"|"used"|null,
  "summary": string (one short sentence to show the buyer)
}`;
  const out = await callGateway({
    messages: [{
      role: "system",
      content: sys
    }, {
      role: "user",
      content: userMsg
    }],
    temperature: 0.2
  });
  let parsed;
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
      summary: `Showing results for "${data.q}".`
    };
  }
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  let q = supabaseAdmin.from("listings").select("id,title,price,is_negotiable,city,cover_image,created_at,type,is_featured,condition").eq("status", "active").eq("moderation_status", "live").eq("type", "product");
  if (parsed.condition) q = q.eq("condition", parsed.condition);
  if (parsed.max_price_inr) q = q.lte("price", parsed.max_price_inr);
  if (parsed.min_price_inr) q = q.gte("price", parsed.min_price_inr);
  if (parsed.city) q = q.ilike("city", `%${parsed.city}%`);
  if (parsed.keywords) q = q.ilike("search_text", `%${parsed.keywords.toLowerCase()}%`);
  if (parsed.category_slug) {
    const {
      data: cat
    } = await supabaseAdmin.from("categories").select("id").eq("slug", parsed.category_slug).maybeSingle();
    if (cat?.id) q = q.eq("category_id", cat.id);
  }
  q = q.order("created_at", {
    ascending: false
  }).limit(24);
  const {
    data: rows
  } = await q;
  return {
    filters: parsed,
    rows: rows ?? []
  };
});
export {
  aiSearchListings_createServerFn_handler,
  generateListing_createServerFn_handler
};
