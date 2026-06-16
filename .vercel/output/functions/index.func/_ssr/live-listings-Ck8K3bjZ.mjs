import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { b as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as AdminShell } from "./AdminShell-CeObc2vi.mjs";
import { B as Button, c as cn } from "./button-DjOZMqFS.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { B as Badge } from "./badge-YM7oB01y.mjs";
import { C as Card } from "./card-BtiUI6Md.mjs";
import { D as Dialog, d as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogFooter } from "./dialog-D9SBQmWA.mjs";
import { T as Textarea } from "./textarea-F69quoCd.mjs";
import { L as Label } from "./label-C8WJLhmR.mjs";
import { f as adminListListings, h as adminUpdateListing, g as adminModerateListing } from "./admin.functions-BHbih5rP.mjs";
import { t as timeAgo, f as formatINR } from "./format-CVlb_WBO.mjs";
import "../_libs/seroval.mjs";
import { S as Search, t as User, d as Mail, e as MapPin, h as Calendar, a6 as CreditCard, a7 as Star, a0 as CirclePause, T as Trash2 } from "../_libs/lucide-react.mjs";
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
import "./router-CyR1fJhL.mjs";
import "./client-BHmQHd0X.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./server-D1062Wfa.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-DjebvYAq.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-label.mjs";
function LiveListingsPage() {
  const qc = useQueryClient();
  const [q, setQ] = reactExports.useState("");
  const {
    data: listings = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-live", q],
    queryFn: () => adminListListings({
      data: {
        moderation_status: "live",
        q: q || void 0
      }
    })
  });
  async function moderate(id, action, reason) {
    try {
      await adminModerateListing({
        data: {
          id,
          action,
          reason
        }
      });
      qc.invalidateQueries({
        queryKey: ["admin-live"]
      });
      qc.invalidateQueries({
        queryKey: ["admin-overview"]
      });
      toast.success(`Listing ${action}d`);
    } catch (e) {
      toast.error(e.message);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Live Listings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "All currently published and visible listings." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search live listings…", className: "pl-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "h-9 px-3", children: [
        listings.length,
        " live"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-3", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }) : listings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 text-center text-sm text-muted-foreground", children: "No live listings." }) : listings.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(LiveListingCard, { l, onAction: moderate }, l.id)) })
  ] }) });
}
function LiveListingCard({
  l,
  onAction
}) {
  const [reason, setReason] = reactExports.useState("");
  const [openSuspend, setOpenSuspend] = reactExports.useState(false);
  const [openEdit, setOpenEdit] = reactExports.useState(false);
  const [editForm, setEditForm] = reactExports.useState({
    title: l.title,
    description: l.description ?? "",
    price: l.price ?? 0
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted", children: l.cover_image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: l.cover_image, alt: l.title, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-full w-full place-items-center text-xs text-muted-foreground", children: "No image" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: l.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3 w-3" }),
              " ",
              l.seller_name ?? "—"
            ] }),
            l.seller_email && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3 w-3" }),
              " ",
              l.seller_email
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
              " ",
              l.city ?? "—"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
              " ",
              timeAgo(l.created_at)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold", children: l.price !== null ? formatINR(l.price) : "Contact" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "mt-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400", variant: "secondary", children: "Live" }),
          l.is_featured && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "mt-1 ml-1 bg-warning text-warning-foreground", children: "Featured" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: openEdit, onOpenChange: setOpenEdit, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "mr-1 h-3 w-3" }),
            " Edit"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Listing" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Title" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editForm.title, onChange: (e) => setEditForm({
                  ...editForm,
                  title: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: editForm.description, onChange: (e) => setEditForm({
                  ...editForm,
                  description: e.target.value
                }), rows: 4 })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Price (₹)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: editForm.price, onChange: (e) => setEditForm({
                  ...editForm,
                  price: Number(e.target.value)
                }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setOpenEdit(false), children: "Cancel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: async () => {
                try {
                  await adminUpdateListing({
                    data: {
                      id: l.id,
                      title: editForm.title,
                      description: editForm.description,
                      price: editForm.price
                    }
                  });
                  toast.success("Listing updated");
                  setOpenEdit(false);
                } catch (e) {
                  toast.error(e.message);
                }
              }, children: "Save" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: l.is_featured ? "default" : "outline", onClick: async () => {
          try {
            await adminModerateListing({
              data: {
                id: l.id,
                action: "feature",
                featured: !l.is_featured
              }
            });
            toast.success(l.is_featured ? "Unfeatured" : "Featured");
          } catch (e) {
            toast.error(e.message);
          }
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: cn("mr-1 h-3 w-3", l.is_featured && "fill-current") }),
          " ",
          l.is_featured ? "Unfeature" : "Feature"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: openSuspend, onOpenChange: setOpenSuspend, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePause, { className: "mr-1 h-3 w-3" }),
            " Suspend"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Suspend Listing" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: reason, onChange: (e) => setReason(e.target.value), placeholder: "Reason for suspension…", rows: 4 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setOpenSuspend(false), children: "Cancel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => {
                onAction(l.id, "suspend", reason);
                setReason("");
                setOpenSuspend(false);
              }, disabled: !reason.trim(), children: "Suspend" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "text-destructive", onClick: () => {
          if (confirm("Delete permanently?")) onAction(l.id, "delete");
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-1 h-3 w-3" }),
          " Delete"
        ] })
      ] })
    ] })
  ] }) });
}
export {
  LiveListingsPage as component
};
