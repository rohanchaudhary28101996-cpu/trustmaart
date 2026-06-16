
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
CREATE TYPE public.listing_type AS ENUM ('product','service');
CREATE TYPE public.listing_status AS ENUM ('draft','active','sold','removed');
CREATE TYPE public.listing_condition AS ENUM ('new','like_new','good','fair','used');
CREATE TYPE public.report_status AS ENUM ('open','reviewed','dismissed','actioned');

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT, avatar_url TEXT, phone TEXT, city TEXT, state TEXT, bio TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_self_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- USER ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_self_read" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "user_roles_admin_all" ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- CATEGORIES
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_hi TEXT,
  icon TEXT,
  type public.listing_type NOT NULL,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_all" ON public.categories FOR ALL
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- LISTINGS
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.listing_type NOT NULL,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 3 AND 120),
  description TEXT CHECK (description IS NULL OR length(description) <= 4000),
  price NUMERIC(12,2) CHECK (price IS NULL OR price >= 0),
  is_negotiable BOOLEAN NOT NULL DEFAULT true,
  condition public.listing_condition,
  brand TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  city TEXT,
  state TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  status public.listing_status NOT NULL DEFAULT 'active',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  view_count INT NOT NULL DEFAULT 0,
  cover_image TEXT,
  search_text TEXT GENERATED ALWAYS AS (lower(coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(brand,'') || ' ' || coalesce(city,''))) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX listings_status_created_idx ON public.listings (status, created_at DESC);
CREATE INDEX listings_type_idx ON public.listings (type);
CREATE INDEX listings_category_idx ON public.listings (category_id);
CREATE INDEX listings_owner_idx ON public.listings (owner_id);
CREATE INDEX listings_search_idx ON public.listings USING gin (search_text gin_trgm_ops);

GRANT SELECT ON public.listings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.listings TO authenticated;
GRANT ALL ON public.listings TO service_role;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "listings_public_read_active" ON public.listings FOR SELECT
  USING (status = 'active' OR auth.uid() = owner_id OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator'));
CREATE POLICY "listings_owner_insert" ON public.listings FOR INSERT
  WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "listings_owner_update" ON public.listings FOR UPDATE
  USING (auth.uid() = owner_id OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator'));
CREATE POLICY "listings_owner_delete" ON public.listings FOR DELETE
  USING (auth.uid() = owner_id OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER listings_touch BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- LISTING IMAGES (max 10)
CREATE TABLE public.listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX listing_images_listing_idx ON public.listing_images (listing_id, position);
GRANT SELECT ON public.listing_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.listing_images TO authenticated;
GRANT ALL ON public.listing_images TO service_role;
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "listing_images_public_read" ON public.listing_images FOR SELECT USING (true);
CREATE POLICY "listing_images_owner_write" ON public.listing_images FOR ALL
  USING (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND (l.owner_id = auth.uid() OR public.has_role(auth.uid(),'admin'))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.owner_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.enforce_listing_image_limit()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE c INT;
BEGIN
  SELECT COUNT(*) INTO c FROM public.listing_images WHERE listing_id = NEW.listing_id;
  IF c >= 10 THEN
    RAISE EXCEPTION 'A listing can have at most 10 images';
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER listing_images_limit BEFORE INSERT ON public.listing_images
  FOR EACH ROW EXECUTE FUNCTION public.enforce_listing_image_limit();

-- SERVICE DETAILS
CREATE TABLE public.service_details (
  listing_id UUID PRIMARY KEY REFERENCES public.listings(id) ON DELETE CASCADE,
  experience_years INT CHECK (experience_years IS NULL OR experience_years BETWEEN 0 AND 80),
  availability TEXT,
  areas_served TEXT[] NOT NULL DEFAULT '{}'
);
GRANT SELECT ON public.service_details TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.service_details TO authenticated;
GRANT ALL ON public.service_details TO service_role;
ALTER TABLE public.service_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_details_public_read" ON public.service_details FOR SELECT USING (true);
CREATE POLICY "service_details_owner_write" ON public.service_details FOR ALL
  USING (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.owner_id = auth.uid()));

-- WISHLIST
CREATE TABLE public.wishlist (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, listing_id)
);
GRANT SELECT, INSERT, DELETE ON public.wishlist TO authenticated;
GRANT ALL ON public.wishlist TO service_role;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wishlist_self" ON public.wishlist FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- CONVERSATIONS + MESSAGES
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_preview TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(listing_id, buyer_id, seller_id)
);
CREATE INDEX conversations_buyer_idx ON public.conversations(buyer_id, last_message_at DESC);
CREATE INDEX conversations_seller_idx ON public.conversations(seller_id, last_message_at DESC);
GRANT SELECT, INSERT, UPDATE ON public.conversations TO authenticated;
GRANT ALL ON public.conversations TO service_role;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "conv_participant_read" ON public.conversations FOR SELECT
  USING (auth.uid() IN (buyer_id, seller_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "conv_buyer_insert" ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "conv_participant_update" ON public.conversations FOR UPDATE
  USING (auth.uid() IN (buyer_id, seller_id));

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT,
  image_url TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (body IS NOT NULL OR image_url IS NOT NULL)
);
CREATE INDEX messages_conv_idx ON public.messages(conversation_id, created_at);
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "msg_participant_read" ON public.messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND auth.uid() IN (c.buyer_id, c.seller_id)));
CREATE POLICY "msg_participant_insert" ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id AND EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND auth.uid() IN (c.buyer_id, c.seller_id)));
CREATE POLICY "msg_participant_update" ON public.messages FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND auth.uid() IN (c.buyer_id, c.seller_id)));

CREATE OR REPLACE FUNCTION public.update_conv_on_msg()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.conversations
    SET last_message_at = NEW.created_at,
        last_message_preview = COALESCE(NEW.body, '📷 Photo')
    WHERE id = NEW.conversation_id;
  RETURN NEW;
END; $$;
CREATE TRIGGER messages_update_conv AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conv_on_msg();

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.conversations REPLICA IDENTITY FULL;

-- REVIEWS
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT CHECK (comment IS NULL OR length(comment) <= 1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (reviewer_id, target_user_id, listing_id)
);
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_public_read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_self_write" ON public.reviews FOR ALL
  USING (auth.uid() = reviewer_id) WITH CHECK (auth.uid() = reviewer_id AND reviewer_id <> target_user_id);

-- REPORTS
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('listing','user','message')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL CHECK (length(reason) BETWEEN 3 AND 500),
  status public.report_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.reports TO authenticated;
GRANT ALL ON public.reports TO service_role;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports_self_insert" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "reports_admin_read" ON public.reports FOR SELECT
  USING (auth.uid() = reporter_id OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator'));
CREATE POLICY "reports_admin_update" ON public.reports FOR UPDATE
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator'));

-- BLOCKS
CREATE TABLE public.blocks (
  blocker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id),
  CHECK (blocker_id <> blocked_id)
);
GRANT SELECT, INSERT, DELETE ON public.blocks TO authenticated;
GRANT ALL ON public.blocks TO service_role;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blocks_self" ON public.blocks FOR ALL
  USING (auth.uid() = blocker_id) WITH CHECK (auth.uid() = blocker_id);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_idx ON public.notifications (user_id, created_at DESC);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif_self_read" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notif_self_update" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
