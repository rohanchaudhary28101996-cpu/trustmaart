import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider, q as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { S as redirect } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-DHBFCFA_.mjs";
import { T as TSS_SERVER_FUNCTION, g as getServerFnById, c as createServerFn } from "./server-d-TQUncW.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CeqtaOs5.mjs";
import { o as objectType, s as stringType, e as enumType, c as coerce, n as numberType, a as arrayType, b as booleanType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const Ctx$2 = reactExports.createContext({
  user: null,
  session: null,
  loading: true,
  roles: [],
  isAdmin: false,
  isSuperAdmin: false,
  signOut: async () => {
  }
});
function AuthProvider({ children }) {
  const [session, setSession] = reactExports.useState(null);
  const [user, setUser] = reactExports.useState(null);
  const [roles, setRoles] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        setTimeout(() => {
          supabase.from("user_roles").select("role").eq("user_id", sess.user.id).then(({ data }) => setRoles((data ?? []).map((r) => r.role)));
        }, 0);
      } else {
        setRoles([]);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
      if (data.session?.user) {
        supabase.from("user_roles").select("role").eq("user_id", data.session.user.id).then(({ data: r }) => setRoles((r ?? []).map((x) => x.role)));
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  const signOut = async () => {
    await supabase.auth.signOut();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Ctx$2.Provider,
    {
      value: {
        user,
        session,
        loading,
        roles,
        isAdmin: roles.includes("admin") || roles.includes("super_admin") || roles.includes("moderator"),
        isSuperAdmin: roles.includes("super_admin"),
        signOut
      },
      children
    }
  );
}
function useAuth() {
  return reactExports.useContext(Ctx$2);
}
const Ctx$1 = reactExports.createContext({ theme: "light", toggle: () => {
} });
function ThemeProvider({ children }) {
  const [theme, setTheme] = reactExports.useState("light");
  reactExports.useEffect(() => {
    const stored = typeof window !== "undefined" && localStorage.getItem("theme") || null;
    const prefers = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initial = stored || prefers;
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);
  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      if (typeof window !== "undefined") localStorage.setItem("theme", next);
      return next;
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Ctx$1.Provider, { value: { theme, toggle }, children });
}
function useTheme() {
  return reactExports.useContext(Ctx$1);
}
const dict = {
  en: {
    "nav.browse": "Browse",
    "nav.services": "Services",
    "nav.sell": "Sell",
    "nav.chat": "Chat",
    "nav.dashboard": "Dashboard",
    "nav.login": "Sign in",
    "nav.signup": "Sign up",
    "nav.profile": "Profile",
    "nav.wishlist": "Wishlist",
    "nav.logout": "Sign out",
    "nav.admin": "Admin",
    "hero.title": "Buy & sell second-hand products — the trusted way",
    "hero.subtitle": "TrustMaart is India's modern marketplace for second-hand products. Find great deals or list yours in seconds, powered by AI.",
    "hero.search": 'Try: "used iPhone under 25000 in Delhi"',
    "hero.ai_search": "Ask AI",
    "hero.post_ad": "Post your ad",
    "section.categories": "Browse by category",
    "section.featured": "Featured listings",
    "section.recent": "Recently added",
    "section.services": "Popular services",
    "section.ai": "AI that does the work for you",
    "section.how": "How TrustMaart works",
    "section.trust": "Built on trust",
    "label.negotiable": "Negotiable",
    "label.fixed_price": "Fixed",
    "label.chat_seller": "Chat with seller",
    "label.save": "Save",
    "label.saved": "Saved",
    "label.report": "Report",
    "label.share": "Share",
    "label.similar": "Similar listings",
    "label.view_all": "View all"
  },
  hi: {
    "nav.browse": "ब्राउज़",
    "nav.services": "सेवाएँ",
    "nav.sell": "बेचें",
    "nav.chat": "चैट",
    "nav.dashboard": "डैशबोर्ड",
    "nav.login": "साइन इन",
    "nav.signup": "साइन अप",
    "nav.profile": "प्रोफ़ाइल",
    "nav.wishlist": "विशलिस्ट",
    "nav.logout": "साइन आउट",
    "nav.admin": "एडमिन",
    "hero.title": "ख़रीदें, बेचें और किराये पर लें — भरोसे के साथ",
    "hero.subtitle": "ट्रस्टमार्ट भारत का आधुनिक मार्केटप्लेस है — सेकंड-हैंड प्रोडक्ट और लोकल सर्विस के लिए, AI के साथ।",
    "hero.search": 'कोशिश करें: "दिल्ली में 25000 से कम में iPhone"',
    "hero.ai_search": "AI से पूछें",
    "hero.post_ad": "विज्ञापन डालें",
    "section.categories": "श्रेणी से ब्राउज़ करें",
    "section.featured": "फीचर्ड लिस्टिंग",
    "section.recent": "हाल ही में जोड़ी गई",
    "section.services": "लोकप्रिय सेवाएँ",
    "section.ai": "AI जो आपका काम आसान करे",
    "section.how": "ट्रस्टमार्ट कैसे काम करता है",
    "section.trust": "विश्वास पर बना",
    "label.negotiable": "मोलभाव",
    "label.fixed_price": "फिक्स्ड",
    "label.chat_seller": "विक्रेता से चैट",
    "label.save": "सेव",
    "label.saved": "सेव किया",
    "label.report": "रिपोर्ट",
    "label.share": "शेयर",
    "label.similar": "मिलती-जुलती लिस्टिंग",
    "label.view_all": "सभी देखें"
  }
};
const Ctx = reactExports.createContext({
  lang: "en",
  setLang: () => {
  },
  t: (k) => k
});
function I18nProvider({ children }) {
  const [lang, setLangState] = reactExports.useState("en");
  reactExports.useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("lang") || null;
    if (saved === "en" || saved === "hi") setLangState(saved);
  }, []);
  const setLang = (l) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };
  const t = (k) => dict[lang][k] ?? dict.en[k] ?? k;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Ctx.Provider, { value: { lang, setLang, t }, children });
}
function useI18n() {
  return reactExports.useContext(Ctx);
}
const appCss = "/assets/styles-CnYrQD3D.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "We hit an unexpected error. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$u = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TrustMaart — India's modern marketplace" },
      { name: "description", content: "Buy, sell and hire on TrustMaart. Second-hand products, local services, AI-powered listings, and real-time chat." },
      { property: "og:title", content: "TrustMaart — India's modern marketplace" },
      { property: "og:description", content: "Buy, sell and hire on TrustMaart. Second-hand products, local services, AI-powered listings, and real-time chat." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "TrustMaart — India's modern marketplace" },
      { name: "twitter:description", content: "Buy, sell and hire on TrustMaart. Second-hand products, local services, AI-powered listings, and real-time chat." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a1715122-4689-4e90-8cd5-1b9b1b9ac6df/id-preview-17de9049--35be48d9-dc7e-4808-b661-f0e978c921de.lovable.app-1781261734477.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a1715122-4689-4e90-8cd5-1b9b1b9ac6df/id-preview-17de9049--35be48d9-dc7e-4808-b661-f0e978c921de.lovable.app-1781261734477.png" }
    ],
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$u.useRouteContext();
  const router2 = useRouter();
  reactExports.useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        router2.invalidate();
        if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [router2, queryClient]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(I18nProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "top-right", richColors: true })
  ] }) }) }) });
}
const $$splitErrorComponentImporter$1 = () => import("./search-wPu6SgfS.mjs");
const $$splitComponentImporter$t = () => import("./search-Cvu746mG.mjs");
const search$2 = objectType({
  q: stringType().optional()
});
const Route$t = createFileRoute("/search")({
  validateSearch: search$2,
  component: lazyRouteComponent($$splitComponentImporter$t, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent")
});
const $$splitComponentImporter$s = () => import("./help-DWJxNipA.mjs");
const Route$s = createFileRoute("/help")({
  head: () => ({
    meta: [{
      title: "Help & Support — TrustMaart"
    }, {
      name: "description",
      content: "Get answers about buying, selling, safety and AI features on TrustMaart."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const $$splitComponentImporter$r = () => import("./contact-DM2XUyDm.mjs");
const Route$r = createFileRoute("/contact")({
  head: () => ({
    meta: [{
      title: "Contact TrustMaart"
    }, {
      name: "description",
      content: "Get in touch with TrustMaart — our support team replies within a few hours."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const FiltersSchema = objectType({
  type: enumType(["product", "service"]).optional(),
  q: stringType().max(200).optional(),
  category: stringType().max(100).optional(),
  city: stringType().max(120).optional(),
  minPrice: numberType().min(0).max(99999999).optional(),
  maxPrice: numberType().min(0).max(99999999).optional(),
  condition: enumType(["new", "like_new", "good", "fair", "used"]).optional(),
  brand: stringType().max(80).optional(),
  sort: enumType(["newest", "price_asc", "price_desc"]).default("newest").optional(),
  limit: numberType().min(1).max(60).default(24).optional(),
  offset: numberType().min(0).max(1e4).default(0).optional()
}).default({});
const listListings = createServerFn({
  method: "POST"
}).inputValidator((data) => FiltersSchema.parse(data ?? {})).handler(createSsrRpc("393d89a201a164777207ef82e19865ca3f8316688118ad59b082ec3b97df7e37"));
const getListing = createServerFn({
  method: "POST"
}).inputValidator((data) => objectType({
  id: stringType().uuid()
}).parse(data)).handler(createSsrRpc("3534642b2e7440be71e815e5e597a1650d0dfc52d9ceb96bbaad3e6a46f731ec"));
const getCategories = createServerFn({
  method: "GET"
}).handler(createSsrRpc("87771d619d7854c69bd188721738141e8ea717eebbdd58b7d4ae4a00d9bcef56"));
const getHomeData = createServerFn({
  method: "GET"
}).handler(createSsrRpc("74f792f9b217353d0be406db090078b1cc389635f934a9183d962781bf453677"));
const CreateListingSchema = objectType({
  type: enumType(["product", "service"]),
  title: stringType().min(3).max(120),
  description: stringType().max(4e3).optional(),
  price: numberType().min(0).max(99999999).nullable().optional(),
  is_negotiable: booleanType().default(true),
  condition: enumType(["new", "like_new", "good", "fair", "used"]).nullable().optional(),
  brand: stringType().max(80).optional(),
  category_id: stringType().uuid().nullable().optional(),
  city: stringType().max(120).optional(),
  state: stringType().max(120).optional(),
  tags: arrayType(stringType().max(40)).max(20).optional(),
  images: arrayType(stringType().min(1).max(500)).max(10).default([]),
  service_experience: numberType().min(0).max(80).nullable().optional(),
  service_availability: stringType().max(200).optional(),
  service_areas: arrayType(stringType().max(80)).max(20).optional()
});
const createListing = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => CreateListingSchema.parse(data)).handler(createSsrRpc("e6bd60a3d681f193640aea255c53be02cf065005566c7fb0afcf870257d8e520"));
const deleteListing = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  id: stringType().uuid()
}).parse(data)).handler(createSsrRpc("355748bb4fe1e0a54a381e93ab4522e771d97f4bef08293a6bcb103a57b5d2f2"));
const updateListingStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  id: stringType().uuid(),
  status: enumType(["active", "sold", "removed", "draft"])
}).parse(data)).handler(createSsrRpc("ca9246f7ca9b35eb9816f7008419b40ddfa90dafa388844852066c7e98ed2d0b"));
const myListings = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("70be780304ba6b12fb42601c2c1bccd033eea5e9b82e04ac3c2198e8acabe916"));
const toggleWishlist = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  listing_id: stringType().uuid()
}).parse(data)).handler(createSsrRpc("09384ce19f4064db87feba772538a61ed2c3e8a5de8ea87f5a77858fa3774673"));
const myWishlist = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("198c7e18751773f0185f326677f867c3fd23b8cacd40eb5163da49c551ad4387"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  target_type: enumType(["listing", "user", "message"]),
  target_id: stringType().uuid(),
  reason: stringType().min(3).max(500)
}).parse(data)).handler(createSsrRpc("b4d8a9c5a2dd7343c80d58e6f438947b6c1341cb00f57a2e1cbefdbde5395404"));
const catsQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: () => getCategories()
});
const $$splitComponentImporter$q = () => import("./browse-DXiskTz-.mjs");
const search$1 = objectType({
  q: stringType().optional(),
  category: stringType().optional(),
  city: stringType().optional(),
  minPrice: coerce.number().optional(),
  maxPrice: coerce.number().optional(),
  condition: enumType(["new", "like_new", "good", "fair", "used"]).optional(),
  sort: enumType(["newest", "price_asc", "price_desc"]).optional()
});
const Route$q = createFileRoute("/browse")({
  validateSearch: search$1,
  head: () => ({
    meta: [{
      title: "Browse products on TrustMaart"
    }, {
      name: "description",
      content: "Discover second-hand products from trusted sellers across India."
    }]
  }),
  loader: ({
    context
  }) => context.queryClient.ensureQueryData(catsQuery),
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("./auth-B3-YmbKj.mjs");
const search = objectType({
  redirect: stringType().optional()
});
const Route$p = createFileRoute("/auth")({
  validateSearch: search,
  head: () => ({
    meta: [{
      title: "Sign in to TrustMaart"
    }, {
      name: "description",
      content: "Sign in or create your TrustMaart account to buy, sell and chat."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("./about-qeBlI0lD.mjs");
const Route$o = createFileRoute("/about")({
  head: () => ({
    meta: [{
      title: "About TrustMaart — India's modern marketplace"
    }, {
      name: "description",
      content: "TrustMaart is India's AI-powered marketplace for second-hand products and local services. Built for trust, speed and simplicity."
    }, {
      property: "og:title",
      content: "About TrustMaart"
    }, {
      property: "og:description",
      content: "AI-powered second-hand marketplace and local services for India."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./route-DYHf9tMu.mjs");
const Route$n = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async ({
    location
  }) => {
    if (location.pathname === "/admin/login") return;
    const {
      data,
      error
    } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({
        to: "/admin/login"
      });
    }
    const {
      data: roles
    } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).in("role", ["admin", "super_admin"]);
    if (!roles || roles.length === 0) {
      throw redirect({
        to: "/"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./route-BFsOu0JM.mjs");
const Route$m = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const {
      data,
      error
    } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({
      to: "/auth"
    });
    return {
      user: data.user
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const homeQuery = queryOptions({
  queryKey: ["home"],
  queryFn: () => getHomeData(),
  staleTime: 3e4
});
const $$splitComponentImporter$l = () => import("./index-J9iKV6Ff.mjs");
const Route$l = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "TrustMaart — Buy & sell second-hand products across India"
    }, {
      name: "description",
      content: "India's modern marketplace for second-hand products. AI-powered listings, real-time chat, trusted sellers."
    }, {
      property: "og:title",
      content: "TrustMaart — Buy & sell second-hand products across India"
    }, {
      property: "og:description",
      content: "AI-powered second-hand marketplace for India. Find deals on mobiles, electronics, furniture and more."
    }]
  }),
  loader: ({
    context
  }) => context.queryClient.ensureQueryData(homeQuery),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const listingQuery = (id) => queryOptions({
  queryKey: ["listing", id],
  queryFn: () => getListing({
    data: {
      id
    }
  })
});
const $$splitComponentImporter$k = () => import("./listing._id-CfkpC2hI.mjs");
const $$splitNotFoundComponentImporter = () => import("./listing._id-1Xl_Uxlq.mjs");
const $$splitErrorComponentImporter = () => import("./listing._id-Byu5KAX2.mjs");
const Route$k = createFileRoute("/listing/$id")({
  loader: ({
    context,
    params
  }) => context.queryClient.ensureQueryData(listingQuery(params.id)),
  head: () => ({
    meta: [{
      title: "TrustMaart — Listing"
    }, {
      name: "description",
      content: "View product details on TrustMaart."
    }]
  }),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./auth.reset-password-DE26u7JD.mjs");
const Route$j = createFileRoute("/auth/reset-password")({
  head: () => ({
    meta: [{
      title: "Reset password — TrustMaart"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./users-DhR3olzr.mjs");
const Route$i = createFileRoute("/admin/users")({
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./settings-C0JGXAvC.mjs");
const Route$h = createFileRoute("/admin/settings")({
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./reported-listings-BYufErY1.mjs");
const Route$g = createFileRoute("/admin/reported-listings")({
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./rejected-listings-B00euyEW.mjs");
const Route$f = createFileRoute("/admin/rejected-listings")({
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./pending-ads-DVUtc9Dt.mjs");
const Route$e = createFileRoute("/admin/pending-ads")({
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./notifications-CPrSbCrD.mjs");
const Route$d = createFileRoute("/admin/notifications")({
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./login-CIcDPOZG.mjs");
const Route$c = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [{
      title: "Admin Login — TrustMaart"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./live-listings-BHBcHN8L.mjs");
const Route$b = createFileRoute("/admin/live-listings")({
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./dashboard-CZay-eFH.mjs");
const Route$a = createFileRoute("/admin/dashboard")({
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./chat-monitoring-Dd26cJTj.mjs");
const Route$9 = createFileRoute("/admin/chat-monitoring")({
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./action-logs-qb9YoLQa.mjs");
const Route$8 = createFileRoute("/admin/action-logs")({
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./wishlist-BiMH0JF6.mjs");
const Route$7 = createFileRoute("/_authenticated/wishlist")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./sell-DFfp-sEX.mjs");
const Route$6 = createFileRoute("/_authenticated/sell")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./profile-Dppp-ql1.mjs");
const Route$5 = createFileRoute("/_authenticated/profile")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./notifications-D5CTF4nT.mjs");
const Route$4 = createFileRoute("/_authenticated/notifications")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./dashboard-34VW1-rV.mjs");
const Route$3 = createFileRoute("/_authenticated/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./chat-Cwyo0ECV.mjs");
const Route$2 = createFileRoute("/_authenticated/chat")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("../_type-XfHgxyI-.mjs");
const Route$1 = createFileRoute("/admin/listings/$type")({
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./chat._id-BsOtgbaQ.mjs");
const Route = createFileRoute("/_authenticated/chat/$id")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SearchRoute = Route$t.update({
  id: "/search",
  path: "/search",
  getParentRoute: () => Route$u
});
const HelpRoute = Route$s.update({
  id: "/help",
  path: "/help",
  getParentRoute: () => Route$u
});
const ContactRoute = Route$r.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$u
});
const BrowseRoute = Route$q.update({
  id: "/browse",
  path: "/browse",
  getParentRoute: () => Route$u
});
const AuthRoute = Route$p.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$u
});
const AboutRoute = Route$o.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$u
});
const AdminRouteRoute = Route$n.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$u
});
const AuthenticatedRouteRoute = Route$m.update({
  id: "/_authenticated",
  getParentRoute: () => Route$u
});
const IndexRoute = Route$l.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$u
});
const ListingIdRoute = Route$k.update({
  id: "/listing/$id",
  path: "/listing/$id",
  getParentRoute: () => Route$u
});
const AuthResetPasswordRoute = Route$j.update({
  id: "/reset-password",
  path: "/reset-password",
  getParentRoute: () => AuthRoute
});
const AdminUsersRoute = Route$i.update({
  id: "/users",
  path: "/users",
  getParentRoute: () => AdminRouteRoute
});
const AdminSettingsRoute = Route$h.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AdminRouteRoute
});
const AdminReportedListingsRoute = Route$g.update({
  id: "/reported-listings",
  path: "/reported-listings",
  getParentRoute: () => AdminRouteRoute
});
const AdminRejectedListingsRoute = Route$f.update({
  id: "/rejected-listings",
  path: "/rejected-listings",
  getParentRoute: () => AdminRouteRoute
});
const AdminPendingAdsRoute = Route$e.update({
  id: "/pending-ads",
  path: "/pending-ads",
  getParentRoute: () => AdminRouteRoute
});
const AdminNotificationsRoute = Route$d.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => AdminRouteRoute
});
const AdminLoginRoute = Route$c.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => AdminRouteRoute
});
const AdminLiveListingsRoute = Route$b.update({
  id: "/live-listings",
  path: "/live-listings",
  getParentRoute: () => AdminRouteRoute
});
const AdminDashboardRoute = Route$a.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AdminRouteRoute
});
const AdminChatMonitoringRoute = Route$9.update({
  id: "/chat-monitoring",
  path: "/chat-monitoring",
  getParentRoute: () => AdminRouteRoute
});
const AdminActionLogsRoute = Route$8.update({
  id: "/action-logs",
  path: "/action-logs",
  getParentRoute: () => AdminRouteRoute
});
const AuthenticatedWishlistRoute = Route$7.update({
  id: "/wishlist",
  path: "/wishlist",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedSellRoute = Route$6.update({
  id: "/sell",
  path: "/sell",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedProfileRoute = Route$5.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedNotificationsRoute = Route$4.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedDashboardRoute = Route$3.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedChatRoute = Route$2.update({
  id: "/chat",
  path: "/chat",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AdminListingsTypeRoute = Route$1.update({
  id: "/listings/$type",
  path: "/listings/$type",
  getParentRoute: () => AdminRouteRoute
});
const AuthenticatedChatIdRoute = Route.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => AuthenticatedChatRoute
});
const AuthenticatedChatRouteChildren = {
  AuthenticatedChatIdRoute
};
const AuthenticatedChatRouteWithChildren = AuthenticatedChatRoute._addFileChildren(AuthenticatedChatRouteChildren);
const AuthenticatedRouteRouteChildren = {
  AuthenticatedChatRoute: AuthenticatedChatRouteWithChildren,
  AuthenticatedDashboardRoute,
  AuthenticatedNotificationsRoute,
  AuthenticatedProfileRoute,
  AuthenticatedSellRoute,
  AuthenticatedWishlistRoute
};
const AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
const AdminRouteRouteChildren = {
  AdminActionLogsRoute,
  AdminChatMonitoringRoute,
  AdminDashboardRoute,
  AdminLiveListingsRoute,
  AdminLoginRoute,
  AdminNotificationsRoute,
  AdminPendingAdsRoute,
  AdminRejectedListingsRoute,
  AdminReportedListingsRoute,
  AdminSettingsRoute,
  AdminUsersRoute,
  AdminListingsTypeRoute
};
const AdminRouteRouteWithChildren = AdminRouteRoute._addFileChildren(
  AdminRouteRouteChildren
);
const AuthRouteChildren = {
  AuthResetPasswordRoute
};
const AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  AdminRouteRoute: AdminRouteRouteWithChildren,
  AboutRoute,
  AuthRoute: AuthRouteWithChildren,
  BrowseRoute,
  ContactRoute,
  HelpRoute,
  SearchRoute,
  ListingIdRoute
};
const routeTree = Route$u._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$t as R,
  useI18n as a,
  Route$k as b,
  catsQuery as c,
  listingQuery as d,
  useTheme as e,
  createSsrRpc as f,
  getCategories as g,
  homeQuery as h,
  createListing as i,
  myListings as j,
  updateListingStatus as k,
  listListings as l,
  myWishlist as m,
  deleteListing as n,
  Route$1 as o,
  Route as p,
  router as r,
  toggleWishlist as t,
  useAuth as u
};
