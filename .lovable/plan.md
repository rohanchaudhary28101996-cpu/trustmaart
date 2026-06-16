# TrustMaart — Build Plan

A modern, premium, mobile-first marketplace (second-hand products + local services) with realtime chat, AI listing assistant, AI product finder, and full admin panel. Indian market: ₹ INR, English + Hindi UI, light/dark mode.

Stack: TanStack Start (already scaffolded) + Lovable Cloud (Postgres, Auth, Storage, Realtime) + Lovable AI Gateway (Gemini). Email/password + Google sign-in. Phone OTP deferred to Phase 2 (needs SMS provider).

---

## 1. Foundations

- Enable Lovable Cloud (database, auth, storage, realtime).
- Design system: clean premium tokens in `src/styles.css` (light + dark), trust-blue primary, generous spacing, rounded-2xl cards, soft shadows. Inter / Plus Jakarta Sans.
- i18n: lightweight English/Hindi toggle via context + JSON dictionaries (`en.json`, `hi.json`).
- Currency formatter (`₹` INR, Indian digit grouping).
- Shared layout: top nav (logo, search, post-ad CTA, language, theme, profile), mobile bottom nav, footer.

## 2. Database schema (Lovable Cloud)

Tables (all with RLS + grants):
- `profiles` — id (FK auth.users), full_name, avatar_url, phone, city, state, bio, is_verified, created_at.
- `user_roles` — separate table, enum `app_role` {admin, moderator, user}. `has_role()` security-definer fn.
- `categories` — id, slug, name_en, name_hi, icon, parent_id, type (`product`|`service`).
- `listings` — id, owner_id, type (`product`|`service`), title, description, price, is_negotiable, condition, brand, category_id, city, state, lat/lng, status (`draft`|`active`|`sold`|`removed`), is_featured, view_count, created_at.
- `listing_images` — id, listing_id, url, position. **Max 10 images per listing** (enforced via DB trigger + server-fn validation).
- `service_details` — listing_id, experience_years, availability, areas_served (text[]).
- `wishlist` — user_id, listing_id.
- `conversations` — id, listing_id, buyer_id, seller_id, last_message_at.
- `messages` — id, conversation_id, sender_id, body, image_url, read_at, created_at.
- `reviews` — id, reviewer_id, target_user_id, listing_id, rating, comment.
- `reports` — id, reporter_id, target_type, target_id, reason, status.
- `blocks` — blocker_id, blocked_id.
- `notifications` — id, user_id, type, payload, read_at.

Storage buckets: `listing-images` (public read), `chat-images` (signed), `avatars` (public).

## 3. Authentication

- Email/password signup + login.
- Google OAuth via Lovable broker.
- Forgot password + `/reset-password` page.
- Profile auto-create trigger.
- `_authenticated/` protected subtree using integration-managed gate.
- Role assignment on signup (default `user`); admin role granted manually.

## 4. Pages

Public:
- `/` Home — hero with AI search, category grid, featured products, popular services, recent listings, AI assistant teaser, how-it-works, trust & safety, footer.
- `/browse` Products — grid + advanced filters (category, price, location, condition, brand, date).
- `/services` Browse services — filters (category, area, experience, rating).
- `/listing/$id` Product detail — gallery, price, seller card with rating + verified badge, description, chat CTA, similar listings, report.
- `/service/$id` Service detail — same shape with experience, areas, reviews.
- `/search?q=...` AI Product Finder results.
- `/auth`, `/auth/reset-password`, `/help`, `/about`, `/contact`.

Authenticated (`_authenticated/`):
- `/sell` Create listing (product or service) with AI Assistant toggle.
- `/dashboard` role-aware shell.
  - Seller: my listings, inquiries, sold, performance.
  - Buyer: saved, my chats, reviews given.
- `/chat` inbox + `/chat/$conversationId` thread.
- `/wishlist`, `/notifications`, `/profile`, `/profile/edit`.

Admin (`_authenticated/admin/`, role-gated):
- Overview analytics (users, listings, chats, reports).
- Users (block/unblock, verify badge, change role).
- Listings & services moderation (approve/remove/feature).
- Reports queue.
- Categories CRUD.

## 5. Listings & search

- Create listing form: photo upload (multi, drag-reorder, **up to 10 images per listing**, ~5 MB each, jpg/png/webp; client-side count guard + server-fn + DB trigger enforcement), title, category, condition, brand, price + negotiable toggle, description, location autocomplete, contact prefs.
- Edit/delete from seller dashboard (re-upload respects the 10-image cap, counting existing images).
- Browse: server-fn powered query with filters, pagination, sort.
- Wishlist toggle on cards.
- Share + report actions.

## 6. Realtime 1:1 chat

- "Chat with seller" on listing detail → creates/loads conversation.
- Realtime via Supabase channels on `messages`.
- Read receipts (`read_at`), typing indicator (broadcast channel), image upload to `chat-images`.
- Block / report from chat header.
- Inbox sorted by `last_message_at` with unread badges.

## 7. AI features (Lovable AI Gateway, model: `google/gemini-3-flash-preview`)

Server functions (`src/lib/ai.functions.ts`) — keys stay server-side.

- **AI Listing Assistant** (`generateListing`): seller enters a few notes + optional photo; AI returns `{ title, description, category_slug, tags[], condition_summary, suggested_price_range }` via `Output.object` (Zod schema). Seller can edit before publishing.
- **AI Product Finder** (`searchListings`): natural-language query → AI extracts `{ keywords, category, max_price, min_price, city, condition, brand }`; we run a SQL filter and return matching listings; AI also writes a short summary shown above results.
- **Smart recommendations** on home + listing detail (similar by category + price band).

Surface 429 / 402 gateway errors as toast messages.

## 8. Security & trust

- RLS on every table; grants per role.
- Roles in `user_roles` (never on profiles).
- Verified badge controlled by admin.
- Report + block flows wired to admin queue.
- Zod validation on every server fn input (length caps, allowed chars).
- Rate-limit AI endpoints per user (simple counter table).

## 9. Polish

- Skeleton loaders on every async surface.
- Empty states with illustrations.
- Toast feedback (sonner) for all mutations.
- SEO `head()` per route (title, description, OG).
- 404 + error boundaries already in root.

---

## Technical notes

- Read shape: TanStack Query + `ensureQueryData` in loaders, `useSuspenseQuery` in components.
- All DB access via `createServerFn` (`requireSupabaseAuth` for user-scoped; `supabaseAdmin` inside handler for admin/public reads).
- Chat realtime uses the browser supabase client directly inside components (subscriptions are browser-safe).
- Storage uploads from client with signed/public bucket policies.
- Build order inside build mode (so the user gets visible progress):
  1. Cloud + schema + design system + layout + auth.
  2. Listings CRUD (with 10-image upload) + browse + detail + wishlist.
  3. Services flow (reuses listings).
  4. Realtime chat.
  5. AI Listing Assistant + AI Product Finder.
  6. Seller + Buyer dashboards.
  7. Admin panel.
  8. i18n (Hindi), notifications, reviews, reports, polish.

## Out of scope for v1 (can add later)

- Phone OTP login (needs Twilio/MSG91 — you'd provide keys).
- Phone call button (requires verified phone numbers).
- Native mobile app.
- Payments / escrow (TrustMaart is contact-only like OLX).
- Map-based search UI (we store lat/lng so it's easy to add).
