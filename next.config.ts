import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Nothing gained by telling the world what the server runs on.
  poweredByHeader: false,

  turbopack: {
    // Pinned, because Turbopack infers the workspace root from the nearest
    // lockfile and there is a stray package-lock.json in the user's home
    // directory — outside this repository entirely. Left to infer, it warns
    // on every start and could resolve modules from the wrong tree.
    root: import.meta.dirname,
  },

  images: {
    // AVIF first, WebP behind it. Every image on this site is either a dark
    // photographic project shot or a screenshot — both are exactly the content
    // AVIF compresses hardest, and the ones that regress fall back to WebP.
    formats: ["image/avif", "image/webp"],
    // The layout tops out at a 3-up project grid inside a max-w container, so
    // there is no viewport at which a full 3840px variant is ever selected.
    // Trimming the ladder means fewer variants to generate and cache.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Project shots and team photos are content, not user input, and they
    // change only when the repo does.
    minimumCacheTTL: 31536000,
  },

  // Barrel files re-export everything; importing one icon from lucide-react
  // pulls the whole index into the module graph and leaves tree-shaking to
  // undo it. This rewrites those imports to deep paths at compile time, which
  // is both smaller and much faster to bundle.
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "@react-three/drei"],
  },

  async headers() {
    return [
      {
        // Fonts and the hashed build output are immutable by construction:
        // both are content-addressed, so a change ships under a new URL.
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          // Fonts are fetched in CORS mode even same-origin.
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // No feature on this site needs any of these.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
