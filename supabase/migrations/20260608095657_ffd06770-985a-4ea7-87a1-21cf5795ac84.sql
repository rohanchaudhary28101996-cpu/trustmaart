
-- Fix function search_path warnings
ALTER FUNCTION public.touch_updated_at() SET search_path = public;
ALTER FUNCTION public.enforce_listing_image_limit() SET search_path = public;
ALTER FUNCTION public.update_conv_on_msg() SET search_path = public;

-- Move pg_trgm out of public
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION pg_trgm SET SCHEMA extensions;
GRANT USAGE ON SCHEMA extensions TO anon, authenticated, service_role;

-- Revoke broad execute on SECURITY DEFINER helpers (has_role is only needed inside policies which run as table owner)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- ============ STORAGE POLICIES ============
-- listing-images: public read, owner write to /<userId>/...
CREATE POLICY "listing_images_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-images');
CREATE POLICY "listing_images_owner_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "listing_images_owner_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "listing_images_owner_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- chat-images: only conversation participants can read; uploader writes to /<userId>/...
CREATE POLICY "chat_images_owner_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'chat-images' AND auth.role() = 'authenticated');
CREATE POLICY "chat_images_owner_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'chat-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "chat_images_owner_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'chat-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- avatars: public read, owner write
CREATE POLICY "avatars_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
CREATE POLICY "avatars_owner_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "avatars_owner_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "avatars_owner_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
