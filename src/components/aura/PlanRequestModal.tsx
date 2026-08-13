"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

export type PlanRequestTarget = {
  name: string;
  price: string;
  priceValue: number;
};

export function PlanRequestModal({
  plan,
  onOpenChange,
}: {
  plan: PlanRequestTarget | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [customize, setCustomize] = useState(false);
  const [customPrice, setCustomPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const reset = () => {
    setFullName("");
    setPhone("");
    setContact("");
    setMessage("");
    setCustomize(false);
    setCustomPrice("");
    setSent(false);
  };

  const close = () => {
    onOpenChange(false);
    // Let the closing animation finish before wiping the form state.
    setTimeout(reset, 200);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !plan) return;
    if (!fullName.trim() || !phone.trim() || !contact.trim() || !message.trim()) {
      toast.error(t("pricing.modal.errFill"));
      return;
    }
    const requestedPrice = customize && customPrice.trim() ? Number(customPrice) : null;
    setLoading(true);
    try {
      const { error } = await supabase.from("plan_requests").insert({
        plan: plan.name,
        full_name: fullName.trim(),
        phone: phone.trim(),
        contact_email: contact.trim(),
        message: message.trim(),
        requested_price: requestedPrice,
      });
      if (error) throw error;
      setSent(true);
      toast.success(t("pricing.modal.success"));
    } catch {
      toast.error(t("pricing.modal.errSend"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!plan} onOpenChange={(next) => !next && close()}>
      {/* Solid background (not the shared translucent .glass utility) — a
          request form must read clearly with nothing bleeding through from
          the page behind it. */}
      <DialogContent className="max-w-lg w-[calc(100%-2rem)] border border-white/10 bg-neutral-950 text-white rounded-3xl p-6 md:p-8 gap-0">
        <DialogHeader className="text-left space-y-2 mb-6">
          <DialogTitle className="font-display text-2xl font-bold tracking-tight text-white">
            {t("pricing.modal.title")}
          </DialogTitle>
          <DialogDescription className="text-white/50 text-sm font-light leading-relaxed">
            {t("pricing.modal.subtitle")}
          </DialogDescription>
        </DialogHeader>

        {/* Only a plan chosen from the pricing page has a reference price to
            show and to customize against — the generic "Richiedi preventivo"
            entry point (nav CTA) has neither, so both this badge and the
            budget toggle below stay hidden for it. */}
        {plan && plan.price && (
          <div className="flex items-center justify-between mb-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div>
              <p className="font-mono-spec text-[9px] uppercase tracking-widest text-white/40 mb-1">
                {t("pricing.modal.planLabel")}
              </p>
              <p className="font-mono-spec text-sm text-white/90">{plan.name}</p>
            </div>
            <span className="font-display text-xl font-bold text-white">{plan.price}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2">
              {t("pricing.modal.formName")}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength={120}
              required
              className="w-full bg-transparent border-b border-white/15 py-2.5 text-base text-white outline-none transition-all focus:border-primary"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2">
                {t("pricing.modal.formPhone")}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={30}
                required
                className="w-full bg-transparent border-b border-white/15 py-2.5 text-base text-white outline-none transition-all focus:border-primary"
              />
            </div>
            <div>
              <label className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2">
                {t("pricing.modal.formContact")}
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                maxLength={200}
                required
                className="w-full bg-transparent border-b border-white/15 py-2.5 text-base text-white outline-none transition-all focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2">
              {t("pricing.modal.formMessage")}
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={4000}
              required
              className="w-full bg-transparent border-b border-white/15 py-2.5 text-base text-white outline-none transition-all focus:border-secondary resize-none"
            />
          </div>

          {plan && plan.price && (
            <>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={customize}
                  onChange={(e) => setCustomize(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-transparent accent-white cursor-pointer"
                />
                <span className="font-mono-spec text-[11px] uppercase tracking-widest text-white/60">
                  {t("pricing.modal.customizeToggle")}
                </span>
              </label>

              {customize && (
                <div>
                  <label className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2">
                    {t("pricing.modal.priceLabel")}
                  </label>
                  <div className="flex items-center gap-2 border-b border-white/15 focus-within:border-primary">
                    <span className="text-white/40 text-base">€</span>
                    <input
                      type="number"
                      min={0}
                      step={50}
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      placeholder={String(plan.priceValue)}
                      className="w-full bg-transparent py-2.5 text-base text-white outline-none transition-all"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer hover:shadow-(--shadow-neon) transition-shadow duration-300 rounded-full py-3.5 px-6 font-mono-spec text-xs uppercase tracking-[0.3em] text-black text-center transition-opacity"
            style={{
              background: "var(--gradient-aura)",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading
              ? t("pricing.modal.btnLoading")
              : sent
                ? t("pricing.modal.btnSent")
                : t("pricing.modal.btnIdle")}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
