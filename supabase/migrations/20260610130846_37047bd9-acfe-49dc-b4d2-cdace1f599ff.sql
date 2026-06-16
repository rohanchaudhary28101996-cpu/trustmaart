-- Restore Data API privileges; RLS policies remain the gatekeeper
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Public browse pages need anonymous read on catalog-style tables
GRANT SELECT ON public.categories, public.listings, public.listing_images, public.profiles, public.reviews, public.service_details TO anon;

-- Sequences (if any) for inserts
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;

NOTIFY pgrst, 'reload schema';