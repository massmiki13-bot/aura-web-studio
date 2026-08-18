import * as THREE from "three";

/**
 * The site's chrome material, as a matcap drawn procedurally on a canvas.
 *
 * A monochrome "studio softbox": a bright key reflection band, two thinner
 * fill bands, and a dark grazing-angle rim. Keeps every metal surface on the
 * page on one palette and ships no texture — the whole thing is a handful of
 * gradient fills at load.
 *
 * 256², not 512²: every stop is a wide radial or linear gradient, so there is
 * no detail above that resolution to lose — and a quarter of the texels is a
 * quarter of the sampler traffic on the one texture read each fragment makes.
 *
 * Lifted out of HeroChrome when the Spline scenes were replaced, so the hero's
 * blob and the services crystal are lit by the same light rather than two
 * approximations of it. Cached per module, because two scenes asking for it
 * should not draw two identical canvases — the texture is immutable and safe
 * to share across renderers.
 */
let cached: THREE.CanvasTexture | null = null;

export function getChromeMatcap(): THREE.CanvasTexture {
  if (cached) return cached;

  const size = 256;
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const g = cv.getContext("2d")!;

  const base = g.createRadialGradient(
    size * 0.38,
    size * 0.34,
    size * 0.05,
    size * 0.5,
    size * 0.5,
    size * 0.62,
  );
  base.addColorStop(0, "#e8eaee");
  base.addColorStop(0.3, "#8b8e96");
  base.addColorStop(0.62, "#26272c");
  base.addColorStop(1, "#020203");
  g.fillStyle = base;
  g.fillRect(0, 0, size, size);

  g.save();
  g.translate(size / 2, size / 2);
  g.rotate(-0.55);
  const band = (y: number, h: number, alpha: number) => {
    const grad = g.createLinearGradient(0, y - h / 2, 0, y + h / 2);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.5, `rgba(255,255,255,${alpha})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(-size, y - h / 2, size * 2, h);
  };
  band(-size * 0.27, size * 0.16, 0.9);
  band(-size * 0.02, size * 0.07, 0.45);
  band(size * 0.18, size * 0.05, 0.22);
  g.restore();

  const rim = g.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.36,
    size / 2,
    size / 2,
    size * 0.5,
  );
  rim.addColorStop(0, "rgba(0,0,0,0)");
  rim.addColorStop(0.75, "rgba(0,0,0,0.25)");
  rim.addColorStop(1, "rgba(0,0,0,0.82)");
  g.fillStyle = rim;
  g.fillRect(0, 0, size, size);

  cached = new THREE.CanvasTexture(cv);
  cached.colorSpace = THREE.SRGBColorSpace;
  return cached;
}

/**
 * Matcap lookup plus a fresnel lift, shared by every chrome surface here.
 *
 * `vNormal` and `vViewDir` are the varyings each vertex shader is expected to
 * provide. The slight cool tint on the last line is what keeps the metal from
 * reading as plain grey against a pure black page.
 */
export const CHROME_FRAGMENT_BODY = /* glsl */ `
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vViewDir);
  vec2 muv = n.xy * 0.48 + 0.5;
  vec3 col = texture2D(uMatcap, muv).rgb;
  float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
  col += fres * 0.38;
  col *= vec3(0.94, 0.96, 1.04);
`;
