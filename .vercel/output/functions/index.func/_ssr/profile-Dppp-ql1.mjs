import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { b as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as AppShell } from "./AppShell-Dy2WFMSs.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { L as Label } from "./label-C8WJLhmR.mjs";
import { T as Textarea } from "./textarea-F69quoCd.mjs";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-FlEjym4Y.mjs";
import { s as supabase } from "./client-DHBFCFA_.mjs";
import { s as signedUrl } from "./storage-Djyz8_2-.mjs";
import { f as createSsrRpc } from "./router-a4rHr5mp.mjs";
import { c as createServerFn } from "./server-d-TQUncW.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CeqtaOs5.mjs";
import "../_libs/seroval.mjs";
import { L as LoaderCircle, ac as Upload, ad as Save } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType, b as booleanType, e as enumType } from "../_libs/zod.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const getMyProfile = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("5dbf46616266e7bfe81c82694a91090a42de6200b3efc1b9d156faf41ac3a479"));
const updateMyProfile = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  full_name: stringType().min(1).max(80),
  phone: stringType().max(20).optional(),
  city: stringType().max(80).optional(),
  state: stringType().max(80).optional(),
  bio: stringType().max(400).optional(),
  avatar_url: stringType().max(400).optional()
}).parse(data)).handler(createSsrRpc("af00eb763dce352dc2f42ef901ef426a138feb40fdc7f79166552837a77fae5f"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("a5759035b101d382aecd7edab30b6923d8efce2a66b01c5541ca221660bac89b"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  q: stringType().max(120).optional()
}).default({}).parse(data ?? {})).handler(createSsrRpc("e213d2c3fc44b9dd1ee0e758fb61c7ee6972f5add1ba86759f0ac0a1a5902720"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  user_id: stringType().uuid(),
  flag: enumType(["is_verified", "is_blocked"]),
  value: booleanType()
}).parse(data)).handler(createSsrRpc("bf696d0d6a8b78b4d00fa326e19a24cadc7bb83d4264fee1bfec5ed68ab73f18"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  user_id: stringType().uuid(),
  role: enumType(["admin", "moderator", "user"]),
  grant: booleanType()
}).parse(data)).handler(createSsrRpc("edc740512f3f0332a24d6ba64f1bb38d4568c827b2911998a68988dbb71293d6"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  moderation_status: enumType(["pending", "live", "rejected", "changes_required", "suspended", "expired"]).optional(),
  q: stringType().max(120).optional()
}).default({}).parse(data ?? {})).handler(createSsrRpc("33d4a23d9f3972527b2f0240ad209dbb1d65fa2cf85b34838807e1be58181ae9"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  id: stringType().uuid(),
  action: enumType(["approve", "reject", "request_changes", "suspend", "delete", "feature"]),
  reason: stringType().max(1e3).optional(),
  featured: booleanType().optional()
}).parse(data)).handler(createSsrRpc("76fba8e5c99e5ad0dd2dc32cf3d3d54f2bf016128971123fa3b7db9bd2dff074"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  id: stringType().uuid(),
  status: enumType(["active", "removed", "sold"]).optional(),
  is_featured: booleanType().optional()
}).parse(data)).handler(createSsrRpc("773a683c90526cbe29c3930fb82fba742220873dcd213d2233ed538f5305bfc2"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("04a60b6cf2d62afe8f61f35a62d2396981927c6b60d224241bc57424b95cd588"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  id: stringType().uuid(),
  status: enumType(["reviewed", "dismissed", "actioned"])
}).parse(data)).handler(createSsrRpc("b7c6116bde526e15a1da3dc517259ef58fd7fff56ee71c47d0cd8cf603fdefdd"));
function ProfilePage() {
  const qc = useQueryClient();
  const {
    data: profile,
    isLoading
  } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => getMyProfile()
  });
  const [form, setForm] = reactExports.useState({
    full_name: "",
    phone: "",
    city: "",
    state: "",
    bio: "",
    avatar_url: ""
  });
  const [avatarPreview, setAvatarPreview] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const [uploading, setUploading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        phone: profile.phone ?? "",
        city: profile.city ?? "",
        state: profile.state ?? "",
        bio: profile.bio ?? "",
        avatar_url: profile.avatar_url ?? ""
      });
      if (profile.avatar_url) signedUrl("avatars", profile.avatar_url).then(setAvatarPreview);
    }
  }, [profile]);
  async function onAvatar(file) {
    if (!file) return;
    setUploading(true);
    try {
      const {
        data: u
      } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) throw new Error("Not signed in");
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${uid}/${Date.now()}.${ext}`;
      const {
        error
      } = await supabase.storage.from("avatars").upload(path, file, {
        upsert: true,
        contentType: file.type
      });
      if (error) throw error;
      setForm((f) => ({
        ...f,
        avatar_url: path
      }));
      setAvatarPreview(await signedUrl("avatars", path));
    } catch (e) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  }
  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMyProfile({
        data: form
      });
      toast.success("Profile updated");
      qc.invalidateQueries({
        queryKey: ["my-profile"]
      });
    } catch (e2) {
      toast.error(e2.message);
    } finally {
      setSaving(false);
    }
  }
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-sm text-muted-foreground", children: "Loading…" }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Your profile" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: save, className: "mt-6 space-y-5 rounded-2xl border bg-card p-6 shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-20 w-20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: avatarPreview }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/15 text-primary text-xl font-bold", children: (form.full_name || "U").slice(0, 1).toUpperCase() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => onAvatar(e.target.files?.[0] ?? null) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border bg-background px-3 py-2 text-sm hover:bg-secondary", children: [
            uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4" }),
            uploading ? "Uploading…" : "Change photo"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "full_name", children: "Full name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "full_name", value: form.full_name, onChange: (e) => setForm({
          ...form,
          full_name: e.target.value
        }), maxLength: 80, required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: "Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "phone", value: form.phone, onChange: (e) => setForm({
            ...form,
            phone: e.target.value
          }), maxLength: 20 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "city", children: "City" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "city", value: form.city, onChange: (e) => setForm({
            ...form,
            city: e.target.value
          }), maxLength: 80 })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "state", children: "State" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "state", value: form.state, onChange: (e) => setForm({
          ...form,
          state: e.target.value
        }), maxLength: 80 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "bio", children: "Bio" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "bio", rows: 4, value: form.bio, onChange: (e) => setForm({
          ...form,
          bio: e.target.value
        }), maxLength: 400 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: saving, className: "gradient-primary text-primary-foreground", children: [
        saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-2 h-4 w-4" }),
        "Save changes"
      ] }) })
    ] })
  ] }) });
}
export {
  ProfilePage as component
};
