import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    // Skip auth check for login page to avoid redirect loop
    if (location.pathname === "/admin/login") return;

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/admin/login" });
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .in("role", ["admin", "super_admin"]);
    if (!roles || roles.length === 0) {
      throw redirect({ to: "/" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { user, roles, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || !roles.some((r) => ["admin", "super_admin"].includes(r)))) {
      window.location.href = "/";
    }
  }, [user, roles, loading]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <Outlet />;
}
