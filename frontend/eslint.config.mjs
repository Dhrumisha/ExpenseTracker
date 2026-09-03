import { defineConfig, globalIgnores } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";

// eslint-config-next still ships its "next/core-web-vitals" and
// "next/typescript" presets in the legacy eslintrc format, so they're
// bridged into this flat config via FlatCompat rather than imported directly.
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const eslintConfig = defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Disable `any` rule
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/set-state-in-effect": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },

  // Override default ignores of eslint-config-next
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
