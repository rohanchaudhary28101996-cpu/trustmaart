import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { L as Label } from "./label-C8WJLhmR.mjs";
import { s as supabase } from "./client-DHBFCFA_.mjs";
import { t as toast } from "../_libs/sonner.mjs";
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
function ResetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const {
      error
    } = await supabase.auth.updateUser({
      password
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    navigate({
      to: "/"
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen gradient-hero", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex min-h-screen max-w-md flex-col justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border bg-card p-6 shadow-elevated", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mb-1 text-xl font-bold", children: "Set a new password" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4 text-sm text-muted-foreground", children: "Enter a new password for your account." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "np", children: "New password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "np", type: "password", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: "Update password" })
    ] })
  ] }) }) });
}
export {
  ResetPage as component
};
