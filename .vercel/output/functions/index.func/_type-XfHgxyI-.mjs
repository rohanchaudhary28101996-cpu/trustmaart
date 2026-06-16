import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { b as useQueryClient, u as useQuery } from "./_libs/tanstack__react-query.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { A as AdminShell } from "./_ssr/AdminShell-BehEEcw_.mjs";
import { c as cn, B as Button } from "./_ssr/button-DjOZMqFS.mjs";
import { I as Input } from "./_ssr/input-D_U8fI25.mjs";
import { B as Badge } from "./_ssr/badge-YM7oB01y.mjs";
import { C as Card } from "./_ssr/card-BtiUI6Md.mjs";
import { D as Dialog, d as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogFooter, f as DialogDescription } from "./_ssr/dialog-D9SBQmWA.mjs";
import { T as Textarea } from "./_ssr/textarea-F69quoCd.mjs";
import { L as Label } from "./_ssr/label-C8WJLhmR.mjs";
import { f as adminListListings, h as adminUpdateListing, g as adminModerateListing } from "./_ssr/admin.functions-ByUlPAk_.mjs";
import { t as timeAgo, f as formatINR } from "./_ssr/format-CVlb_WBO.mjs";
import { o as Route$1 } from "./_ssr/router-a4rHr5mp.mjs";
import "./_libs/seroval.mjs";
import { S as Search, t as User, d as Mail, e as MapPin, h as Calendar, E as Eye, a6 as CreditCard, u as CircleCheck, v as Circle, Y as TriangleAlert, a0 as CirclePause, a7 as Star, T as Trash2 } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/react-remove-scroll.mjs";
import "tslib";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/radix-ui__react-label.mjs";
import "./_ssr/server-d-TQUncW.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
import "./_ssr/auth-middleware-CeqtaOs5.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/zod.mjs";
import "./_ssr/client-DHBFCFA_.mjs";
function ListingsPage() {
  const {
    type
  } = Route$1.useParams();
  const qc = useQueryClient();
  const [q, setQ] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const {
    data: listings = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-listings", type, statusFilter, q],
    queryFn: () => adminListListings({
      data: {
        type,
        moderation_status: statusFilter === "all" ? void 0 : statusFilter,
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
        queryKey: ["admin-listings"]
      });
      qc.invalidateQueries({
        queryKey: ["admin-overview"]
      });
      toast.success(`Listing ${action}d`);
    } catch (e) {
      toast.error(e.message);
    }
  }
  const title = type === "product" ? "Product Listings" : "Service Listings";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
      "Manage all ",
      type,
      " listings on the platform."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: `Search ${type}…`, className: "pl-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "h-9 rounded-md border bg-background px-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending", children: "Pending" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "live", children: "Live" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "rejected", children: "Rejected" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "changes_required", children: "Changes Required" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "suspended", children: "Suspended" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "expired", children: "Expired" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "h-9 px-3", children: [
        listings.length,
        " results"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-3", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }) : listings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 text-center text-sm text-muted-foreground", children: "No listings found." }) : listings.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(ListingCard, { l, onAction: moderate }, l.id)) })
  ] }) });
}
function ListingCard({
  l,
  onAction
}) {
  const [reason, setReason] = reactExports.useState("");
  const [openDialog, setOpenDialog] = reactExports.useState(null);
  const [editForm, setEditForm] = reactExports.useState({
    title: l.title,
    description: l.description ?? "",
    price: l.price ?? 0
  });
  const statusColor = {
    pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    live: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    rejected: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
    changes_required: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
    suspended: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
    expired: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300"
  };
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
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("mt-1 capitalize", statusColor[l.moderation_status]), variant: "secondary", children: l.moderation_status.replace("_", " ") }),
          l.is_featured && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "mt-1 ml-1 bg-warning text-warning-foreground", children: "Featured" })
        ] })
      ] }),
      l.rejection_reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground", children: [
        "Note: ",
        l.rejection_reason
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: openDialog === "view", onOpenChange: (o) => setOpenDialog(o ? "view" : null), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "mr-1 h-3 w-3" }),
            " View"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: l.title }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
              l.cover_image && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: l.cover_image, alt: l.title, className: "max-h-48 rounded-lg object-cover" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Price:" }),
                " ",
                l.price !== null ? formatINR(l.price) : "Contact"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Type:" }),
                " ",
                l.type
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "City:" }),
                " ",
                l.city ?? "—"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Condition:" }),
                " ",
                l.condition ?? "—"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Seller:" }),
                " ",
                l.seller_name,
                " (",
                l.seller_email,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Status:" }),
                " ",
                l.moderation_status
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Description:" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap text-muted-foreground", children: l.description ?? "No description" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/listing/$id", params: {
              id: l.id
            }, target: "_blank", children: "Open public page" }) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: openDialog === "edit", onOpenChange: (o) => setOpenDialog(o ? "edit" : null), children: [
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
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setOpenDialog(null), children: "Cancel" }),
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
                  setOpenDialog(null);
                } catch (e) {
                  toast.error(e.message);
                }
              }, children: "Save" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "bg-emerald-600 text-white hover:bg-emerald-700", onClick: () => onAction(l.id, "approve"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mr-1 h-3 w-3" }),
          " Approve"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ReasonDialog, { open: openDialog === "reject", setOpen: (o) => setOpenDialog(o ? "reject" : null), title: "Reject Listing", desc: "Tell the seller why.", label: "Reject", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "mr-1 h-3 w-3" }), variant: "destructive", reason, setReason, onSubmit: () => {
          onAction(l.id, "reject", reason);
          setReason("");
          setOpenDialog(null);
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ReasonDialog, { open: openDialog === "request_changes", setOpen: (o) => setOpenDialog(o ? "request_changes" : null), title: "Request Changes", desc: "List what needs fixing.", label: "Request Changes", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mr-1 h-3 w-3" }), variant: "outline", reason, setReason, onSubmit: () => {
          onAction(l.id, "request_changes", reason);
          setReason("");
          setOpenDialog(null);
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ReasonDialog, { open: openDialog === "suspend", setOpen: (o) => setOpenDialog(o ? "suspend" : null), title: "Suspend Listing", desc: "Reason for suspension.", label: "Suspend", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePause, { className: "mr-1 h-3 w-3" }), variant: "outline", reason, setReason, onSubmit: () => {
          onAction(l.id, "suspend", reason);
          setReason("");
          setOpenDialog(null);
        } }),
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
function ReasonDialog({
  open,
  setOpen,
  title,
  desc,
  label,
  icon,
  variant,
  reason,
  setReason,
  onSubmit
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant, children: [
      icon,
      label
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: desc })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: reason, onChange: (e) => setReason(e.target.value), placeholder: "Enter reason…", rows: 4 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onSubmit, disabled: !reason.trim(), children: label })
      ] })
    ] })
  ] });
}
export {
  ListingsPage as component
};
