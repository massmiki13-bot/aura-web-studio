import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Footer } from "@/components/aura/Contact";
import { Nav } from "@/components/aura/Nav";
import { pageSeo } from "@/lib/seo";
import { SparklesCanvas } from "@/components/ui/sparkles-canvas";
import { WordRevealHeading } from "@/components/ui/word-reveal-heading";
import { PlanRequestModal, type PlanRequestTarget } from "@/components/aura/PlanRequestModal";

export const Route = createFileRoute("/pricing")({
  head: () =>
    pageSeo({
      title: "Piani e Prezzi",
      path: "/pricing",
      description:
        "Scegli il piano ideale per portare il tuo business online. Tariffe trasparenti per landing page, siti vetrina ed e-commerce custom.",
    }),
  component: PricingPage,
});

const planConfig = [
  { key: "base", price: "€750,00", priceValue: 750, popular: false },
  { key: "professional", price: "€2000,00", priceValue: 2000, popular: true },
  { key: "premium", price: "€5000,00", priceValue: 5000, popular: false },
] as const;

function PricingPage() {
  const { t } = useTranslation();
  const [requestedPlan, setRequestedPlan] = useState<PlanRequestTarget | null>(null);

  const plans = planConfig.map((p) => ({
    price: p.price,
    priceValue: p.priceValue,
    popular: p.popular,
    period: t("pricing.period"),
    name: t(`pricing.${p.key}.name`),
    desc: t(`pricing.${p.key}.desc`),
    buttonText: t(`pricing.${p.key}.button`),
    features: t(`pricing.${p.key}.features`, { returnObjects: true }) as string[],
  }));

  const maintenanceItems = t("pricing.maintenance.items", { returnObjects: true }) as string[];

  return (
    <main className="min-h-screen bg-black text-white relative flex flex-col justify-between overflow-hidden">
      <Nav />
      {/* Background Atmosphere */}
      <div className="absolute inset-0 noise-bg opacity-30 pointer-events-none" />
      <div className="overflow-hidden absolute inset-0 opacity-40 pointer-events-none">
        <div
          className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] rounded-full blur-[150px]"
          style={{ background: "var(--glow-cyan)" }}
        />
        <div
          className="absolute bottom-[20%] right-[-25%] w-[700px] h-[700px] rounded-full blur-[180px]"
          style={{ background: "var(--glow-purple)" }}
        />
      </div>

      {/* Ambient grid + sparkles behind the header, radially masked like the
          reference — kept to plain white/theme tokens, no new colors. */}
      <div
        className="absolute top-0 left-0 right-0 h-[420px] overflow-hidden pointer-events-none z-0"
        style={{ maskImage: "radial-gradient(60% 60% at 50% 0%, black, transparent 85%)", WebkitMaskImage: "radial-gradient(60% 60% at 50% 0%, black, transparent 85%)" }}
      >
        {/* Soft white light wash behind the grid/sparkles — makes the whole
            header area feel diffused/glowing instead of a flat black box. */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(50% 55% at 50% 15%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 45%, transparent 75%)" }}
        />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "70px 80px",
          }}
        />
        <SparklesCanvas className="absolute inset-0" count={180} />
      </div>

      <div className="relative max-w-7xl mx-auto w-full px-6 md:px-16 pt-32 pb-24 z-10 flex-1">
        {/* Navigation & Back Button */}
        <div className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono-spec text-[10px] uppercase tracking-[0.25em] text-white/50 hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3 w-3" /> {t("pricing.backHome")}
          </Link>
        </div>

        {/* Header Title Section */}
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-20 space-y-4">
          <WordRevealHeading
            text={t("pricing.title")}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]"
          />
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto select-none">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3 + index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`relative glass rounded-[2rem] p-8 md:p-10 flex flex-col justify-between overflow-hidden border ${
                plan.popular
                  ? "border-white/20 shadow-[0_0_50px_oklch(0.85_0.18_200_/_0.06)]"
                  : "border-white/10 scale-95"
              }`}
            >
              {/* Popular Shine Reflection Overlay */}
              {plan.popular && (
                <>
                  <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                </>
              )}

              {/* Card Top */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono-spec text-sm font-medium tracking-wide text-white/80">
                    {plan.name}
                  </span>
                  {plan.popular && (
                    <span className="px-3 py-1 text-[10px] font-mono-spec uppercase tracking-widest text-white/90 bg-white/10 rounded-full border border-white/20 shadow-sm backdrop-blur-md">
                      {t("pricing.mostPopular")}
                    </span>
                  )}
                </div>

                <div className="mb-1 flex items-baseline gap-1">
                  <span className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
                    {plan.price}
                  </span>
                  <span className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40">
                    {plan.period}
                  </span>
                </div>

                {/* Surfaced next to the price itself (not only in the
                    maintenance card further down the page) so nobody forms a
                    "total cost" expectation before learning about it. */}
                <p className="mb-4 font-mono-spec text-[10px] uppercase tracking-widest text-primary/80">
                  {t("pricing.plusMaintenance")}
                </p>

                <p className="text-white/50 text-xs sm:text-sm font-light min-h-10 leading-relaxed">
                  {plan.desc}
                </p>

                {/* CTA Button */}
                <div className="mt-8 mb-10">
                  {plan.popular ? (
                    <button
                      type="button"
                      onClick={() =>
                        setRequestedPlan({
                          name: plan.name,
                          price: plan.price,
                          priceValue: plan.priceValue,
                        })
                      }
                      className="w-full cursor-pointer hover:shadow-(--shadow-neon) transition-shadow duration-300 rounded-full py-4 px-6 font-mono-spec text-xs uppercase tracking-[0.3em] text-black text-center transition-opacity"
                      style={{
                        background: "var(--gradient-aura)",
                        boxShadow: "",
                      }}
                    >
                      {plan.buttonText}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setRequestedPlan({
                          name: plan.name,
                          price: plan.price,
                          priceValue: plan.priceValue,
                        })
                      }
                      className="w-full cursor-pointer rounded-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/15 hover:border-white/30 py-3.5 px-4 font-mono-spec text-[11px] uppercase tracking-widest text-white text-center font-medium transition-all hover:scale-[1.02] active:scale-95"
                    >
                      {plan.buttonText}
                    </button>
                  )}
                </div>

                {/* Features Divider */}
                <div className="relative flex items-center justify-center my-6">
                  <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                  <span className="relative px-3 bg-black/40 backdrop-blur-sm font-mono-spec text-[9px] uppercase tracking-[0.25em] text-white/40 z-10">
                    {t("pricing.features")}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-white/80">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/70 border border-white/10">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-xs sm:text-sm font-light text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Monthly Maintenance Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative glass rounded-[2rem] p-8 md:p-12 mt-20 max-w-6xl mx-auto overflow-hidden border border-white/10"
        >
          {/* Shine Overlay */}
          <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            {/* Left: Title & Price */}
            <div>
              <span className="inline-block px-3 py-1 mb-6 text-[10px] font-mono-spec uppercase tracking-widest text-white/90 bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
                {t("pricing.maintenance.badge")}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
                {t("pricing.maintenance.title")}
              </h2>
              <p className="text-white/50 text-sm font-light leading-relaxed mb-6">
                {t("pricing.maintenance.desc")}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40">
                  {t("pricing.maintenance.from")}
                </span>
                <span className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
                  €50,00
                </span>
                <span className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40">
                  {t("pricing.maintenance.perMonth")}
                </span>
              </div>
              <p className="mt-2 text-white/40 text-xs font-light">
                {t("pricing.maintenance.upTo")}
              </p>
            </div>

            {/* Right: Included Features */}
            <div>
              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <span className="relative px-3 bg-black/40 backdrop-blur-sm font-mono-spec text-[9px] uppercase tracking-[0.25em] text-white/40 z-10">
                  {t("pricing.maintenance.included")}
                </span>
              </div>
              <ul className="space-y-4">
                {maintenanceItems.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-white/80">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/70 border border-white/10">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-xs sm:text-sm font-light text-white/70">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />

      <PlanRequestModal plan={requestedPlan} onOpenChange={(open) => !open && setRequestedPlan(null)} />
    </main>
  );
}
