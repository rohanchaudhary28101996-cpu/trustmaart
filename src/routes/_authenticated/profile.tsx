import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, Upload } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { signedUrl } from "@/lib/storage";
import { getMyProfile, updateMyProfile } from "@/lib/profile.functions";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const qc = useQueryClient();
  const { data: profile, isLoading } = useQuery({ queryKey: ["my-profile"], queryFn: () => getMyProfile() });
  const [form, setForm] = useState({ full_name: "", phone: "", city: "", state: "", bio: "", avatar_url: "" });
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        phone: profile.phone ?? "",
        city: profile.city ?? "",
        state: profile.state ?? "",
        bio: profile.bio ?? "",
        avatar_url: profile.avatar_url ?? "",
      });
      if (profile.avatar_url) signedUrl("avatars", profile.avatar_url).then(setAvatarPreview);
    }
  }, [profile]);

  async function onAvatar(file: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) throw new Error("Not signed in");
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${uid}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      setForm((f) => ({ ...f, avatar_url: path }));
      setAvatarPreview(await signedUrl("avatars", path));
    } catch (e) { toast.error((e as Error).message); }
    finally { setUploading(false); }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMyProfile({ data: form });
      toast.success("Profile updated");
      qc.invalidateQueries({ queryKey: ["my-profile"] });
    } catch (e) { toast.error((e as Error).message); }
    finally { setSaving(false); }
  }

  if (isLoading) return <AppShell><div className="p-8 text-sm text-muted-foreground">Loading…</div></AppShell>;

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight">Your profile</h1>
        <form onSubmit={save} className="mt-6 space-y-5 rounded-2xl border bg-card p-6 shadow-card">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarPreview} />
              <AvatarFallback className="bg-primary/15 text-primary text-xl font-bold">
                {(form.full_name || "U").slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onAvatar(e.target.files?.[0] ?? null)} />
              <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-2 text-sm hover:bg-secondary">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? "Uploading…" : "Change photo"}
              </span>
            </label>
          </div>
          <div>
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} maxLength={80} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={20} />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} maxLength={80} />
            </div>
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} maxLength={80} />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={400} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={saving} className="gradient-primary text-primary-foreground">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
