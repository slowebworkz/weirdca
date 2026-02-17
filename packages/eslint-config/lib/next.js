import { globalIgnores } from "eslint/config";
import pluginNext from "@next/eslint-plugin-next";

/**
 * Next.js plugin rules + framework-specific ignores.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nextConfig = [
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
];
