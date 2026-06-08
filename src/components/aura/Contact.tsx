import { useState } from "react";
import { motion } from "framer-motion";
import { MagneticButton } from "./MagneticButton";

export function Contact() {
  const [focus, setFocus] = useState<string | null>(null);

  return (
    <section id="contact" className="relative bg-black min-h-screen flex flex-col justify-center px-6 md:px-16 py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: "oklch(0.85 0.18 200 / 0.3)" }} />
        <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: "oklch(0.62 0.26 305 / 0.3)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16">
        <div>
          <p className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary mb-6">// 04 — Get in touch</p>
          <h2 className="font-display text-4xl md:text-7xl font-bold leading-[0.95] tracking-tighter text-white mb-6">
            Pronto a rendere <span className="text-gradient-aura italic">unico</span> il tuo business?
          </h2>
          <p className="text-white/50 text-lg max-w-md mb-12">Ready to scale your brand? Scrivici, chiamaci, magnetizza il cursore.</p>

          <div className="space-y-6">
            <MagneticButton strength={0.3} as="a" href="tel:+393457454180" className="block cursor-pointer">
              <div className="glass rounded-full px-6 py-4 flex items-center gap-4 hover:border-primary/50 transition-colors">
                <span className="text-2xl">📞</span>
                <span className="font-mono-spec text-sm md:text-base text-white">345 7454180</span>
              </div>
            </MagneticButton>
            <MagneticButton strength={0.3} as="a" href="mailto:parisii.leonardo@gmail.com" className="block cursor-pointer">
              <div className="glass rounded-full px-6 py-4 flex items-center gap-4 hover:border-secondary/50 transition-colors">
                <span className="text-2xl">✉</span>
                <span className="font-mono-spec text-sm md:text-base text-white break-all">parisii.leonardo@gmail.com</span>
              </div>
            </MagneticButton>
            <MagneticButton strength={0.3} as="a" href="https://imleo.it" className="block cursor-pointer">
              <div className="glass rounded-full px-6 py-4 flex items-center gap-4 hover:border-accent/50 transition-colors">
                <span className="text-2xl">🌐</span>
                <span className="font-mono-spec text-sm md:text-base text-white">imleo.it</span>
              </div>
            </MagneticButton>
          </div>
        </div>

        <motion.form
          onSubmit={(e) => { e.preventDefault(); }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass rounded-3xl p-8 md:p-10 space-y-6 self-center"
        >
          {[
            { id: "name", label: "Il tuo nome", type: "text" },
            { id: "email", label: "Email", type: "email" },
          ].map((f) => (
            <div key={f.id} className="relative">
              <label className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2">{f.label}</label>
              <input
                type={f.type}
                onFocus={() => setFocus(f.id)}
                onBlur={() => setFocus(null)}
                className="w-full bg-transparent border-b border-white/15 py-3 text-lg text-white outline-none transition-all focus:border-primary"
                style={focus === f.id ? { boxShadow: "0 4px 30px -10px oklch(0.85 0.18 200 / 0.5)" } : {}}
              />
            </div>
          ))}
          <div className="relative">
            <label className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2">Il tuo progetto</label>
            <textarea
              rows={4}
              onFocus={() => setFocus("msg")}
              onBlur={() => setFocus(null)}
              className="w-full bg-transparent border-b border-white/15 py-3 text-lg text-white outline-none transition-all focus:border-secondary resize-none"
            />
          </div>
          <MagneticButton strength={0.35} as="button" className="w-full">
            <div
              className="w-full rounded-full py-4 px-6 font-mono-spec text-xs uppercase tracking-[0.3em] text-black text-center"
              style={{ background: "var(--gradient-aura)", boxShadow: "var(--shadow-neon)" }}
            >
              Lancia il progetto →
            </div>
          </MagneticButton>
        </motion.form>
      </div>

      <footer className="relative mt-32 max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 font-mono-spec text-[10px] uppercase tracking-[0.3em] text-white/30">
        <div className="space-y-2">
          <p className="text-white/60">© 2026 Aura Web Studio</p>
          <p>Creative Digital Solutions · Made in Italy</p>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary">Instagram</a>
          <a href="#" className="hover:text-primary">Behance</a>
          <a href="#" className="hover:text-primary">GitHub</a>
        </div>
      </footer>
    </section>
  );
}