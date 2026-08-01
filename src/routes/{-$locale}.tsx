import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { useMemo } from "react";
import { I18nextProvider } from "react-i18next";
import { LANGUAGES, DEFAULT_LANGUAGE, type LanguageCode } from "@/i18n";
import { createScopedI18n } from "@/lib/i18n-ssr";

// "it" lives unprefixed at the bare paths (/, /pricing, ...) — reject an
// explicit /it/ prefix so there's never a duplicate URL for the same content.
const PREFIXED_LANGUAGES = LANGUAGES.filter((l) => l.code !== DEFAULT_LANGUAGE).map((l) => l.code);

export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: ({ params }) => {
    if (
      params.locale !== undefined &&
      !PREFIXED_LANGUAGES.includes(params.locale as LanguageCode)
    ) {
      throw notFound();
    }
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const { locale } = Route.useParams();
  const activeLocale = (locale as LanguageCode | undefined) ?? DEFAULT_LANGUAGE;
  // A fresh instance per render (server request or client navigation) — not
  // the shared default instance, so concurrent SSR requests in different
  // languages can't race each other. See i18n-ssr.ts. Built here (not in
  // beforeLoad) because route context is serialized for hydration and a live
  // i18next instance isn't serializable.
  const i18nInstance = useMemo(() => createScopedI18n(activeLocale), [activeLocale]);
  return (
    <I18nextProvider i18n={i18nInstance}>
      <Outlet />
    </I18nextProvider>
  );
}
