
-- Remove service listings and their child data
DELETE FROM public.service_details
  WHERE listing_id IN (SELECT id FROM public.listings WHERE type = 'service');
DELETE FROM public.listing_images
  WHERE listing_id IN (SELECT id FROM public.listings WHERE type = 'service');
DELETE FROM public.wishlist
  WHERE listing_id IN (SELECT id FROM public.listings WHERE type = 'service');
DELETE FROM public.reports
  WHERE target_type = 'listing'
    AND target_id IN (SELECT id FROM public.listings WHERE type = 'service');
DELETE FROM public.conversations
  WHERE listing_id IN (SELECT id FROM public.listings WHERE type = 'service');
DELETE FROM public.listings WHERE type = 'service';

-- Remove service categories
DELETE FROM public.categories WHERE type = 'service';
