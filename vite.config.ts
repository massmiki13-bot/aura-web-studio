// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite"; // 1. Import Nitro

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // 2. Inject the Vercel compilation engine here
  vite: {
    plugins: [
      nitro({
        preset: "vercel",
      }),
    ],
    // @react-three/drei is only reachable through a lazily-split route chunk
    // (VolumetricStudio), so Vite's cold-start dep scanner never sees it and
    // instead discovers + optimizes it "on demand" on first request — which
    // races with that same request and 404s on the freshly-hashed dep file.
    // Pre-declaring it here makes it part of the initial optimize run instead.
    // (Deep imports only — the drei barrel breaks esbuild pre-bundling here.)
    optimizeDeps: {
      include: ["@react-three/fiber", "@react-three/drei/core/SpotLight", "three"],
    },
  },
});
