import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — TrustMaart" }] }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen gradient-hero">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
        <div className="rounded-3xl border bg-card p-6 shadow-elevated">
          <h1 className="mb-1 text-xl font-bold">Set a new password</h1>
          <p className="mb-4 text-sm text-muted-foreground">Enter a new password for your account.</p>
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <Label htmlFor="np">New password</Label>
              <Input id="np" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>Update password</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
