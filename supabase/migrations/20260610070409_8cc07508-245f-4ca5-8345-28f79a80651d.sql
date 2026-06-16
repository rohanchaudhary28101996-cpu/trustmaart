CREATE TABLE IF NOT EXISTS public.admin_action_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  admin_email TEXT,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_action_logs TO authenticated;
GRANT ALL ON public.admin_action_logs TO service_role;
ALTER TABLE public.admin_action_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view action logs" ON public.admin_action_logs
  FOR SELECT TO authenticated USING (public.has_admin_access(auth.uid()));
CREATE INDEX IF NOT EXISTS admin_action_logs_created_at_idx ON public.admin_action_logs (created_at DESC);