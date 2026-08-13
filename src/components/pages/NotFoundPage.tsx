import Link from "next/link";

/**
 * The 404 body, shared by the two places Next can produce one.
 *
 * app/[locale]/not-found.tsx catches an explicit notFound() raised inside the
 * locale segment — an unknown locale, a page that opts out for a language —
 * and renders inside the normal layout. app/global-not-found.tsx catches a URL
 * that matched no route at all, where there is no layout to render inside and
 * the document has to be built from scratch. Same page either way; only the
 * shell around it differs.
 */
export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="max-w-md text-center">
        <p
          aria-hidden
          className="font-display text-[28vw] leading-[0.8] font-semibold tracking-tighter text-white/10 select-none md:text-[12rem]"
        >
          404
        </p>
        <h1 className="font-display mt-6 text-2xl font-semibold tracking-tight">
          Pagina non trovata
        </h1>
        <p className="mt-3 text-sm leading-relaxed font-light text-white/60">
          L&apos;indirizzo che hai aperto non esiste o è stato spostato.
        </p>
        <Link
          href="/"
          className="font-mono-spec mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-xs font-medium tracking-[0.25em] text-black uppercase transition-colors hover:bg-white/90"
        >
          Torna alla home
        </Link>
      </div>
    </main>
  );
}
