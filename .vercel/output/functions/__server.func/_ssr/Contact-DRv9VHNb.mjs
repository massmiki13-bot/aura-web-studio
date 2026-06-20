import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { L as LANGUAGES, p as persistLanguage } from "./router-DFDAN8IL.mjs";
import { s as supabase } from "./client-CS_abGrP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { m as motion, A as AnimatePresence } from "../_libs/framer-motion.mjs";
import { a as ArrowRight, G as Globe, C as Check } from "../_libs/lucide-react.mjs";
function LanguageSwitcher({ onSelect, dropUp = false }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = reactExports.useState(false);
  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES.find((l) => i18n.language?.startsWith(l.code)) ?? LANGUAGES[0];
  const choose = (code) => {
    persistLanguage(code);
    setOpen(false);
    onSelect?.();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((v) => !v),
        className: "flex items-center gap-2 font-mono-spec text-xs uppercase tracking-[0.2em] text-white/80 hover:text-primary transition-colors cursor-pointer",
        "aria-label": "Change language",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3.5 w-3.5" }),
          current.short
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-40", onClick: () => setOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: dropUp ? 8 : -8 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: dropUp ? 8 : -8 },
          transition: { duration: 0.2 },
          className: dropUp ? "absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 min-w-40 glass rounded-2xl border border-white/10 p-2 backdrop-blur-xl" : "absolute right-0 mt-3 z-50 min-w-40 glass rounded-2xl border border-white/10 p-2 backdrop-blur-xl",
          children: LANGUAGES.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => choose(l.code),
              className: "w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2 font-mono-spec text-[11px] uppercase tracking-widest text-white/70 hover:bg-white/5 hover:text-white transition-colors cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: l.label }),
                current.code === l.code && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-primary" })
              ]
            },
            l.code
          ))
        }
      )
    ] }) })
  ] });
}
function Nav() {
  const { t } = useTranslation();
  const [open, setOpen] = reactExports.useState(false);
  const links = [
    { label: t("nav.home"), href: "/#hero", type: "hash" },
    { label: t("nav.work"), href: "/#projects", type: "hash" },
    { label: t("nav.product"), href: "/#team", type: "hash" },
    { label: t("nav.team"), href: "/team", type: "route" },
    { label: t("nav.contact"), href: "/#contact", type: "hash" }
  ];
  reactExports.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "header",
      {
        className: "fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between max-w-screen bg-black/40 backdrop-blur-md",
        style: { willChange: "transform" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/#hero", className: "font-display text-lg font-bold tracking-tight text-white", children: [
            "AURA",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden md:flex items-center gap-10 font-mono-spec text-xs uppercase tracking-[0.2em] text-white", children: [
            links.map(
              (l) => l.type === "route" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: l.href,
                  className: "story-link hover:text-primary transition-colors",
                  children: l.label
                },
                l.href
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: l.href,
                  className: "story-link hover:text-primary transition-colors",
                  children: l.label
                },
                l.href
              )
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageSwitcher, {})
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              "aria-label": "Menu",
              onClick: () => setOpen((v) => !v),
              className: "md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5",
              style: { willChange: "transform" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.span,
                  {
                    animate: open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 },
                    className: "block h-px w-6 bg-white origin-center"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.span,
                  {
                    animate: open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 },
                    className: "block h-px w-6 bg-white origin-center"
                  }
                )
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.4 },
        className: "fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center overflow-y-auto py-24",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 noise-bg opacity-40 pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "relative flex flex-col items-center gap-6 sm:gap-8 my-auto", children: [
            links.map((l, i) => {
              const cls = "font-display text-5xl sm:text-6xl font-bold tracking-tight text-white hover:text-gradient-aura hover:text-transparent bg-clip-text";
              const anim = {
                initial: { y: 60, opacity: 0 },
                animate: { y: 0, opacity: 1 },
                exit: { y: 30, opacity: 0 },
                transition: {
                  delay: 0.1 + i * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                  duration: 0.7
                },
                style: { backgroundImage: "var(--gradient-aura)" },
                className: cls,
                onClick: () => setOpen(false)
              };
              return l.type === "route" ? /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { ...anim, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: l.href, onClick: () => setOpen(false), className: cls, children: l.label }) }, l.href) : /* @__PURE__ */ jsxRuntimeExports.jsx(motion.a, { href: l.href, ...anim, children: l.label }, l.href);
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageSwitcher, { dropUp: true, onSelect: () => setOpen(false) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.5 },
              className: "absolute bottom-10 left-0 right-0 text-center font-mono-spec text-xs uppercase tracking-[0.3em] text-white/40",
              children: "Aura Web Studio — 2026"
            }
          )
        ]
      }
    ) })
  ] });
}
function Contact() {
  const { t } = useTranslation();
  const [focus, setFocus] = reactExports.useState(null);
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [sent, setSent] = reactExports.useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error(t("contact.errFill"));
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({ name: name.trim(), email: email.trim(), message: message.trim() });
    setLoading(false);
    if (error) {
      toast.error(t("contact.errSend"));
      return;
    }
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
    toast.success(t("contact.success"));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      id: "contact",
      className: "relative bg-black min-h-screen flex flex-col justify-center px-6 md:px-16 py-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden absolute inset-0 opacity-40 pointer-events-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute top-1/4 -left-40 w-125 h-125 rounded-full blur-[120px]",
              style: { background: "var(--glow-cyan)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute bottom-1/4 -right-40 w-125 h-125 rounded-full blur-[120px]",
              style: { background: "var(--glow-purple)" }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary mb-6", children: t("contact.label") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tighter text-white mb-6", children: [
              t("contact.headingPre"),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-aura italic pr-2", children: t("contact.headingHighlight") }),
              t("contact.headingPost")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-base md:text-lg max-w-md mb-8", children: t("contact.paragraph") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/team",
                className: "glass rounded-2xl p-5 flex items-center gap-4 group hover:border-primary/30 border border-transparent transition-colors cursor-pointer",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono-spec text-[10px] uppercase tracking-widest text-white/40", children: t("contact.teamLabel") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono-spec text-base text-white group-hover:text-primary transition-colors", children: t("contact.teamCta") })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 text-white/40 group-hover:text-primary group-hover:translate-x-1 transition-all" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.form,
            {
              onSubmit,
              initial: { opacity: 0, y: 40 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.8 },
              style: { willChange: "transform, opacity" },
              className: "glass rounded-3xl p-6 md:p-10 space-y-6",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2", children: t("contact.formName") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      value: name,
                      onChange: (e) => setName(e.target.value),
                      onFocus: () => setFocus("name"),
                      onBlur: () => setFocus(null),
                      maxLength: 120,
                      required: true,
                      className: "w-full bg-transparent border-b border-white/15 py-3 text-lg text-white outline-none transition-all focus:border-primary"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2", children: t("contact.formEmail") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "email",
                      value: email,
                      onChange: (e) => setEmail(e.target.value),
                      onFocus: () => setFocus("email"),
                      onBlur: () => setFocus(null),
                      maxLength: 200,
                      required: true,
                      className: "w-full bg-transparent border-b border-white/15 py-3 text-lg text-white outline-none transition-all focus:border-primary"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2", children: t("contact.formProject") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "textarea",
                    {
                      rows: 4,
                      value: message,
                      onChange: (e) => setMessage(e.target.value),
                      onFocus: () => setFocus("msg"),
                      onBlur: () => setFocus(null),
                      maxLength: 4e3,
                      required: true,
                      className: "w-full bg-transparent border-b border-white/15 py-3 text-lg text-white outline-none transition-all focus:border-secondary resize-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: loading,
                    className: "w-full cursor-pointer hover:shadow-(--shadow-neon) transition-shadow duration-300 rounded-full py-4 px-6 font-mono-spec text-xs uppercase tracking-[0.3em] text-black text-center transition-opacity",
                    style: {
                      background: "var(--gradient-aura)",
                      boxShadow: "",
                      opacity: loading ? 0.6 : 1
                    },
                    children: loading ? t("contact.btnLoading") : sent ? t("contact.btnSent") : t("contact.btnIdle")
                  }
                )
              ]
            }
          )
        ] })
      ]
    }
  );
}
function Footer() {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "bg-black px-6 md:px-16 py-16 border-t border-white/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto w-full grid gap-12 md:grid-cols-4 font-mono-spec text-[10px] uppercase tracking-[0.3em] text-white/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/#hero", className: "font-display text-xl font-bold tracking-tight text-white", children: [
          "AURA",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 normal-case tracking-normal text-xs", children: t("footer.tagline") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50", children: t("footer.explore") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/#projects", className: "hover:text-primary transition-colors", children: t("nav.work") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/#team", className: "hover:text-primary transition-colors", children: t("nav.product") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pricing", className: "hover:text-primary transition-colors", children: t("pricing.title") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/team", className: "hover:text-primary transition-colors", children: t("nav.team") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/#contact", className: "hover:text-primary transition-colors", children: t("nav.contact") }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50", children: t("footer.legal") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-primary transition-colors", children: t("footer.privacy") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-primary transition-colors", children: t("footer.terms") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "pt-2 flex gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-primary transition-colors", children: "IG" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-primary transition-colors", children: "BE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-primary transition-colors", children: "GH" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto w-full mt-12 pt-6 border-t border-white/10 font-mono-spec text-[10px] uppercase tracking-[0.3em] text-white/30", children: "© 2026 Aura Web Studio" })
  ] });
}
export {
  Contact as C,
  Footer as F,
  Nav as N
};
