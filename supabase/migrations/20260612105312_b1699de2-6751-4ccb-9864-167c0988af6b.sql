
-- 1) Profiles: remove anonymous public read, only self can read directly
DROP POLICY IF EXISTS profiles_public_read ON public.profiles;
CREATE POLICY profiles_self_read ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- 2) Listings: prevent owners from updating moderation fields
CREATE OR REPLACE FUNCTION public.prevent_owner_moderation_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF app_private.has_admin_access(auth.uid()) THEN
    RETURN NEW;
  END IF;
  IF NEW.moderation_status IS DISTINCT FROM OLD.moderation_status
     OR NEW.rejection_reason IS DISTINCT FROM OLD.rejection_reason
     OR NEW.admin_notes IS DISTINCT FROM OLD.admin_notes
     OR NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at
     OR NEW.reviewed_by IS DISTINCT FROM OLD.reviewed_by
     OR NEW.is_featured IS DISTINCT FROM OLD.is_featured THEN
    RAISE EXCEPTION 'Owners cannot modify moderation fields';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_owner_moderation_changes ON public.listings;
CREATE TRIGGER trg_prevent_owner_moderation_changes
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.prevent_owner_moderation_changes();

-- 3) Chat images: restrict reads to conversation participants
DROP POLICY IF EXISTS chat_images_owner_read ON storage.objects;
DROP POLICY IF EXISTS chat_images_participant_read ON storage.objects;
CREATE POLICY chat_images_participant_read ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'chat-images'
    AND (
      (auth.uid())::text = (storage.foldername(name))[1]
      OR EXISTS (
        SELECT 1
        FROM public.messages m
        JOIN public.conversations c ON c.id = m.conversation_id
        WHERE m.image_url LIKE '%' || storage.objects.name
          AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
      )
    )
  );

-- 4) Admin action logs: deny direct client writes (service role bypasses RLS)
CREATE POLICY admin_logs_no_client_insert ON public.admin_action_logs
  AS RESTRICTIVE FOR INSERT TO authenticated, anon
  WITH CHECK (false);
CREATE POLICY admin_logs_no_client_update ON public.admin_action_logs
  AS RESTRICTIVE FOR UPDATE TO authenticated, anon
  USING (false);
CREATE POLICY admin_logs_no_client_delete ON public.admin_action_logs
  AS RESTRICTIVE FOR DELETE TO authenticated, anon
  USING (false);

-- 5) Notifications: explicit deny client insert; allow self delete
CREATE POLICY notif_no_client_insert ON public.notifications
  AS RESTRICTIVE FOR INSERT TO authenticated, anon
  WITH CHECK (false);
DROP POLICY IF EXISTS notif_self_delete ON public.notifications;
CREATE POLICY notif_self_delete ON public.notifications
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
