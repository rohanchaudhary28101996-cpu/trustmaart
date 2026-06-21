ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS pincode TEXT;

SELECT pg_notify('pgrst', 'reload schema');
