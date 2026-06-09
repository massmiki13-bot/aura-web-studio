import { useState } from "react";
import { motion } from "framer-motion";
import { MagneticButton } from "./MagneticButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function Contact() {
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
      toast.error("Compila tutti i campi");
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("contact_messages")
      .insert({ name: name.trim(), email: email.trim(), message: message.trim() });
    setLoading(false);
    if (error) {
      toast.error("Invio non riuscito. Controlla i dati e riprova.");
      return;
    }
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
    toast.success("Richiesta inviata. Ti rispondiamo a breve.");
  };

  return (
    <section
      id="contact"
      className="relative bg-black min-h-screen flex flex-col justify-center px-6 md:px-16 py-4"
    >
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div
          className="absolute top-1/4 -left-40 w-125 h-125 rounded-full blur-[120px]"
          style={{ background: "oklch(0.85 0.18 200 / 0.3)" }}
        />
        <div
          className="absolute bottom-1/4 -right-40 w-125 h-125 rounded-full blur-[120px]"
          style={{ background: "oklch(0.62 0.26 305 / 0.3)" }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <p className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary mb-6">
            // 04 — Get in touch
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tighter text-white mb-6">
            Pronto a rendere <span className="text-gradient-aura italic">unico</span> il tuo
            business?
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-md mb-8">
            Raccontaci il tuo progetto. Ti rispondiamo entro 24 ore con una prima idea su come
            svilupparlo.
          </p>
          <div className="glass rounded-2xl p-5 flex items-center gap-4">
            <span className="text-2xl">📞</span>
            <div>
              <p className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40">
                Chiamaci
              </p>
              <a
                href="tel:+393457454180"
                className="font-mono-spec text-base text-white hover:text-primary transition-colors"
              >
                345 7454180
              </a>
            </div>
          </div>
        </div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass rounded-3xl p-6 md:p-10 space-y-6"
        >
          <div className="relative">
            <label className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2">
              Il tuo nome
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
              style={
                focus === "name" ? { boxShadow: "0 4px 30px -10px oklch(0.85 0.18 200 / 0.5)" } : {}
              }
            />
          </div>
          <div className="relative">
            <label className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2">
              Email
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
              style={
                focus === "email"
                  ? { boxShadow: "0 4px 30px -10px oklch(0.85 0.18 200 / 0.5)" }
                  : {}
              }
            />
          </div>
          <div className="relative">
            <label className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2">
              Il tuo progetto
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
          <MagneticButton
            strength={0.35}
            as="button"
            type="submit"
            className="w-full hidden md:block"
          >
            <div
              className="w-full rounded-full py-4 px-6 font-mono-spec text-xs uppercase tracking-[0.3em] text-black text-center"
              style={{
                background: "var(--gradient-aura)",
                boxShadow: "var(--shadow-neon)",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading
                ? "Invio in corso…"
                : sent
                  ? "Inviato ✓ — manda un altro"
                  : "Lancia il progetto →"}
            </div>
          </MagneticButton>
          <button
            type="submit"
            disabled={loading}
            className="w-full md:hidden rounded-full py-4 px-6 font-mono-spec text-xs uppercase tracking-[0.3em] text-black text-center transition-opacity"
            style={{
              background: "var(--gradient-aura)",
              boxShadow: "var(--shadow-neon)",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading
              ? "Invio in corso…"
              : sent
                ? "Inviato ✓ — manda un altro"
                : "Lancia il progetto →"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-black px-6 md:px-16 py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 font-mono-spec text-[10px] uppercase tracking-[0.3em] text-white/30">
        <div className="space-y-2">
          <p className="text-white/60">© 2026 Aura Web Studio</p>
          <p>Creative Digital Solutions · Made in Italy</p>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary">
            Instagram
          </a>
          <a href="#" className="hover:text-primary">
            Behance
          </a>
          <a href="#" className="hover:text-primary">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
