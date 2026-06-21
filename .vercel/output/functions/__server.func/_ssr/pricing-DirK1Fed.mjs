import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { N as Nav, F as Footer } from "./Contact-ChDHymzm.mjs";
import "../_libs/i18next.mjs";
import "../_libs/sonner.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { A as ArrowLeft, C as Check } from "../_libs/lucide-react.mjs";
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
import "./router-WnPp5t4E.mjs";
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
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const planConfig = [{
  key: "base",
  price: "€750,00",
  popular: false
}, {
  key: "professional",
  price: "€2000,00",
  popular: true
}, {
  key: "premium",
  price: "€5000,00",
  popular: false
}];
function PricingPage() {
  const {
    t
  } = useTranslation();
  const plans = planConfig.map((p) => ({
    price: p.price,
    popular: p.popular,
    period: t("pricing.period"),
    name: t(`pricing.${p.key}.name`),
    desc: t(`pricing.${p.key}.desc`),
    buttonText: t(`pricing.${p.key}.button`),
    features: t(`pricing.${p.key}.features`, {
      returnObjects: true
    })
  }));
  const maintenanceItems = t("pricing.maintenance.items", {
    returnObjects: true
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "min-h-screen bg-black text-white relative flex flex-col justify-between overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 noise-bg opacity-30 pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden absolute inset-0 opacity-40 pointer-events-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[-10%] left-[-20%] w-[600px] h-[600px] rounded-full blur-[150px]", style: {
        background: "var(--glow-cyan)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[20%] right-[-25%] w-[700px] h-[700px] rounded-full blur-[180px]", style: {
        background: "var(--glow-purple)"
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-7xl mx-auto w-full px-6 md:px-16 pt-32 pb-24 z-10 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 font-mono-spec text-[10px] uppercase tracking-[0.25em] text-white/50 hover:text-primary transition-colors cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3 w-3" }),
        " ",
        t("pricing.backHome")
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center max-w-3xl mx-auto mb-20 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.h1, { initial: {
        opacity: 0,
        y: 30
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.1
      }, className: "font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]", children: t("pricing.title") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto select-none", children: plans.map((plan, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
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
      }, className: `relative glass rounded-[2rem] p-8 md:p-10 flex flex-col justify-between overflow-hidden border ${plan.popular ? "border-white/20 shadow-[0_0_50px_oklch(0.85_0.18_200_/_0.06)]" : "border-white/10 scale-95"}`, children: [
        plan.popular && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono-spec text-sm font-medium tracking-wide text-white/80", children: plan.name }),
            plan.popular && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 py-1 text-[10px] font-mono-spec uppercase tracking-widest text-white/90 bg-white/10 rounded-full border border-white/20 shadow-sm backdrop-blur-md", children: t("pricing.mostPopular") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-baseline gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-4xl sm:text-5xl font-bold tracking-tight text-white", children: plan.price }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono-spec text-[10px] uppercase tracking-widest text-white/40", children: plan.period })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-xs sm:text-sm font-light min-h-10 leading-relaxed", children: plan.desc }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 mb-10", children: plan.popular ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "w-full cursor-pointer hover:shadow-(--shadow-neon) transition-shadow duration-300 rounded-full py-4 px-6 font-mono-spec text-xs uppercase tracking-[0.3em] text-black text-center transition-opacity", style: {
            background: "var(--gradient-aura)",
            boxShadow: ""
          }, children: plan.buttonText }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "w-full cursor-pointer rounded-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/15 hover:border-white/30 py-3.5 px-4 font-mono-spec text-[11px] uppercase tracking-widest text-white text-center font-medium transition-all hover:scale-[1.02] active:scale-95", children: plan.buttonText }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-center my-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative px-3 bg-black/40 backdrop-blur-sm font-mono-spec text-[9px] uppercase tracking-[0.25em] text-white/40 z-10", children: t("pricing.features") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-4", children: plan.features.map((feature) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 text-white/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/70 border border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs sm:text-sm font-light text-white/70", children: feature })
          ] }, feature)) })
        ] })
      ] }, plan.name)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 40
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.8,
        delay: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }, className: "relative glass rounded-[2rem] p-8 md:p-12 mt-20 max-w-6xl mx-auto overflow-hidden border border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid md:grid-cols-2 gap-10 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block px-3 py-1 mb-6 text-[10px] font-mono-spec uppercase tracking-widest text-white/90 bg-white/10 rounded-full border border-white/20 backdrop-blur-md", children: t("pricing.maintenance.badge") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4", children: t("pricing.maintenance.title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-sm font-light leading-relaxed mb-6", children: t("pricing.maintenance.desc") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono-spec text-[10px] uppercase tracking-widest text-white/40", children: t("pricing.maintenance.from") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-4xl sm:text-5xl font-bold tracking-tight text-white", children: "€50,00" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono-spec text-[10px] uppercase tracking-widest text-white/40", children: t("pricing.maintenance.perMonth") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-white/40 text-xs font-light", children: t("pricing.maintenance.upTo") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-center mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative px-3 bg-black/40 backdrop-blur-sm font-mono-spec text-[9px] uppercase tracking-[0.25em] text-white/40 z-10", children: t("pricing.maintenance.included") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-4", children: maintenanceItems.map((feature) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 text-white/80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/70 border border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs sm:text-sm font-light text-white/70", children: feature })
            ] }, feature)) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  PricingPage as component
};
