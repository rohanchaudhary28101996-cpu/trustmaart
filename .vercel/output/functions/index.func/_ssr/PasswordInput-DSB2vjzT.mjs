import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { c as cn } from "./button-DjOZMqFS.mjs";
import { R as EyeOff, E as Eye } from "../_libs/lucide-react.mjs";
const PasswordInput = reactExports.forwardRef(function PasswordInput2({ className, ...props }, ref) {
  const [show, setShow] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        ref,
        type: show ? "text" : "password",
        className: cn("pr-10", className),
        ...props
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        tabIndex: -1,
        onClick: () => setShow((s) => !s),
        "aria-label": show ? "Hide password" : "Show password",
        className: "absolute right-2 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground",
        children: show ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
      }
    )
  ] });
});
export {
  PasswordInput as P
};
