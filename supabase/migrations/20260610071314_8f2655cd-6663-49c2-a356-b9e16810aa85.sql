DROP POLICY IF EXISTS listings_public_read_active ON public.listings;
CREATE POLICY listings_public_read_active ON public.listings
  FOR SELECT
  USING (
    ((status = 'active'::public.listing_status) AND (moderation_status = 'live'::public.listing_moderation_status))
    OR (auth.uid() = owner_id)
    OR (auth.role() = 'authenticated' AND app_private.has_admin_access(auth.uid()))
  );

DROP POLICY IF EXISTS categories_admin_all ON public.categories;
CREATE POLICY categories_admin_all ON public.categories
  FOR ALL TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS conv_participant_read ON public.conversations;
CREATE POLICY conv_participant_read ON public.conversations
  FOR SELECT TO authenticated
  USING ((auth.uid() = buyer_id) OR (auth.uid() = seller_id) OR app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS listing_images_owner_write ON public.listing_images;
CREATE POLICY listing_images_owner_write ON public.listing_images
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.listings l
    WHERE l.id = listing_images.listing_id
      AND (l.owner_id = auth.uid() OR app_private.has_role(auth.uid(), 'admin'::public.app_role))
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.listings l
    WHERE l.id = listing_images.listing_id
      AND l.owner_id = auth.uid()
  ));

DROP POLICY IF EXISTS listings_owner_update ON public.listings;
CREATE POLICY listings_owner_update ON public.listings
  FOR UPDATE TO authenticated
  USING ((auth.uid() = owner_id) OR app_private.has_admin_access(auth.uid()));

DROP POLICY IF EXISTS listings_owner_delete ON public.listings;
CREATE POLICY listings_owner_delete ON public.listings
  FOR DELETE TO authenticated
  USING ((auth.uid() = owner_id) OR app_private.has_admin_access(auth.uid()));

DROP POLICY IF EXISTS reports_admin_read ON public.reports;
CREATE POLICY reports_admin_read ON public.reports
  FOR SELECT TO authenticated
  USING ((auth.uid() = reporter_id) OR app_private.has_role(auth.uid(), 'admin'::public.app_role) OR app_private.has_role(auth.uid(), 'moderator'::public.app_role));

DROP POLICY IF EXISTS reports_admin_update ON public.reports;
CREATE POLICY reports_admin_update ON public.reports
  FOR UPDATE TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role) OR app_private.has_role(auth.uid(), 'moderator'::public.app_role));

DROP POLICY IF EXISTS user_roles_admin_all ON public.user_roles;
CREATE POLICY user_roles_admin_all ON public.user_roles
  FOR ALL TO authenticated
  USING (app_private.has_admin_access(auth.uid()))
  WITH CHECK (app_private.has_admin_access(auth.uid()));

NOTIFY pgrst, 'reload schema';