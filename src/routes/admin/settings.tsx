import { createFileRoute } from "@tanstack/react-router";
import { Shield, Bell, Lock, Globe } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin/settings")({
  ssr: false,
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const { isSuperAdmin } = useAuth();

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage platform configuration and preferences.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">TrustMaart Admin</h3>
                <p className="text-xs text-muted-foreground">Version 1.0</p>
              </div>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              Premium classifieds marketplace for India. Manual ad approval is enabled — every listing must be verified before going live.
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Security</h3>
                <p className="text-xs text-muted-foreground">Role-based access control</p>
              </div>
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Manual ad approval</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Admin access</span>
                <Badge variant="secondary">{isSuperAdmin ? "Super Admin" : "Admin"}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>User verification</span>
                <Badge variant="secondary">Required</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Notifications</h3>
                <p className="text-xs text-muted-foreground">Real-time alerts</p>
              </div>
            </div>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>Sellers receive notifications for:</p>
              <ul className="list-inside list-disc space-y-1">
                <li>Ad submitted</li>
                <li>Ad approved</li>
                <li>Ad rejected</li>
                <li>Changes requested</li>
                <li>Ad suspended</li>
              </ul>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Platform Info</h3>
                <p className="text-xs text-muted-foreground">TrustMaart marketplace</p>
              </div>
            </div>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>TrustMaart is India's modern marketplace for second-hand products and local services.</p>
              <p>Features include AI-powered listings, real-time chat, and manual moderation.</p>
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
