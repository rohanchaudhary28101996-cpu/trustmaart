
-- 1) Extend app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';

-- Commit enum change before use
COMMIT;
BEGIN;

-- 2) Moderation status enum
DO $$ BEGIN
  CREATE TYPE public.listing_moderation_status AS ENUM ('pending','live','rejected','changes_required','suspended','expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3) New columns on listings
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS moderation_status public.listing_moderation_status NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid;

-- Backfill: existing active listings = live
UPDATE public.listings SET moderation_status = 'live' WHERE moderation_status = 'pending' AND status = 'active';

CREATE INDEX IF NOT EXISTS listings_moderation_idx ON public.listings (moderation_status, created_at DESC);

-- 4) Helper: has_admin_access (admin OR super_admin OR moderator)
CREATE OR REPLACE FUNCTION public.has_admin_access(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','super_admin','moderator'))
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'super_admin')
$$;

-- 5) Update listings RLS: public read requires status=active AND moderation_status=live (or owner/admin)
DROP POLICY IF EXISTS listings_public_read_active ON public.listings;
CREATE POLICY listings_public_read_active ON public.listings FOR SELECT
  USING (
    ((status = 'active' AND moderation_status = 'live'))
    OR (auth.uid() = owner_id)
    OR public.has_admin_access(auth.uid())
  );

DROP POLICY IF EXISTS listings_owner_update ON public.listings;
CREATE POLICY listings_owner_update ON public.listings FOR UPDATE
  USING ((auth.uid() = owner_id) OR public.has_admin_access(auth.uid()));

DROP POLICY IF EXISTS listings_owner_delete ON public.listings;
CREATE POLICY listings_owner_delete ON public.listings FOR DELETE
  USING ((auth.uid() = owner_id) OR public.has_admin_access(auth.uid()));

-- 6) Update user_roles RLS so super_admin can manage roles too
DROP POLICY IF EXISTS user_roles_admin_all ON public.user_roles;
CREATE POLICY user_roles_admin_all ON public.user_roles
  USING (public.has_admin_access(auth.uid()))
  WITH CHECK (public.has_admin_access(auth.uid()));

-- 7) Update handle_new_user trigger to auto-assign super_admin for the configured email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url'
  ) ON CONFLICT (id) DO NOTHING;

  IF lower(NEW.email) = 'rohanchaudhary281095@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin')
      ON CONFLICT (user_id, role) DO NOTHING;
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
      ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
      ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

-- 8) Backfill existing super admin if account already exists
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'::app_role FROM auth.users WHERE lower(email) = 'rohanchaudhary281095@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE lower(email) = 'rohanchaudhary281095@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- 9) Realtime
ALTER TABLE public.listings REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.listings;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
