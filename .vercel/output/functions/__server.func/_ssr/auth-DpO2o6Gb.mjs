import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-CS_abGrP.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = reactExports.useState("signin");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    supabase.auth.getSession().then(({
      data
    }) => {
      if (data.session) navigate({
        to: "/admin"
      });
    });
  }, [navigate]);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signup") {
      const {
        error: error2
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`
        }
      });
      setLoading(false);
      if (error2) return toast.error(error2.message);
      toast.success("Account creato. Ora puoi accedere.");
      setMode("signin");
      return;
    }
    const {
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    navigate({
      to: "/admin"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-screen bg-black text-white flex items-center justify-center px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "font-display text-lg font-bold tracking-tight text-white", children: [
      "AURA",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold tracking-tight mt-8 mb-2", children: mode === "signin" ? "Admin Access" : "Crea account admin" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-sm mb-8 font-mono-spec uppercase tracking-widest text-[10px]", children: "// Aura Web Studio dashboard" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "glass rounded-2xl p-6 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full bg-transparent border-b border-white/15 py-2 text-white outline-none focus:border-primary" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full bg-transparent border-b border-white/15 py-2 text-white outline-none focus:border-primary" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "w-full rounded-full py-3 font-mono-spec text-xs uppercase tracking-[0.3em] text-black disabled:opacity-50", style: {
        background: "var(--gradient-aura)"
      }, children: loading ? "…" : mode === "signin" ? "Entra" : "Registrati" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode((m) => m === "signin" ? "signup" : "signin"), className: "w-full text-center text-xs text-white/40 hover:text-white/70 transition-colors font-mono-spec uppercase tracking-widest", children: mode === "signin" ? "Crea un account" : "Hai già un account? Accedi" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-[11px] text-white/30 text-center font-mono-spec", children: "Solo utenti con ruolo admin possono vedere i messaggi." })
  ] }) });
}
export {
  AuthPage as component
};
