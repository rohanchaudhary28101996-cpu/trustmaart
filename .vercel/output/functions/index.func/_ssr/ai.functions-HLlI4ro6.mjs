import { f as createSsrRpc } from "./router-CyR1fJhL.mjs";
import { c as createServerFn } from "./server-D1062Wfa.mjs";
import { o as objectType, s as stringType, a as arrayType } from "../_libs/zod.mjs";
const GenerateInput = objectType({
  notes: stringType().max(800).optional().default(""),
  imageDataUrls: arrayType(stringType().min(20).max(2e6)).max(4).optional().default([])
});
const generateListing = createServerFn({
  method: "POST"
}).inputValidator((data) => GenerateInput.parse(data)).handler(createSsrRpc("a66931b8af7cacec5fa8202aca7a738160867b9b60ddc0d83cdc2b0255a14826"));
const FinderInput = objectType({
  q: stringType().min(2).max(300)
});
const aiSearchListings = createServerFn({
  method: "POST"
}).inputValidator((data) => FinderInput.parse(data)).handler(createSsrRpc("e57383333215c56a223f7e5d2e478aebc4c5b6c9deb319eaa6bb6da976fa557a"));
export {
  aiSearchListings as a,
  generateListing as g
};
