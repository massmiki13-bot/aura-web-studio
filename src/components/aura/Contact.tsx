import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SITE_CONFIG, localizedPath } from "@/lib/seo";
import { getLocaleFromPathname } from "@/i18n";

export function Contact() {
  const { t } = useTranslation();
  const locale = getLocaleFromPathname(useRouterState({ select: (s) => s.location.pathname }));
  const [focus, setFocus] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error(t("contact.errFill"));
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("contact_messages")
      .insert({ name: name.trim(), email: email.trim(), message: message.trim() });
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

  return (
    <section
      id="contact"
      className="relative bg-black min-h-screen flex flex-col justify-center px-6 md:px-16 py-4"
    >
      <div className="overflow-hidden absolute inset-0 opacity-40 pointer-events-none">
        <div
          className="absolute top-1/4 -left-40 w-125 h-125 rounded-full blur-[120px]"
          style={{ background: "var(--glow-cyan)" }}
        />
        <div
          className="absolute bottom-1/4 -right-40 w-125 h-125 rounded-full blur-[120px]"
          style={{ background: "var(--glow-purple)" }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <p className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary mb-6">
            {t("contact.label")}
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tighter text-white mb-6">
            {t("contact.headingPre")}
            <span className="text-gradient-aura italic pr-2">{t("contact.headingHighlight")}</span>
            {t("contact.headingPost")}
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-md mb-8">
            {t("contact.paragraph")}
          </p>
          <Link
            to={localizedPath(locale, "team")}
            className="glass rounded-2xl p-5 flex items-center gap-4 group hover:border-primary/30 border border-transparent transition-colors cursor-pointer"
          >
            <div className="flex-1">
              <p className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40">
                {t("contact.teamLabel")}
              </p>
              <span className="font-mono-spec text-base text-white group-hover:text-primary transition-colors">
                {t("contact.teamCta")}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ willChange: "transform, opacity" }}
          className="glass rounded-3xl p-6 md:p-10 space-y-6"
        >
          <div className="relative">
            <label className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2">
              {t("contact.formName")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocus("name")}
              onBlur={() => setFocus(null)}
              maxLength={120}
              required
              className="w-full bg-transparent border-b border-white/15 py-3 text-lg text-white outline-none transition-all focus:border-primary"
            />
          </div>
          <div className="relative">
            <label className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2">
              {t("contact.formEmail")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocus("email")}
              onBlur={() => setFocus(null)}
              maxLength={200}
              required
              className="w-full bg-transparent border-b border-white/15 py-3 text-lg text-white outline-none transition-all focus:border-primary"
            />
          </div>
          <div className="relative">
            <label className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2">
              {t("contact.formProject")}
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setFocus("msg")}
              onBlur={() => setFocus(null)}
              maxLength={4000}
              required
              className="w-full bg-transparent border-b border-white/15 py-3 text-lg text-white outline-none transition-all focus:border-secondary resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer hover:shadow-(--shadow-neon) transition-shadow duration-300 rounded-full py-4 px-6 font-mono-spec text-xs uppercase tracking-[0.3em] text-black text-center transition-opacity"
            style={{
              background: "var(--gradient-aura)",
              boxShadow: "",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? t("contact.btnLoading") : sent ? t("contact.btnSent") : t("contact.btnIdle")}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useTranslation();
  const locale = getLocaleFromPathname(useRouterState({ select: (s) => s.location.pathname }));
  const homeHref = localizedPath(locale, "");
  return (
    <footer className="bg-black px-6 md:px-16 py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto w-full grid gap-12 md:grid-cols-4 font-mono-spec text-[10px] uppercase tracking-[0.3em] text-white/30">
        {/* Brand */}
        <div className="space-y-3 md:col-span-2">
          <a
            href={`${homeHref}#hero`}
            className="font-display text-xl font-bold tracking-tight text-white"
          >
            AURA<span className="text-primary">.</span>
          </a>
          <p className="text-white/60 normal-case tracking-normal text-xs">{t("footer.tagline")}</p>
          <p className="text-white/30 normal-case tracking-normal text-xs">
            {SITE_CONFIG.location.street}, {SITE_CONFIG.location.city} —{" "}
            {SITE_CONFIG.location.region}
          </p>
        </div>

        {/* Explore */}
        <div className="space-y-3">
          <p className="text-white/50">{t("footer.explore")}</p>
          <ul className="space-y-2.5">
            <li>
              <a href={`${homeHref}#projects`} className="hover:text-primary transition-colors">
                {t("nav.work")}
              </a>
            </li>
            <li>
              <a href={`${homeHref}#team`} className="hover:text-primary transition-colors">
                {t("nav.product")}
              </a>
            </li>
            <li>
              <Link
                to={localizedPath(locale, "pricing")}
                className="hover:text-primary transition-colors"
              >
                {t("pricing.title")}
              </Link>
            </li>
            <li>
              <Link
                to={localizedPath(locale, "team")}
                className="hover:text-primary transition-colors"
              >
                {t("nav.team")}
              </Link>
            </li>
            <li>
              <Link
                to={localizedPath(locale, "contact")}
                className="hover:text-primary transition-colors"
              >
                {t("nav.contact")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Social */}
        <div className="space-y-3">
          <p className="text-white/50">{t("footer.legal")}</p>
          <ul className="space-y-2.5">
            <li>
              <Link to="/privacy" className="hover:text-primary transition-colors">
                {t("footer.privacy")}
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                {t("footer.terms")}
              </a>
            </li>
            <li className="pt-2 flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">
                IG
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                BE
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                GH
              </a>
              <a
                href={SITE_CONFIG.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors"
              >
                LI
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full mt-12 pt-6 border-t border-white/10 font-mono-spec text-[10px] uppercase tracking-[0.3em] text-white/30 flex flex-wrap items-center justify-between gap-3">
        <span>© 2026 Aura Web Studio</span>
        <Link to="/auth" className="hover:text-white/60 transition-colors">
          Area personale
        </Link>
      </div>
    </footer>
  );
}
