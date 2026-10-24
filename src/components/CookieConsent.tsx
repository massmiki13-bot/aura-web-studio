"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/seo";

/**
 * Cookie consent, and the only place the Google tag is loaded from.
 *
 * Google Analytics / Google Ads are not technical cookies, so under the GDPR
 * and the Garante's 2021 cookie guidelines they may not run before the visitor
 * says yes. This is "basic" consent mode: until the choice is "granted" the
 * tag is not even requested, so nothing reaches Google from a visitor who
 * ignores or rejects the banner.
 *
 * The choice lives in localStorage with a timestamp and expires after six
 * months, which is the minimum interval the Garante allows before asking again.
 */

const GA_ID = "G-CB7FGKKMX8";
const STORAGE_KEY = "aura-cookie-consent";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 180;
const OPEN_EVENT = "aura:cookie-preferences";
const CHANGE_EVENT = "aura:cookie-consent-change";

type Choice = "granted" | "denied";

export const COOKIE_UI: Record<
  Locale,
  { title: string; text: string; policy: string; accept: string; reject: string; prefs: string }
> = {
  it: {
    title: "Cookie",
    text: "Usiamo cookie tecnici, necessari al funzionamento del sito, e — solo se accetti — cookie di Google Analytics e Google Ads per misurare le visite e l'efficacia dei nostri annunci. Puoi cambiare idea quando vuoi da «Preferenze cookie» in fondo alla pagina.",
    policy: "Privacy e Cookie Policy",
    accept: "Accetta",
    reject: "Rifiuta",
    prefs: "Preferenze cookie",
  },
  de: {
    title: "Cookies",
    text: "Wir verwenden technisch notwendige Cookies und – nur mit Ihrer Zustimmung – Cookies von Google Analytics und Google Ads, um Besuche und die Wirkung unserer Anzeigen zu messen. Ihre Wahl können Sie jederzeit über „Cookie-Einstellungen“ unten auf der Seite ändern.",
    policy: "Datenschutzerklärung (IT)",
    accept: "Akzeptieren",
    reject: "Ablehnen",
    prefs: "Cookie-Einstellungen",
  },
  en: {
    title: "Cookies",
    text: "We use technical cookies the site needs to work and — only if you accept — Google Analytics and Google Ads cookies to measure visits and how our ads perform. You can change your mind at any time via “Cookie preferences” at the bottom of the page.",
    policy: "Privacy & Cookie Policy (IT)",
    accept: "Accept",
    reject: "Reject",
    prefs: "Cookie preferences",
  },
  es: {
    title: "Cookies",
    text: "Usamos cookies técnicas, necesarias para el funcionamiento del sitio, y —solo si aceptas— cookies de Google Analytics y Google Ads para medir las visitas y la eficacia de nuestros anuncios. Puedes cambiar tu elección cuando quieras desde «Preferencias de cookies» al pie de la página.",
    policy: "Política de privacidad y cookies (IT)",
    accept: "Aceptar",
    reject: "Rechazar",
    prefs: "Preferencias de cookies",
  },
};

/** Reopens the banner; used by the "Cookie preferences" link in the footer. */
export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

// Fallback for browsers that block storage: the choice holds for this visit.
let memoryChoice: Choice | null = null;

function readChoice(): Choice | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return memoryChoice;
    const { v, t } = JSON.parse(raw) as { v: Choice; t: number };
    if ((v !== "granted" && v !== "denied") || Date.now() - t > MAX_AGE_MS) return null;
    return v;
  } catch {
    return memoryChoice;
  }
}

function writeChoice(v: Choice) {
  memoryChoice = v;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v, t: Date.now() }));
  } catch {
    // Storage blocked: memoryChoice covers the rest of this visit.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Removes the cookies the Google tag set, on this host and on the apex domain. */
function clearGoogleCookies() {
  const host = location.hostname;
  const domains = ["", host, `.${host.replace(/^www\./, "")}`];
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim();
    if (!/^(_ga|_gid|_gat|_gcl)/.test(name)) continue;
    for (const d of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
    }
  }
}

export function CookieConsent({ locale }: { locale: Locale }) {
  // `undefined` on the server and during hydration: the server cannot know
  // the choice, and rendering nothing until then keeps hydration clean.
  const choice = useSyncExternalStore<Choice | null | undefined>(
    subscribe,
    readChoice,
    () => undefined,
  );
  const [reopened, setReopened] = useState(false);
  const open = choice === null || reopened;

  useEffect(() => {
    const reopen = () => setReopened(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  const decide = (v: Choice) => {
    const wasGranted = choice === "granted";
    writeChoice(v);
    setReopened(false);
    if (wasGranted && v === "denied") {
      // A loaded gtag cannot be unloaded; drop its cookies and start clean.
      clearGoogleCookies();
      location.reload();
    }
  };

  const ui = COOKIE_UI[locale];

  return (
    <>
      {choice === "granted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}

      {open && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label={ui.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-4 bottom-4 z-[80] rounded-[1.25rem] border border-white/10 bg-neutral-950/95 p-5 text-white shadow-2xl backdrop-blur-md md:inset-x-auto md:right-6 md:bottom-6 md:max-w-md md:p-6"
        >
          <p className="font-mono-spec text-[10px] uppercase tracking-[0.25em] text-white/50">
            {ui.title}
          </p>
          <p className="mt-3 text-sm leading-relaxed font-light text-white/65">
            {ui.text}{" "}
            <Link
              href="/privacy"
              className="text-white/85 underline underline-offset-2 hover:text-primary"
            >
              {ui.policy}
            </Link>
          </p>
          {/* Same size, same weight: rejecting must be as easy as accepting. */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => decide("denied")}
              className="font-mono-spec cursor-pointer rounded-full border border-white/20 px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-white/50"
            >
              {ui.reject}
            </button>
            <button
              type="button"
              onClick={() => decide("granted")}
              className="font-mono-spec cursor-pointer rounded-full border border-white/20 px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-white/50"
            >
              {ui.accept}
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
