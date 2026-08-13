/**
 * Generates all SEO/PWA image assets from inline SVG sources.
 * Run with: node scripts/generate-seo-assets.mjs
 *
 * Produces favicons (svg/ico/png), apple-touch-icon, maskable icon, logo and
 * the 1200x630 Open Graph share image into /public. Placeholder brand art —
 * swap the SVG sources below for real brand files when available.
 */
import { Resvg } from "@resvg/resvg-js";
import pngToIco from "png-to-ico";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const PUBLIC_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

const BG = "#080a0f";
const CYAN = "#22e3ff";
const BLUE = "#0a84ff";

/** Square brand monogram (logo + favicon source). `radius` controls corner rounding. */
function monogramSvg({ size = 512, radius = 112, padded = false } = {}) {
  // For maskable icons, shrink the mark into the safe zone (inner ~80%).
  const scale = padded ? 0.62 : 0.82;
  const off = (size - size * scale) / 2;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${CYAN}"/>
      <stop offset="1" stop-color="${BLUE}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.36" r="0.7">
      <stop offset="0" stop-color="${BLUE}" stop-opacity="0.45"/>
      <stop offset="1" stop-color="${BLUE}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" fill="${BG}"/>
  <rect width="${size}" height="${size}" rx="${radius}" fill="url(#glow)"/>
  <g transform="translate(${off} ${off}) scale(${scale})">
    <circle cx="256" cy="248" r="186" fill="none" stroke="url(#brand)" stroke-opacity="0.16" stroke-width="14"/>
    <path fill="url(#brand)" fill-rule="evenodd"
      d="M256 84 L392 430 L320 430 L296 366 L216 366 L192 430 L120 430 Z
         M256 214 L231 312 L281 312 Z"/>
  </g>
</svg>`;
}

/** 1200x630 Open Graph / Twitter share card. */
function ogSvg() {
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${CYAN}"/>
      <stop offset="1" stop-color="${BLUE}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.22" cy="0.2" r="0.9">
      <stop offset="0" stop-color="${BLUE}" stop-opacity="0.4"/>
      <stop offset="1" stop-color="${BLUE}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${BG}"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="1" y="1" width="1198" height="628" fill="none" stroke="url(#brand)" stroke-opacity="0.12" stroke-width="2"/>
  <g transform="translate(96 150)">
    <g transform="scale(0.62)">
      <circle cx="256" cy="248" r="186" fill="none" stroke="url(#brand)" stroke-opacity="0.16" stroke-width="14"/>
      <path fill="url(#brand)" fill-rule="evenodd"
        d="M256 84 L392 430 L320 430 L296 366 L216 366 L192 430 L120 430 Z
           M256 214 L231 312 L281 312 Z"/>
    </g>
  </g>
  <g font-family="Arial, Helvetica, sans-serif">
    <text x="370" y="250" fill="${CYAN}" font-size="26" letter-spacing="6" font-weight="600">// CREATIVE DIGITAL SOLUTIONS</text>
    <text x="368" y="345" fill="#ffffff" font-size="84" font-weight="700">Aura Web Studio</text>
    <text x="370" y="410" fill="#9aa7b5" font-size="34" font-weight="400">Cinematic web design &amp; development · Made in Italy</text>
  </g>
</svg>`;
}

function renderPng(svg, width) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    background: "rgba(0,0,0,0)",
  });
  return resvg.render().asPng();
}

async function out(name, buf) {
  await writeFile(join(PUBLIC_DIR, name), buf);
  console.log("  ✓", name);
}

async function main() {
  console.log("Generating SEO assets into /public:");

  // Vector sources
  await out("favicon.svg", Buffer.from(monogramSvg({ size: 512, radius: 96 })));
  await out("logo.svg", Buffer.from(monogramSvg({ size: 512, radius: 96 })));

  const baseSvg = monogramSvg({ size: 512, radius: 96 });
  const maskableSvg = monogramSvg({ size: 512, radius: 0, padded: true });

  // PNG favicons / PWA icons
  await out("favicon-16x16.png", renderPng(baseSvg, 16));
  await out("favicon-32x32.png", renderPng(baseSvg, 32));
  await out("favicon-192x192.png", renderPng(baseSvg, 192));
  await out("favicon-512x512.png", renderPng(baseSvg, 512));
  await out("favicon-192x192-maskable.png", renderPng(maskableSvg, 192));
  await out("favicon-512x512-maskable.png", renderPng(maskableSvg, 512));
  await out("apple-touch-icon.png", renderPng(monogramSvg({ size: 512, radius: 0 }), 180));
  await out("mstile-150x150.png", renderPng(monogramSvg({ size: 512, radius: 0 }), 150));

  // Multi-resolution .ico
  const ico = await pngToIco([
    renderPng(baseSvg, 16),
    renderPng(baseSvg, 32),
    renderPng(baseSvg, 48),
  ]);
  await out("favicon.ico", ico);

  // Open Graph share image
  await out("og-image.png", renderPng(ogSvg(), 1200));

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
