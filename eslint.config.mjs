import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated / vendored output that is not our source.
    ".open-next/**",
    ".wrangler/**",
    "node_modules/**",
    "mocks/**",
    "scripts/**",
  ]),
  {
    rules: {
      // Idiomatic `catch (error)` without using the binding is fine; still flag
      // genuinely unused vars/args (allow an explicit _ opt-out).
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { caughtErrors: "none", argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Plain <img> is a deliberate choice until Cloudflare Images is enabled and
      // a next/image migration is validated on Workers (see README). The a11y
      // alt-text rule stays on. Progressive typing: keep `any` as a warning.
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);

export default eslintConfig;
