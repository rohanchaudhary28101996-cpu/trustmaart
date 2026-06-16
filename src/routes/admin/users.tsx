import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Search, Ban, BadgeCheck, Shield, Crown, UserCheck,
  ShoppingBag, MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { adminListUsers, adminToggleUserFlag, adminAssignRole } from "@/lib/admin.functions";
import { timeAgo } from "@/lib/format";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin/users")({
  ssr: false,
  component: UsersPage,
});

function UsersPage() {
  const qc = useQueryClient();
  const { isSuperAdmin } = useAuth();
  const [q, setQ] = useState("");
  const [viewUser, setViewUser] = useState<null | Awaited<ReturnType<typeof adminListUsers>>[number]>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users", q],
    queryFn: () => adminListUsers({ data: { q: q || undefined } }),
  });

  async function toggleFlag(uid: string, flag: "is_verified" | "is_blocked", value: boolean) {
    try {
      await adminToggleUserFlag({ data: { user_id: uid, flag, value } });
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(value ? (flag === "is_verified" ? "User verified" : "User banned") : (flag === "is_verified" ? "Verification removed" : "User unbanned"));
    } catch (e) { toast.error((e as Error).message); }
  }

  async function setRole(uid: string, role: "admin" | "moderator", grant: boolean) {
    try {
      await adminAssignRole({ data: { user_id: uid, role, grant } });
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(grant ? `Made ${role}` : `Revoked ${role}`);
    } catch (e) { toast.error((e as Error).message); }
  }

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">Search, verify, ban, and manage user roles.</p>

        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name…" className="pl-9" />
          </div>
          <Badge variant="secondary" className="h-9 px-3">{users.length} users</Badge>
        </div>

        <div className="mt-4 grid gap-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : users.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">No users found.</Card>
          ) : (
            users.map((u) => (
              <Card key={u.id} className="flex flex-wrap items-center gap-3 p-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                  {u.avatar_url ? (
                    <img src={u.avatar_url} alt={u.full_name ?? "User"} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-xs font-bold text-primary">
                      {(u.full_name ?? "U").slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{u.full_name ?? "User"}</span>
                    {u.roles.includes("super_admin") && <Badge className="gap-1 bg-amber-500 hover:bg-amber-600"><Crown className="h-3 w-3" /> Super</Badge>}
                    {u.roles.includes("admin") && <Badge variant="secondary">Admin</Badge>}
                    {u.roles.includes("moderator") && <Badge variant="secondary">Mod</Badge>}
                    {u.is_verified && <Badge className="gap-1 bg-emerald-500 hover:bg-emerald-600"><BadgeCheck className="h-3 w-3" /> Verified</Badge>}
                    {u.is_blocked && <Badge variant="destructive">Blocked</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {u.city ?? "—"} · {u.phone ?? "no phone"} · joined {timeAgo(u.created_at)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  <Button size="sm" variant="outline" onClick={() => setViewUser(u)}>
                    <UserCheck className="mr-1 h-3 w-3" /> View
                  </Button>
                  <Button size="sm" variant={u.is_verified ? "default" : "outline"} onClick={() => toggleFlag(u.id, "is_verified", !u.is_verified)}>
                    <BadgeCheck className="mr-1 h-3 w-3" /> {u.is_verified ? "Unverify" : "Verify"}
                  </Button>
                  <Button size="sm" variant={u.is_blocked ? "default" : "outline"} onClick={() => toggleFlag(u.id, "is_blocked", !u.is_blocked)}>
                    <Ban className="mr-1 h-3 w-3" /> {u.is_blocked ? "Unban" : "Ban"}
                  </Button>
                  {isSuperAdmin && !u.roles.includes("super_admin") && (
                    <Button size="sm" variant={u.roles.includes("admin") ? "default" : "outline"} onClick={() => setRole(u.id, "admin", !u.roles.includes("admin"))}>
                      <Shield className="mr-1 h-3 w-3" /> {u.roles.includes("admin") ? "Revoke Admin" : "Make Admin"}
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>User Details</DialogTitle></DialogHeader>
          {viewUser && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 overflow-hidden rounded-full bg-muted">
                  {viewUser.avatar_url ? (
                    <img src={viewUser.avatar_url} alt={viewUser.full_name ?? "User"} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-sm font-bold text-primary">
                      {(viewUser.full_name ?? "U").slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-semibold">{viewUser.full_name ?? "User"}</div>
                  <div className="text-muted-foreground">{viewUser.city ?? "—"}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-muted p-2"><div className="text-xs text-muted-foreground">Phone</div><div className="font-medium">{viewUser.phone ?? "—"}</div></div>
                <div className="rounded-lg bg-muted p-2"><div className="text-xs text-muted-foreground">Joined</div><div className="font-medium">{timeAgo(viewUser.created_at)}</div></div>
                <div className="rounded-lg bg-muted p-2"><div className="text-xs text-muted-foreground">Verified</div><div className="font-medium">{viewUser.is_verified ? "Yes" : "No"}</div></div>
                <div className="rounded-lg bg-muted p-2"><div className="text-xs text-muted-foreground">Blocked</div><div className="font-medium">{viewUser.is_blocked ? "Yes" : "No"}</div></div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 rounded-lg border bg-card p-3 text-center">
                  <ShoppingBag className="mx-auto h-4 w-4 text-primary" />
                  <div className="mt-1 text-xs text-muted-foreground">Listings</div>
                </div>
                <div className="flex-1 rounded-lg border bg-card p-3 text-center">
                  <MessageCircle className="mx-auto h-4 w-4 text-primary" />
                  <div className="mt-1 text-xs text-muted-foreground">Chats</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
