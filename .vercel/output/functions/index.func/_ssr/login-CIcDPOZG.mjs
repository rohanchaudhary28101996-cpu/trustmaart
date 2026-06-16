import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { L as Label } from "./label-C8WJLhmR.mjs";
import { P as PasswordInput } from "./PasswordInput-DSB2vjzT.mjs";
import { s as supabase } from "./client-DHBFCFA_.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { f as Shield, a5 as Loader } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({
        email,
        password
      });
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
      const {
        data: roles
      } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).in("role", ["admin", "super_admin", "moderator"]);
      if (!roles || roles.length === 0) {
        await supabase.auth.signOut();
        toast.error("Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }
      if (email.toLowerCase() === "rohanchaudhary@gmail.com") {
        const hasSuper = roles.some((r) => r.role === "super_admin");
        if (!hasSuper) {
          await supabase.from("user_roles").insert({
            user_id: data.user.id,
            role: "super_admin"
          });
        }
      }
      toast.success("Welcome to Admin Panel");
      navigate({
        to: "/admin/dashboard"
      });
    } catch (e2) {
      toast.error(e2.message);
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-md px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border bg-card p-8 shadow-elevated", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 flex items-center justify-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-6 w-6" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-center text-2xl font-bold tracking-tight", children: "Admin Login" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-center text-sm text-muted-foreground", children: "TrustMaart Management System" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "mt-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "admin-email", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "admin-email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "admin@trustmaart.in" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "admin-password", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordInput, { id: "admin-password", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full gradient-primary text-primary-foreground", disabled: loading, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, { className: "mr-2 h-4 w-4 animate-spin" }) : "Sign in to Admin" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "text-sm text-primary hover:underline", children: "Back to TrustMaart" }) })
  ] }) }) });
}
export {
  AdminLoginPage as component
};
