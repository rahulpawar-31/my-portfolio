import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    // Prisma client output: generated code, not ours to lint.
    "src/generated/**",
  ]),
  {
    // CommonJS files run outside the bundler (Node scripts, PostCSS/Tailwind config).
    files: ["prisma/**/*.js", "*.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    // The `mounted` hydration guard and the typing-animation state machine rely on
    // setState in an effect; keep the rule visible as a warning instead of failing CI.
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
