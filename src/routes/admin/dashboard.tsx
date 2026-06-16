import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, ShoppingBag, Package, Clock, CircleCheck as CheckCircle2, Circle as XCircle, TriangleAlert as AlertTriangle, MessageCircle, Flag } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminOverview } from "@/lib/admin.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/dashboard")({
  ssr: false,
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => adminOverview(),
  });

  const cards = [
    { label: "Total Users", value: stats?.users ?? 0, icon: <Users className="h-5 w-5" />, tone: "text-blue-600" },
    { label: "Total Products", value: stats?.products ?? 0, icon: <Package className="h-5 w-5" />, tone: "text-emerald-600" },
    { label: "Total Sellers", value: stats?.sellers ?? 0, icon: <ShoppingBag className="h-5 w-5" />, tone: "text-sky-600" },
    { label: "Pending Verification", value: stats?.pending ?? 0, icon: <Clock className="h-5 w-5" />, tone: "text-amber-600" },
    { label: "Live Ads", value: stats?.live ?? 0, icon: <CheckCircle2 className="h-5 w-5" />, tone: "text-emerald-600" },
    { label: "Rejected Ads", value: stats?.rejected ?? 0, icon: <XCircle className="h-5 w-5" />, tone: "text-rose-600" },
    { label: "Suspended Ads", value: stats?.suspended ?? 0, icon: <AlertTriangle className="h-5 w-5" />, tone: "text-orange-600" },
    { label: "Total Chats", value: stats?.conversations ?? 0, icon: <MessageCircle className="h-5 w-5" />, tone: "text-cyan-600" },
    { label: "Open Reports", value: stats?.openReports ?? 0, icon: <Flag className="h-5 w-5" />, tone: "text-red-600" },
    { label: "Total Ads", value: stats?.ads ?? 0, icon: <Package className="h-5 w-5" />, tone: "text-slate-600" },
  ];

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Full platform overview at a glance.</p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border bg-card p-4 shadow-card">
                  <div className="h-4 w-20 rounded bg-muted" />
                  <div className="mt-2 h-8 w-16 rounded bg-muted" />
                </div>
              ))
            : cards.map((c) => (
                <StatCard key={c.label} {...c} />
              ))}
        </div>
      </div>
    </AdminShell>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-card transition hover:shadow-elevated">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        <div className={cn("grid h-9 w-9 place-items-center rounded-xl bg-primary/10", tone)}>{icon}</div>
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight">{value.toLocaleString()}</div>
    </div>
  );
}
