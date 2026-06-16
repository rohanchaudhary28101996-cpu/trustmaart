
-- =================================================================
-- Security hardening: fix 6 detected issues
-- =================================================================

-- -----------------------------------------------------------------
-- 1. Profiles: phone is publicly readable by anon
--    Revoke table-level SELECT from anon, re-grant only safe columns.
--    Service-role (used by all server functions) bypasses this.
--    Authenticated users retain full SELECT for their own profile reads.
-- -----------------------------------------------------------------
REVOKE SELECT ON public.profiles FROM anon;
GRANT SELECT (
  id, full_name, avatar_url, city, state, bio,
  is_verified, is_blocked, created_at, updated_at
) ON public.profiles TO anon;

-- -----------------------------------------------------------------
-- 2. Chat images: any authenticated user can read any image.
--    Restrict to the uploader (own folder) OR a participant of a
--    conversation that references this image in a message.
-- -----------------------------------------------------------------
DROP POLICY IF EXISTS "chat_images_owner_read" ON storage.objects;
CREATE POLICY "chat_images_participant_read" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'chat-images'
    AND (
      -- uploader can always read their own uploads
      auth.uid()::text = (storage.foldername(name))[1]
      -- OR the image appears in a message of a conversation this user participates in
      OR EXISTS (
        SELECT 1
        FROM public.messages m
        JOIN public.conversations c ON c.id = m.conversation_id
        WHERE m.image_url LIKE '%' || name
          AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
      )
    )
  );

-- -----------------------------------------------------------------
-- 3. Listings: owners can write admin-only fields (moderation_status,
--    admin_notes, rejection_reason, reviewed_at, reviewed_by, is_featured).
--    Revoke broad UPDATE from authenticated and re-grant only the
--    owner-editable columns. All admin mutations go through service_role
--    (supabaseAdmin) which bypasses column privileges.
-- -----------------------------------------------------------------
REVOKE UPDATE ON public.listings FROM authenticated;
GRANT UPDATE (
  title, description, price, is_negotiable,
  condition, brand, category_id,
  city, state, tags, cover_image, status
) ON public.listings TO authenticated;

-- -----------------------------------------------------------------
-- 4. Notifications: no DELETE policy – users cannot remove their own.
--    INSERT intentionally stays service-role-only (system notifications).
-- -----------------------------------------------------------------
DROP POLICY IF EXISTS notif_self_delete ON public.notifications;
CREATE POLICY notif_self_delete ON public.notifications
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- -----------------------------------------------------------------
-- 5. Admin action logs: INSERT is intentionally service-role-only.
--    That is the correct design for an immutable audit log.
--    No additional policy required.
-- -----------------------------------------------------------------

-- -----------------------------------------------------------------
-- 6. Realtime channel access: postgres_changes subscriptions already
--    respect the existing RLS SELECT policies (messages, conversations,
--    notifications all have participant/owner-scoped SELECT policies and
--    REPLICA IDENTITY FULL set in prior migrations).
--    No schema change required.
-- -----------------------------------------------------------------

NOTIFY pgrst, 'reload schema';
