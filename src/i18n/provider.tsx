"use client";

import { useMemo, type ReactNode } from "react";
import i18next from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { resources, DEFAULT_LANGUAGE, type LanguageCode } from "@/i18n";

/**
 * A fresh i18next instance per locale, never the library's shared default.
 *
 * That default is a module-level singleton, and calling changeLanguage() on it
 * is a process-wide mutation: two SSR requests in different languages arriving
 * in the same tick would race through it and one visitor could be served the
 * other's language. Building an instance here removes the shared state
 * entirely — it belongs to this subtree and nothing else can reach it.
 *
 * Memoised on `locale`, so a client-side navigation within one language reuses
 * the instance and only a genuine language change rebuilds it.
 *
 * The resources are passed inline with no backend plugin, so init() is
 * synchronous — t() works on the first render, with no suspense boundary and
 * no untranslated flash between the server's HTML and hydration.
 */
export function I18nProvider({ locale, children }: { locale: LanguageCode; children: ReactNode }) {
  const instance = useMemo(() => {
    const i18n = i18next.createInstance();
    i18n.use(initReactI18next).init({
      resources,
      lng: locale,
      fallbackLng: DEFAULT_LANGUAGE,
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
    return i18n;
  }, [locale]);

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
