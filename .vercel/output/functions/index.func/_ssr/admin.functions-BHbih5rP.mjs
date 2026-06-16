import { f as createSsrRpc } from "./router-CyR1fJhL.mjs";
import { c as createServerFn } from "./server-D1062Wfa.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DjebvYAq.mjs";
import { o as objectType, s as stringType, e as enumType, n as numberType, b as booleanType } from "../_libs/zod.mjs";
const adminOverview = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("65dbdd42678d4cf3348f8143806993df600c6d6e2d11eded1594324413609a95"));
const adminListUsers = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  q: stringType().max(120).optional()
}).default({}).parse(data ?? {})).handler(createSsrRpc("35cf6cc28f61c798a570ec39672552de8ed250f60706565e25b34a66f0c5b240"));
const adminToggleUserFlag = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  user_id: stringType().uuid(),
  flag: enumType(["is_verified", "is_blocked"]),
  value: booleanType()
}).parse(data)).handler(createSsrRpc("6548020cae1978a1af1957c128181f0952d8107458a6a421b51cf5b3868e47e4"));
const adminAssignRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  user_id: stringType().uuid(),
  role: enumType(["admin", "moderator", "user"]),
  grant: booleanType()
}).parse(data)).handler(createSsrRpc("c39f0463c9489f3f30a5c28a63c3c970343ad9d21cfd932473b2525683655898"));
const adminListListings = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  moderation_status: enumType(["pending", "live", "rejected", "changes_required", "suspended", "expired"]).optional(),
  type: enumType(["product", "service"]).optional(),
  q: stringType().max(120).optional()
}).default({}).parse(data ?? {})).handler(createSsrRpc("b196496908122569ad0085069a64c275b09878c8a7ff8d73d8d8d648c8b7163d"));
const adminModerateListing = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  id: stringType().uuid(),
  action: enumType(["approve", "reject", "request_changes", "suspend", "delete", "feature"]),
  reason: stringType().max(1e3).optional(),
  featured: booleanType().optional()
}).parse(data)).handler(createSsrRpc("a011cfa9ec035c18aa07fcf7bb34a1b841a71427cc072482532e0fa849222272"));
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
}).parse(data)).handler(createSsrRpc("ebbdcd8384982fed07cdff162dda885fc585e0e802eb0571204a69813f595aa1"));
const adminListReports = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("4331efd96cf8818a0aa9d7d502d9086b7c2de6e0db941a88fa49b3ef6326520f"));
const adminResolveReport = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  id: stringType().uuid(),
  status: enumType(["reviewed", "dismissed", "actioned"])
}).parse(data)).handler(createSsrRpc("b5a5f30d97379d1e54170e047e986dff82320bb167efffa9d4b6ce8283833f02"));
const adminGetActionLogs = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  limit: numberType().min(1).max(200).default(100),
  offset: numberType().min(0).default(0)
}).default({}).parse(data ?? {})).handler(createSsrRpc("db75d74dab33093ea565d9568a2a2e96d4bdfd916e41ae8d725b48fa87bea198"));
const adminGetConversations = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("0ad7a7f6a267705e687cdc555797871df6a32479bad1e95b86dcad5cc16f9671"));
const adminGetMessages = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  conversation_id: stringType().uuid()
}).parse(data)).handler(createSsrRpc("ba3a06e540e88842e998f975bfbc4f3e405fb6199b9c2a8fb3ecdd6bb5234eb0"));
export {
  adminListUsers as a,
  adminToggleUserFlag as b,
  adminAssignRole as c,
  adminListReports as d,
  adminResolveReport as e,
  adminListListings as f,
  adminModerateListing as g,
  adminUpdateListing as h,
  adminOverview as i,
  adminGetConversations as j,
  adminGetMessages as k,
  adminGetActionLogs as l
};
