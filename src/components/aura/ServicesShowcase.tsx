"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { useIsDesktopViewport } from "@/hooks/use-desktop-viewport";
import { SplineScene } from "./SplineScene";

// The eye-tracking robot. Passed explicitly because SplineScene's default is
// the scene used by the full-screen Services section further up the page —
// this row keeps its own.
const ROBOT_SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary mb-4">
      {children}
    </p>
  );
}

function RowHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white mb-4">
      {children}
    </h3>
  );
}

/**
 * Three alternating service rows, each its own spotlit dark card — the
 * showcase for what we actually build. Row 1's right-hand panel is the
 * eye-tracking robot Spline scene. Rows 2 and 3 use lightweight custom
 * widgets (no WebGL) so the section doesn't turn into three heavy 3D
 * canvases.
 */
export function ServicesShowcase() {
  const { t } = useTranslation();
  // The robot below is a Spline scene: ~2 MB of runtime, a WASM module and the
  // scene file itself. It was rendered unconditionally, so a phone downloaded
  // all of it — a second full Spline payload on top of the one the Services
  // section was already (wrongly) loading — for a decorative panel that is
  // framed for a wide viewport and reads as a cropped smear on a narrow one.
  const isDesktop = useIsDesktopViewport();

  return (
    <div className="mt-20 space-y-8">
      {/* Row 1 — text left, 3D robot right (desktop only) */}
      <Card className="relative w-full bg-black/[0.96] overflow-hidden rounded-3xl border border-white/10 md:h-[560px]">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
        <div className="flex flex-col md:flex-row h-full">
          <div className="flex-1 p-8 md:p-14 relative z-10 flex flex-col justify-center">
            <RowLabel>{t("services3d.label", "Pagine ed esperienze 3D")}</RowLabel>
            <RowHeading>{t("services3d.title", "Ingegneria 3D, non decorazione.")}</RowHeading>
            <p className="text-white/55 max-w-md">
              {t(
                "services3d.paragraph",
                "Sviluppiamo scene tridimensionali interattive su misura, integrate nel codice sorgente e ottimizzate per ogni dispositivo. Ogni elemento risponde con precisione ai movimenti dell'utente, trasformando il tuo sito in un'esperienza che comunica competenza tecnica prima ancora che il visitatore legga una singola riga.",
              )}
            </p>
          </div>
          {/* Gated on `=== true`, not `!== false`: rendering <SplineScene> for
              even the single pass before the media query is measured is enough
              to register its runtime pre-warm, which then fires later whether
              or not the component is still mounted. On mobile the panel is
              simply dropped and the copy takes the full card. */}
          {isDesktop === true && (
            <div className="flex-1 relative min-h-70">
              <SplineScene scene={ROBOT_SCENE} className="absolute inset-0" />
            </div>
          )}
        </div>
      </Card>

      {/* Row 2 — animation left, text right */}
      <Card className="relative w-full min-h-[420px] md:h-[480px] bg-black/[0.96] overflow-hidden rounded-3xl border border-white/10">
        <Spotlight className="-top-40 right-0 md:right-60 md:-top-20" fill="white" />
        <div className="flex flex-col-reverse md:flex-row h-full">
          <div className="flex-1 relative min-h-[280px] flex items-center justify-center p-8">
            <SeoIllustration />
          </div>
          <div className="flex-1 p-8 md:p-14 relative z-10 flex flex-col justify-center md:text-right md:items-end">
            <RowLabel>{t("servicesSeo.label", "SEO & Performance")}</RowLabel>
            <RowHeading>{t("servicesSeo.title", "Architettura tecnica, non estetica.")}</RowHeading>
            <p className="text-white/55 max-w-md">
              {t(
                "servicesSeo.paragraph",
                "Applichiamo una metodologia SEO tecnica rigorosa fin dalla struttura del codice: markup semantico, Core Web Vitals monitorati e ottimizzazione dei tempi di caricamento. Il risultato è un sito che i motori di ricerca comprendono e posizionano, non solo che gli utenti ammirano.",
              )}
            </p>
          </div>
        </div>
      </Card>

      {/* Row 3 — text left, animation right */}
      <Card className="relative w-full min-h-[420px] md:h-[480px] bg-black/[0.96] overflow-hidden rounded-3xl border border-white/10">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
        <div className="flex flex-col md:flex-row h-full">
          <div className="flex-1 p-8 md:p-14 relative z-10 flex flex-col justify-center">
            <RowLabel>{t("servicesPrivacy.label", "Privacy & Cookie Compliance")}</RowLabel>
            <RowHeading>
              {t("servicesPrivacy.title", "Conformità normativa, non un'opzione.")}
            </RowHeading>
            <p className="text-white/55 max-w-md">
              {t(
                "servicesPrivacy.paragraph",
                "Integriamo gestione del consenso, informativa privacy e configurazione GDPR in ogni progetto secondo gli standard richiesti dalla normativa vigente. Il tuo sito è conforme dal giorno del lancio, con una base solida che tutela te e i tuoi utenti.",
              )}
            </p>
          </div>
          <div className="flex-1 relative min-h-[280px] flex items-center justify-center p-8">
            <PrivacyIllustration />
          </div>
        </div>
      </Card>
    </div>
  );
}

function SeoIllustration() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.92, y: inView ? 0 : 16 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[280px] md:max-w-xs"
    >
      {/* Not next/image, deliberately. This is an SMIL-animated SVG: the
          optimizer has nothing to do to a vector file, and routing it through
          /_next/image would require dangerouslyAllowSVG (which exists because
          serving arbitrary SVG from an image endpoint is an XSS vector) to end
          up serving the identical bytes. It is gzipped on the wire and sits
          well below the fold. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/services/data-extraction.svg"
        alt="Illustrazione di estrazione ed elaborazione dati per SEO e performance"
        loading="lazy"
        decoding="async"
        className="w-full h-auto"
      />
    </motion.div>
  );
}

function PrivacyIllustration() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.92, y: inView ? 0 : 16 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[280px] md:max-w-xs"
    >
      {/* Source illustration is a raster asset with its own color palette —
          grayscale + contrast pulls it into the site's monochrome theme
          instead of leaving its original colors in. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- animated SVG; see above */}
      <img
        src="/services/password-authentication.svg"
        alt="Illustrazione di autenticazione e protezione dei dati"
        loading="lazy"
        decoding="async"
        className="w-full h-auto grayscale contrast-125 brightness-110"
      />
    </motion.div>
  );
}
