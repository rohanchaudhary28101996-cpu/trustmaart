import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as AppShell } from "./AppShell-Dy2WFMSs.mjs";
import { L as ListingCard } from "./ListingCard-CRlLKKtP.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { m as myWishlist, t as toggleWishlist } from "./router-a4rHr5mp.mjs";
import "../_libs/seroval.mjs";
import { H as Heart } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./input-D_U8fI25.mjs";
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
import "./avatar-FlEjym4Y.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "./format-CVlb_WBO.mjs";
import "./AppImage-DppwVylY.mjs";
import "./storage-Djyz8_2-.mjs";
import "./client-DHBFCFA_.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./badge-YM7oB01y.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./server-d-TQUncW.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-CeqtaOs5.mjs";
import "../_libs/zod.mjs";
function WishlistPage() {
  const qc = useQueryClient();
  const {
    data = [],
    isLoading
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => myWishlist()
  });
  async function unsave(id) {
    try {
      await toggleWishlist({
        data: {
          listing_id: id
        }
      });
      qc.invalidateQueries({
        queryKey: ["wishlist"]
      });
      toast.success("Removed from wishlist");
    } catch (e) {
      toast.error(e.message);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "flex items-center gap-2 text-3xl font-bold tracking-tight", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-7 w-7 text-destructive" }),
      " Wishlist"
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "Loading…" }) : data.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 rounded-2xl border bg-card p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Your wishlist is empty." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/browse", children: "Browse listings" }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4", children: data.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(ListingCard, { l, saved: true, onToggleSave: () => unsave(l.id) }, l.id)) })
  ] }) });
}
export {
  WishlistPage as component
};
