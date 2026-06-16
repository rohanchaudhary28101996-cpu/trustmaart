import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as signedUrl } from "./storage-BFg0-6YF.mjs";
import { c as cn } from "./button-DjOZMqFS.mjs";
function AppImage({
  bucket,
  path,
  alt,
  className,
  fallback = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=60",
  onClick
}) {
  const [src, setSrc] = reactExports.useState("");
  reactExports.useEffect(() => {
    let active = true;
    if (!path) {
      setSrc("");
      return;
    }
    signedUrl(bucket, path).then((u) => {
      if (active) setSrc(u);
    });
    return () => {
      active = false;
    };
  }, [bucket, path]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      src: src || fallback,
      alt,
      loading: "lazy",
      className: cn("object-cover", className),
      onClick,
      onError: (e) => e.currentTarget.src = fallback
    }
  );
}
export {
  AppImage as A
};
