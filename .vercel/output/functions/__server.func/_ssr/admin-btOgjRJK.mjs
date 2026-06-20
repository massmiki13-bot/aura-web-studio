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
function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = reactExports.useState(true);
  const [isAdmin, setIsAdmin] = reactExports.useState(false);
  const [userId, setUserId] = reactExports.useState(null);
  const [userEmail, setUserEmail] = reactExports.useState(null);
  const [messages, setMessages] = reactExports.useState([]);
  reactExports.useEffect(() => {
    (async () => {
      const {
        data: sess
      } = await supabase.auth.getSession();
      if (!sess.session) {
        navigate({
          to: "/auth"
        });
        return;
      }
      const uid = sess.session.user.id;
      setUserId(uid);
      setUserEmail(sess.session.user.email ?? null);
      const {
        data: roles
      } = await supabase.from("user_roles").select("role").eq("user_id", uid);
      const admin = !!roles?.some((r) => r.role === "admin");
      setIsAdmin(admin);
      if (admin) {
        const {
          data,
          error
        } = await supabase.from("contact_messages").select("*").order("created_at", {
          ascending: false
        });
        if (error) toast.error(error.message);
        else setMessages(data ?? []);
      }
      setLoading(false);
    })();
  }, [navigate]);
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({
      to: "/auth"
    });
  };
  const deleteMsg = async (id) => {
    const {
      error
    } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setMessages((m) => m.filter((x) => x.id !== id));
    toast.success("Messaggio eliminato");
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-screen bg-black text-white flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono-spec text-xs uppercase tracking-widest text-white/40", children: "Loading…" }) });
  }
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-screen bg-black text-white flex items-center justify-center px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold", children: "Accesso negato" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/60 text-sm", children: [
        "L'account ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: userEmail }),
        " non ha il ruolo admin."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/40 text-xs font-mono-spec break-all", children: [
        "UID: ",
        userId
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-sm", children: "Per assegnare admin, esegui in DB:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-left text-[11px] glass rounded-lg p-3 overflow-x-auto font-mono-spec", children: `INSERT INTO user_roles (user_id, role)
VALUES ('${userId}', 'admin');` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: signOut, className: "text-xs text-white/40 hover:text-white underline font-mono-spec uppercase tracking-widest", children: "Esci" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "min-h-screen bg-black text-white px-6 md:px-12 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between mb-10 max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "font-display text-lg font-bold tracking-tight text-white", children: [
        "AURA",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/40 text-xs ml-2 font-mono-spec uppercase tracking-widest", children: "/ admin" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: signOut, className: "text-xs text-white/50 hover:text-white font-mono-spec uppercase tracking-widest", children: "Logout" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary mb-2", children: "// Inbox" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl md:text-5xl font-bold tracking-tighter", children: "Messaggi dal sito" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono-spec text-xs text-white/40", children: [
          messages.length,
          " ",
          messages.length === 1 ? "messaggio" : "messaggi"
        ] })
      ] }),
      messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-12 text-center text-white/50", children: "Nessun messaggio ancora." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: messages.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "glass rounded-2xl p-6 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold", children: m.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `mailto:${m.email}`, className: "text-sm text-primary hover:underline break-all", children: m.email })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("time", { className: "font-mono-spec text-[10px] uppercase tracking-widest text-white/40", children: new Date(m.created_at).toLocaleString("it-IT") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => deleteMsg(m.id), className: "text-[10px] uppercase tracking-widest font-mono-spec text-white/40 hover:text-destructive transition-colors", children: "Elimina" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 whitespace-pre-wrap leading-relaxed", children: m.message })
      ] }, m.id)) })
    ] })
  ] });
}
export {
  AdminPage as component
};
