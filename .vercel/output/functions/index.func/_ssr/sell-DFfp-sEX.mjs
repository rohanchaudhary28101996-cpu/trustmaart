import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as AppShell } from "./AppShell-Dy2WFMSs.mjs";
import { B as Button, c as cn } from "./button-DjOZMqFS.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { L as Label } from "./label-C8WJLhmR.mjs";
import { T as Textarea } from "./textarea-F69quoCd.mjs";
import { S as Switch$1, a as SwitchThumb } from "../_libs/radix-ui__react-switch.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CUSP6kj8.mjs";
import { A as AppImage } from "./AppImage-DppwVylY.mjs";
import { s as supabase } from "./client-DHBFCFA_.mjs";
import { g as getCategories, i as createListing } from "./router-a4rHr5mp.mjs";
import { g as generateListing } from "./ai.functions-BarVfyC3.mjs";
import "../_libs/seroval.mjs";
import { a as Sparkles, X, aa as Camera, L as LoaderCircle, ab as ImagePlus, ac as Upload } from "../_libs/lucide-react.mjs";
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
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./storage-Djyz8_2-.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./server-d-TQUncW.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-CeqtaOs5.mjs";
import "../_libs/zod.mjs";
const Switch = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Switch$1,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      SwitchThumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = Switch$1.displayName;
const MAX_IMAGES = 10;
const MAX_AI_PHOTOS = 4;
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
function SellPage() {
  const navigate = useNavigate();
  const {
    data: cats = []
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories()
  });
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [price, setPrice] = reactExports.useState("");
  const [negotiable, setNegotiable] = reactExports.useState(true);
  const [condition, setCondition] = reactExports.useState("good");
  const [brand, setBrand] = reactExports.useState("");
  const [categoryId, setCategoryId] = reactExports.useState("");
  const [city, setCity] = reactExports.useState("");
  const [state, setState] = reactExports.useState("");
  const [images, setImages] = reactExports.useState([]);
  const [uploading, setUploading] = reactExports.useState(false);
  const [aiNotes, setAiNotes] = reactExports.useState("");
  const [aiPhotos, setAiPhotos] = reactExports.useState([]);
  const [aiLoading, setAiLoading] = reactExports.useState(false);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const filteredCats = cats.filter((c) => c.type === "product");
  async function onAiPhotos(files) {
    if (!files || !files.length) return;
    const remaining = MAX_AI_PHOTOS - aiPhotos.length;
    if (remaining <= 0) {
      toast.error(`Up to ${MAX_AI_PHOTOS} reference photos for AI`);
      return;
    }
    const arr = Array.from(files).slice(0, remaining);
    const added = [];
    for (const f of arr) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
        toast.error(`${f.name} is not a supported image`);
        continue;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name} is larger than 5MB`);
        continue;
      }
      try {
        const dataUrl = await fileToDataUrl(f);
        added.push({
          dataUrl,
          file: f
        });
      } catch (e) {
        toast.error(e.message);
      }
    }
    setAiPhotos((prev) => [...prev, ...added]);
  }
  function removeAiPhoto(idx) {
    setAiPhotos((prev) => prev.filter((_, i) => i !== idx));
  }
  async function uploadAiPhotosToListing() {
    if (aiPhotos.length === 0) return;
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;
    const {
      data: u
    } = await supabase.auth.getUser();
    const uid = u.user?.id;
    if (!uid) return;
    const uploaded = [];
    for (const {
      file: f
    } of aiPhotos.slice(0, remaining)) {
      const ext = f.name.split(".").pop() || "jpg";
      const path = `${uid}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const {
        error
      } = await supabase.storage.from("listing-images").upload(path, f, {
        upsert: false,
        contentType: f.type
      });
      if (!error) uploaded.push(path);
    }
    if (uploaded.length) setImages((prev) => [...prev, ...uploaded]);
  }
  async function onUpload(files) {
    if (!files || !files.length) return;
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }
    const arr = Array.from(files).slice(0, remaining);
    setUploading(true);
    try {
      const {
        data: u
      } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) throw new Error("Not signed in");
      const uploaded = [];
      for (const f of arr) {
        if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
          toast.error(`${f.name} is not a supported image`);
          continue;
        }
        if (f.size > 5 * 1024 * 1024) {
          toast.error(`${f.name} is larger than 5MB`);
          continue;
        }
        const ext = f.name.split(".").pop() || "jpg";
        const path = `${uid}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const {
          error
        } = await supabase.storage.from("listing-images").upload(path, f, {
          upsert: false,
          contentType: f.type
        });
        if (error) {
          toast.error(error.message);
          continue;
        }
        uploaded.push(path);
      }
      setImages((prev) => [...prev, ...uploaded]);
    } finally {
      setUploading(false);
    }
  }
  function removeImage(idx) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }
  async function runAi() {
    if (!aiNotes.trim() && aiPhotos.length === 0) {
      toast.error("Add a few words or upload a photo first");
      return;
    }
    setAiLoading(true);
    try {
      const out = await generateListing({
        data: {
          notes: aiNotes,
          imageDataUrls: aiPhotos.map((p) => p.dataUrl)
        }
      });
      setTitle(out.title);
      setDescription(out.description);
      if (out.suggested_price_inr) setPrice(String(out.suggested_price_inr));
      if (out.condition) setCondition(out.condition);
      const match = cats.find((c) => c.slug === out.category_slug && c.type === "product");
      if (match) setCategoryId(match.id);
      await uploadAiPhotosToListing();
      toast.success("AI filled the form. Review and adjust.");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setAiLoading(false);
    }
  }
  async function onSubmit(e) {
    e.preventDefault();
    if (!title.trim() || title.trim().length < 3) return toast.error("Add a title");
    if (images.length === 0) return toast.error("Add at least 1 photo");
    setSubmitting(true);
    try {
      const res = await createListing({
        data: {
          type: "product",
          title: title.trim(),
          description: description.trim() || void 0,
          price: price ? Number(price) : null,
          is_negotiable: negotiable,
          condition: condition || null,
          brand: brand.trim() || void 0,
          category_id: categoryId || null,
          city: city.trim() || void 0,
          state: state.trim() || void 0,
          images
        }
      });
      toast.success("Listing submitted for review!");
      navigate({
        to: "/listing/$id",
        params: {
          id: res.id
        }
      });
    } catch (e2) {
      toast.error(e2.message);
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Post your ad" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Sell faster with AI — upload a photo or describe your item and we'll fill the form for you." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 rounded-2xl border bg-card/60 p-4 shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-2 text-sm font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
        " AI listing assistant"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 grid grid-cols-4 gap-2 sm:grid-cols-5", children: [
        aiPhotos.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square overflow-hidden rounded-lg border bg-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.dataUrl, alt: `Reference ${i + 1}`, className: "h-full w-full object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeAiPhoto(i), className: "absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-background/85 text-foreground shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
        ] }, i)),
        aiPhotos.length < MAX_AI_PHOTOS && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-[10px] text-muted-foreground hover:bg-secondary/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Add photo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/jpeg,image/png,image/webp", multiple: true, className: "hidden", onChange: (e) => onAiPhotos(e.target.files) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Optional: e.g. iPhone 13 128GB, blue, 1 year old, with box and charger", value: aiNotes, onChange: (e) => setAiNotes(e.target.value), rows: 2 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "Upload a photo and AI will identify the product, write a title, description, suggest a price, and pick a category. Your photos are also added to the listing." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", onClick: runAi, disabled: aiLoading || aiPhotos.length === 0 && aiNotes.trim().length === 0, className: "gradient-primary text-primary-foreground", children: [
        aiLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mr-2 h-4 w-4" }),
        "Generate listing"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-5 rounded-2xl border bg-card p-5 shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "mb-2 block", children: [
          "Photos (",
          images.length,
          "/",
          MAX_IMAGES,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 sm:grid-cols-5", children: [
          images.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square overflow-hidden rounded-lg border bg-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AppImage, { bucket: "listing-images", path: p, alt: `Photo ${i + 1}`, className: "h-full w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeImage(i), className: "absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-background/85 text-foreground shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) }),
            i === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-1 left-1 rounded-full bg-primary px-2 text-[10px] font-medium text-primary-foreground", children: "Cover" })
          ] }, p)),
          images.length < MAX_IMAGES && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs text-muted-foreground hover:bg-secondary/50", children: [
            uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: uploading ? "Uploading…" : "Add" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/jpeg,image/png,image/webp", multiple: true, className: "hidden", onChange: (e) => onUpload(e.target.files) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "Up to 10 photos. First photo is the cover." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "title", children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "title", value: title, onChange: (e) => setTitle(e.target.value), maxLength: 120, required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "description", value: description, onChange: (e) => setDescription(e.target.value), rows: 5, maxLength: 4e3 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "price", children: "Price (₹)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "price", type: "number", min: "0", value: price, onChange: (e) => setPrice(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { id: "neg", checked: negotiable, onCheckedChange: setNegotiable }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "neg", children: "Negotiable" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: categoryId, onValueChange: setCategoryId, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose category" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: filteredCats.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.name_en }, c.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Condition" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: condition, onValueChange: (v) => setCondition(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Condition" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "new", children: "New" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "like_new", children: "Like New" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "good", children: "Good" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "fair", children: "Fair" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "used", children: "Used" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "brand", children: "Brand" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "brand", value: brand, onChange: (e) => setBrand(e.target.value), maxLength: 80 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "city", children: "City" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "city", value: city, onChange: (e) => setCity(e.target.value), maxLength: 120 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "state", children: "State" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "state", value: state, onChange: (e) => setState(e.target.value), maxLength: 120 })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", onClick: () => navigate({
          to: "/"
        }), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", size: "lg", disabled: submitting, className: "gradient-primary text-primary-foreground", children: [
          submitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-2 h-4 w-4" }),
          "Publish listing"
        ] })
      ] })
    ] })
  ] }) });
}
export {
  SellPage as component
};
