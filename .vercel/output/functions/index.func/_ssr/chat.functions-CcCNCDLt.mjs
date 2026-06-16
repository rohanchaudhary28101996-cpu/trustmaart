import { f as createSsrRpc } from "./router-CyR1fJhL.mjs";
import { c as createServerFn } from "./server-D1062Wfa.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DjebvYAq.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  listing_id: stringType().uuid()
}).parse(data)).handler(createSsrRpc("ac766ebe0f2f7cb834e9ec2ba6c71d63a798a62b9a2decd13584c84af700339c"));
const myConversations = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("5ad9aecc6a3ae821d30eea8d464da3dd435188bc6016292a95ed6f7f0ba86ee7"));
const getConversation = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  id: stringType().uuid()
}).parse(data)).handler(createSsrRpc("da1aad61dcc8d005620d36d755091c11966e643eef886b2f2a190860280db654"));
const sendMessage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  conversation_id: stringType().uuid(),
  body: stringType().max(2e3).optional(),
  image_url: stringType().max(500).optional()
}).parse(data)).handler(createSsrRpc("4f34919086f2a4130097c5da5423c36b625cea14ed1b142c70bfe1b53f9fd398"));
export {
  getConversation as g,
  myConversations as m,
  sendMessage as s
};
