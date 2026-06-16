import { s as supabase } from "./client-DHBFCFA_.mjs";
const cache = /* @__PURE__ */ new Map();
const EXPIRES = 60 * 60;
async function signedUrl(bucket, path) {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  const key = `${bucket}/${path}`;
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.exp > now + 6e4) return hit.url;
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, EXPIRES);
  const url = data?.signedUrl ?? "";
  cache.set(key, { url, exp: now + EXPIRES * 1e3 });
  return url;
}
export {
  signedUrl as s
};
