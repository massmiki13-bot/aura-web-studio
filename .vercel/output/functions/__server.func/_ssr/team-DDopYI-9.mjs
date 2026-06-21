import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { N as Nav, F as Footer } from "./Contact-BJqXKUAv.mjs";
import "../_libs/i18next.mjs";
import "../_libs/sonner.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { A as ArrowLeft, P as Phone, M as Mail, F as FileText } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
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
import "./router-Cl6mbA1M.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/use-sync-external-store.mjs";
import "./client-CS_abGrP.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const members = [{
  name: "Nome",
  surname: "Cognome",
  roleKey: "founder",
  image: "/team/member-1.jpg",
  phone: "+39 345 7454180",
  pec: "nome.cognome@pec.it",
  email: "nome@aurawebstudio.it",
  accent: "oklch(0.85 0.18 200)"
}, {
  name: "Nome",
  surname: "Cognome",
  roleKey: "developer",
  image: "/team/member-2.jpg",
  phone: "+39 000 0000000",
  pec: "nome.cognome@pec.it",
  email: "nome@aurawebstudio.it",
  accent: "oklch(0.78 0.22 280)"
}, {
  name: "Nome",
  surname: "Cognome",
  roleKey: "designer",
  image: "/team/member-3.jpg",
  phone: "+39 000 0000000",
  pec: "nome.cognome@pec.it",
  email: "nome@aurawebstudio.it",
  accent: "oklch(0.82 0.2 340)"
}];
const roles = {
  founder: "Founder & Full-Stack",
  developer: "Developer",
  designer: "Design & Motion"
};
function TeamPage() {
  const {
    t
  } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "min-h-screen bg-black text-white relative flex flex-col justify-between overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 noise-bg opacity-30 pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden absolute inset-0 opacity-40 pointer-events-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[-10%] left-[-20%] w-[600px] h-[600px] rounded-full blur-[150px]", style: {
        background: "var(--glow-cyan)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[10%] right-[-25%] w-[700px] h-[700px] rounded-full blur-[180px]", style: {
        background: "var(--glow-purple)"
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-7xl mx-auto w-full px-6 md:px-16 pt-32 pb-24 z-10 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 font-mono-spec text-[10px] uppercase tracking-[0.25em] text-white/50 hover:text-primary transition-colors cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3 w-3" }),
        " ",
        t("team.backHome")
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mb-20 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.p, { initial: {
          opacity: 0,
          y: 15
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.6
        }, className: "font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary", children: t("team.label") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.h1, { initial: {
          opacity: 0,
          y: 30
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.1
        }, className: "font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]", children: [
          t("team.titlePre"),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-aura italic", children: t("team.titleHighlight") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.p, { initial: {
          opacity: 0,
          y: 20
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.7,
          delay: 0.2
        }, className: "text-white/50 text-base md:text-lg font-light max-w-2xl leading-relaxed", children: t("team.subtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-8 max-w-6xl", children: members.map((m, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 40
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.8,
        delay: 0.3 + index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }, whileHover: {
        y: -6,
        transition: {
          duration: 0.2
        }
      }, className: "relative glass rounded-[2rem] p-8 flex flex-col overflow-hidden border border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative aspect-square w-full rounded-2xl overflow-hidden mb-6 border border-white/10", style: {
          background: `radial-gradient(circle at 50% 30%, ${m.accent}, #050108)`
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: m.image, alt: `${m.name} ${m.surname}`, className: "w-full h-full object-cover", onError: (e) => {
          e.currentTarget.style.display = "none";
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-2xl font-bold tracking-tight text-white", children: [
          m.name,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/80", children: m.surname })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono-spec text-[10px] uppercase tracking-widest mt-1 mb-6", style: {
          color: m.accent
        }, children: roles[m.roleKey] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-3 mt-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `tel:${m.phone.replace(/\s/g, "")}`, className: "flex items-center gap-3 text-white/70 hover:text-primary transition-colors group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-primary/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-light", children: m.phone })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `mailto:${m.email}`, className: "flex items-center gap-3 text-white/70 hover:text-primary transition-colors group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-primary/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3.5 w-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-light break-all", children: m.email })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `mailto:${m.pec}`, className: "flex items-center gap-3 text-white/70 hover:text-primary transition-colors group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-primary/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-light break-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/40", children: [
                t("team.pec"),
                ": "
              ] }),
              m.pec
            ] })
          ] }) })
        ] })
      ] }, `${m.name}-${index}`)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  TeamPage as component
};
