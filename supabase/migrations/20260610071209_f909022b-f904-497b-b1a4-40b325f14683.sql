CREATE SCHEMA IF NOT EXISTS app_private;

CREATE OR REPLACE FUNCTION app_private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION app_private.has_admin_access(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin','super_admin','moderator')
  )
$$;

CREATE OR REPLACE FUNCTION app_private.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'super_admin'
  )
$$;

REVOKE ALL ON SCHEMA app_private FROM PUBLIC;
GRANT USAGE ON SCHEMA app_private TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION app_private.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION app_private.has_admin_access(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION app_private.is_super_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app_private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.has_admin_access(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.is_super_admin(uuid) TO authenticated, service_role;

DROP POLICY IF EXISTS "Admins can view action logs" ON public.admin_action_logs;
CREATE POLICY "Admins can view action logs" ON public.admin_action_logs
  FOR SELECT TO authenticated
  USING (app_private.has_admin_access(auth.uid()));

DROP POLICY IF EXISTS categories_admin_all ON public.categories;
CREATE POLICY categories_admin_all ON public.categories
  FOR ALL
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS conv_participant_read ON public.conversations;
CREATE POLICY conv_participant_read ON public.conversations
  FOR SELECT
  USING ((auth.uid() = buyer_id) OR (auth.uid() = seller_id) OR app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS listing_images_owner_write ON public.listing_images;
CREATE POLICY listing_images_owner_write ON public.listing_images
  FOR ALL
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

DROP POLICY IF EXISTS listings_public_read_active ON public.listings;
CREATE POLICY listings_public_read_active ON public.listings
  FOR SELECT
  USING (((status = 'active'::public.listing_status) AND (moderation_status = 'live'::public.listing_moderation_status)) OR (auth.uid() = owner_id) OR app_private.has_admin_access(auth.uid()));

DROP POLICY IF EXISTS listings_owner_update ON public.listings;
CREATE POLICY listings_owner_update ON public.listings
  FOR UPDATE
  USING ((auth.uid() = owner_id) OR app_private.has_admin_access(auth.uid()));

DROP POLICY IF EXISTS listings_owner_delete ON public.listings;
CREATE POLICY listings_owner_delete ON public.listings
  FOR DELETE
  USING ((auth.uid() = owner_id) OR app_private.has_admin_access(auth.uid()));

DROP POLICY IF EXISTS reports_admin_read ON public.reports;
CREATE POLICY reports_admin_read ON public.reports
  FOR SELECT
  USING ((auth.uid() = reporter_id) OR app_private.has_role(auth.uid(), 'admin'::public.app_role) OR app_private.has_role(auth.uid(), 'moderator'::public.app_role));

DROP POLICY IF EXISTS reports_admin_update ON public.reports;
CREATE POLICY reports_admin_update ON public.reports
  FOR UPDATE
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role) OR app_private.has_role(auth.uid(), 'moderator'::public.app_role));

DROP POLICY IF EXISTS user_roles_admin_all ON public.user_roles;
CREATE POLICY user_roles_admin_all ON public.user_roles
  FOR ALL
  USING (app_private.has_admin_access(auth.uid()))
  WITH CHECK (app_private.has_admin_access(auth.uid()));

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.has_admin_access(uuid) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.is_super_admin(uuid) FROM authenticated;

NOTIFY pgrst, 'reload schema';