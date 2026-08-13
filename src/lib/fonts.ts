import localFont from "next/font/local";

/**
 * The two typefaces that are on screen at first paint.
 *
 * They used to be declared by hand in styles.css with a matching pair of
 * <link rel="preload"> tags in the document head — two places to keep in step,
 * and a preload list that was right only for the home page. next/font hashes
 * the files into the build output, emits the @font-face itself, and injects a
 * preload for exactly the faces a given route actually renders. Nothing to
 * keep in sync, and no font preloaded on a page that never uses it.
 *
 * Both are exposed as CSS variables rather than by family name: the generated
 * family is hashed, so the stylesheet has to reach them indirectly (see the
 * `font-family: var(--font-*)` rules in styles.css).
 *
 * `adjustFontFallback` is left on (the default). It measures the real face and
 * derives a size-adjusted local fallback, so the swap from fallback to webfont
 * doesn't reflow the line — which matters most for the hero wordmark, the
 * home page's LCP element and by far the largest text on the site.
 *
 * JetBrains Mono is deliberately *not* here. It sets small spec labels only,
 * it is never on the critical path, and it is served in two unicode-range
 * slices so the latin-ext file downloads only when a page needs a character
 * from that range — a split next/font's `src` array has no way to express.
 * It stays a hand-written @font-face in styles.css, exactly as it was.
 *
 * Licensing: Clash Display and Satoshi are Indian Type Foundry releases under
 * the ITF Free Font License. See src/fonts/LICENSES.md.
 */

export const fontDisplay = localFont({
  src: "../fonts/ClashDisplay-Variable.woff2",
  weight: "200 700",
  style: "normal",
  // The hero wordmark is the LCP element; better to paint it in the fallback
  // for a beat than to hold the page on an invisible glyph.
  display: "swap",
  variable: "--font-display",
  fallback: ["Satoshi", "system-ui", "sans-serif"],
});

export const fontSans = localFont({
  src: [
    { path: "../fonts/Satoshi-Variable.woff2", weight: "300 900", style: "normal" },
    { path: "../fonts/Satoshi-VariableItalic.woff2", weight: "300 900", style: "italic" },
  ],
  display: "swap",
  variable: "--font-sans",
  fallback: ["system-ui", "sans-serif"],
});
