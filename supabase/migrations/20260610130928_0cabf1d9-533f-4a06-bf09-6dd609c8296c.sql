GRANT USAGE ON SCHEMA app_private TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.has_role(uuid, app_role) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.has_admin_access(uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.is_super_admin(uuid) TO anon, authenticated, service_role;
NOTIFY pgrst, 'reload schema';