import { supabase } from "@/integrations/supabase/client";

type Bucket = "listing-images" | "chat-images" | "avatars";
const cache = new Map<string, { url: string; exp: number }>();
const EXPIRES = 60 * 60; // 1h

export async function signedUrl(bucket: Bucket, path: string | null | undefined): Promise<string> {
  if (!path) return "";
  // If already a full URL, return as-is.
  if (/^https?:\/\//.test(path)) return path;
  const key = `${bucket}/${path}`;
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.exp > now + 60_000) return hit.url;
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, EXPIRES);
  const url = data?.signedUrl ?? "";
  cache.set(key, { url, exp: now + EXPIRES * 1000 });
  return url;
}

export async function signedUrls(bucket: Bucket, paths: string[]): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  const need: string[] = [];
  const now = Date.now();
  for (const p of paths) {
    if (!p) continue;
    if (/^https?:\/\//.test(p)) {
      out[p] = p;
      continue;
    }
    const hit = cache.get(`${bucket}/${p}`);
    if (hit && hit.exp > now + 60_000) out[p] = hit.url;
    else need.push(p);
  }
  if (need.length) {
    const { data } = await supabase.storage.from(bucket).createSignedUrls(need, EXPIRES);
    (data ?? []).forEach((d) => {
      if (d.path && d.signedUrl) {
        cache.set(`${bucket}/${d.path}`, { url: d.signedUrl, exp: now + EXPIRES * 1000 });
        out[d.path] = d.signedUrl;
      }
    });
  }
  return out;
}

export async function uploadToBucket(
  bucket: Bucket,
  path: string,
  file: File,
): Promise<{ path: string; error: Error | null }> {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: false,
    contentType: file.type,
  });
  return { path: data?.path ?? path, error: error as Error | null };
}
