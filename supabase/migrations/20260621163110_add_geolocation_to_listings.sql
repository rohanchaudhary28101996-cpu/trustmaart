ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;

SELECT pg_notify('pgrst', 'reload schema');
