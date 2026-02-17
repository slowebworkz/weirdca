import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

const JS_TS_FILES = ["**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}"];

/**
 * TypeScript + Prettier base rules.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const typescriptConfig = [
  { ...js.configs.recommended, files: JS_TS_FILES },
  { ...eslintConfigPrettier, files: JS_TS_FILES },
  ...tseslint.configs.recommended.map((cfg) => ({ ...cfg, files: JS_TS_FILES })),
];
