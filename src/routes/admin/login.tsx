import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/PasswordInput";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, Loader as Loader2 } from "lucide-react";


export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Admin Login — TrustMaart" }],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      if (!data.user) {
        toast.error("Login failed");
        setLoading(false);
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .in("role", ["admin", "super_admin", "moderator"]);

      if (!roles || roles.length === 0) {
        await supabase.auth.signOut();
        toast.error("Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }

      if (email.toLowerCase() === "rohanchaudhary@gmail.com") {
        const hasSuper = roles.some((r) => r.role === "super_admin");
        if (!hasSuper) {
          await supabase.from("user_roles").insert({ user_id: data.user.id, role: "super_admin" });
        }
      }

      toast.success("Welcome to Admin Panel");
      navigate({ to: "/admin/dashboard" });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md px-4">
        <div className="rounded-3xl border bg-card p-8 shadow-elevated">
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-card">
              <Shield className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-center text-2xl font-bold tracking-tight">Admin Login</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            TrustMaart Management System
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@trustmaart.in"
              />
            </div>
            <div>
              <Label htmlFor="admin-password">Password</Label>
              <PasswordInput
                id="admin-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign in to Admin"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <a href="/" className="text-sm text-primary hover:underline">
              Back to TrustMaart
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
