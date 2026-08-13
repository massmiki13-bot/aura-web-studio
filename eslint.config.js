import js from "@eslint/js";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // `.vercel` matters: it holds build output, and left unignored ESLint walks
  // into a 1.7 MB bundled copy of three.js and takes minutes to fail.
  { ignores: [".next", ".vercel", "out", "next-env.d.ts", "node_modules"] },
  // eslint-config-next 16 ships flat config, so this is a direct import —
  // no eslintrc compat bridge. It carries the rules that catch exactly the
  // mistakes this migration could reintroduce: <img> where next/image
  // belongs, <a> for internal navigation, sync scripts on the critical path.
  ...nextCoreWebVitals,
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      // The site's copy is Italian, German and Spanish, where the apostrophe
      // is a letter-level part of ordinary words — "l'agenzia", "dell'ospite".
      // The rule exists to catch a stray quote that was meant to be markup;
      // here it fires on correct prose eighteen times and would have the
      // translations written as &apos; entities to satisfy it.
      "react/no-unescaped-entities": "off",
    },
  },
  {
    /**
     * The animation layer, held to a different standard on three rules.
     *
     * These are React Compiler rules, and they are right about ordinary
     * components: mutating a value after render, or setting state straight
     * out of an effect, is usually a bug. Every file listed here is instead
     * an imperative render loop — R3F's useFrame, a raw requestAnimationFrame,
     * a GSAP timeline — where writing to a mesh's rotation or a uniform's
     * value *is* the API, and doing it through state would mean a React
     * render per frame at 60fps. The `set-state-in-effect` reports are the
     * same shape: a capability measured on mount (viewport class, GPU tier,
     * boot gate) and published once.
     *
     * Scoped to these paths on purpose, so the rules keep working everywhere
     * a normal component might genuinely get this wrong.
     */
    files: ["src/components/aura/**", "src/components/ui/**", "src/lib/overlay-root.ts"],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  eslintPluginPrettier,
);
