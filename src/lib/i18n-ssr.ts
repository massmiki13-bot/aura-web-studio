import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { resources, DEFAULT_LANGUAGE, type LanguageCode } from "@/i18n";

/**
 * Creates a fresh i18next instance scoped to a single request/navigation,
 * instead of mutating the shared default instance from src/i18n. That
 * shared instance is a module-level singleton — calling changeLanguage()
 * on it per-request would race across concurrent SSR requests (e.g. a
 * German visitor and an Italian visitor hitting the server at the same
 * time) and could serve one visitor's language to the other.
 */
export function createScopedI18n(locale: LanguageCode) {
  const instance = i18next.createInstance();
  // resources are passed directly (no backend plugin, nothing to fetch), so
  // init() populates the instance synchronously — t() works immediately
  // without awaiting the returned promise.
  instance.use(initReactI18next).init({
    resources,
    lng: locale,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
  return instance;
}
