import { createNodeResolver, flatConfigs } from "eslint-plugin-import-x";

const JS_TS_FILES = ["**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}"];

/**
 * Import/export rules (eslint-plugin-import-x).
 *
 * Uses the built-in Node resolver with TypeScript support
 * instead of the separate eslint-import-resolver-typescript package.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const importConfig = [
  { ...flatConfigs.recommended, files: JS_TS_FILES },
  {
    files: JS_TS_FILES,
    settings: {
      "import-x/resolver-next": [createNodeResolver()],
    },
    rules: {
      "import-x/no-unresolved": "off",
    },
  },
];
