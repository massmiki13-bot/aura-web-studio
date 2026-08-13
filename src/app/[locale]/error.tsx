"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * The page-level error boundary.
 *
 * Deliberately the last line of defence rather than the first: every
 * decorative WebGL layer on this site is already wrapped in a CanvasBoundary
 * that drops just that layer, so a lost GPU context never reaches here. What
 * does reach here is a genuine render failure, and the honest response to that
 * is a page that says so and offers a way out — not a blank screen.
 */
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Questa pagina non si è caricata
        </h1>
        <p className="mt-3 text-sm leading-relaxed font-light text-white/60">
          Qualcosa è andato storto da parte nostra. Puoi riprovare o tornare alla home.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={reset}
            className="font-mono-spec inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-xs font-medium tracking-[0.25em] text-black uppercase transition-colors hover:bg-white/90"
          >
            Riprova
          </button>
          <Link
            href="/"
            className="font-mono-spec inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-4 text-xs tracking-[0.25em] text-white/80 uppercase transition-colors hover:border-white/40 hover:text-white"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
