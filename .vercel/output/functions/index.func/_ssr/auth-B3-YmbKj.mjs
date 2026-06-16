import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useSearch, d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button, c as cn } from "./button-DjOZMqFS.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { L as Label } from "./label-C8WJLhmR.mjs";
import { R as Root2, L as List, T as Trigger, C as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { P as PasswordInput } from "./PasswordInput-DSB2vjzT.mjs";
import { s as supabase } from "./client-DHBFCFA_.mjs";
import { c as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { L as LoaderCircle, d as Mail } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const Tabs = Root2;
const TabsList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = List.displayName;
const TabsTrigger = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = Trigger.displayName;
const TabsContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = Content.displayName;
const lovableAuth = createLovableAuth();
const lovable = {
  auth: {
    signInWithOAuth: async (provider, opts) => {
      const result = await lovableAuth.signInWithOAuth(provider, {
        redirect_uri: opts?.redirect_uri,
        extraParams: {
          ...opts?.extraParams
        }
      });
      if (result.redirected) {
        return result;
      }
      if (result.error) {
        return result;
      }
      try {
        await supabase.auth.setSession(result.tokens);
      } catch (e) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
      return result;
    }
  }
};
function AuthPage() {
  const {
    redirect
  } = useSearch({
    from: "/auth"
  });
  const navigate = useNavigate();
  const [tab, setTab] = reactExports.useState("signin");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const goNext = () => navigate({
    to: redirect && redirect.startsWith("/") ? redirect : "/"
  });
  async function onSignIn(e) {
    e.preventDefault();
    setLoading(true);
    const {
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    goNext();
  }
  async function onSignUp(e) {
    e.preventDefault();
    setLoading(true);
    const {
      error
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        },
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : void 0
      }
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created!");
    goNext();
  }
  async function onGoogle() {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin
      });
      if (result.error) return toast.error(result.error.message ?? "Google sign-in failed");
      if (result.redirected) return;
      goNext();
    } finally {
      setLoading(false);
    }
  }
  async function onForgot() {
    if (!email) return toast.error("Enter your email first");
    const {
      error
    } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/auth/reset-password"
    });
    if (error) return toast.error(error.message);
    toast.success("Password reset email sent");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen gradient-hero", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "mb-8 flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-xl gradient-primary text-primary-foreground font-bold shadow-card", children: "T" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xl font-extrabold", children: [
        "Trust",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Maart" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl border bg-card p-6 shadow-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: tab, onValueChange: (v) => setTab(v), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "signin", children: "Sign in" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "signup", children: "Create account" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", className: "mt-5 w-full", onClick: onGoogle, disabled: loading, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(GoogleIcon, {}),
        "Continue with Google"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-4 flex items-center gap-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" }),
        "or",
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "signin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: onSignIn, className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onForgot, className: "text-xs text-primary hover:underline", children: "Forgot?" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordInput, { id: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "mr-2 h-4 w-4" }),
          " Sign in"
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "signup", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: onSignUp, className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Full name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", required: true, value: name, onChange: (e) => setName(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email-s", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email-s", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password-s", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordInput, { id: "password-s", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Create account" })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-center text-xs text-muted-foreground", children: "By continuing, you agree to TrustMaart's Terms & Privacy." })
  ] }) });
}
function GoogleIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "mr-2 h-4 w-4", viewBox: "0 0 24 24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#FBBC05", d: "M5.84 14.1A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.35-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.66-2.84z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" })
  ] });
}
export {
  AuthPage as component
};
