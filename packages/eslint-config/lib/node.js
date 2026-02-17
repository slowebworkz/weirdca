import eslintPluginN from "eslint-plugin-n";

/**
 * Node.js-specific rules (only for server-side apps).
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nodeConfig = [
  {
    ...eslintPluginN.configs["flat/recommended"],
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    rules: {
      ...eslintPluginN.configs["flat/recommended"].rules,
      "n/no-missing-import": "off",
    },
  },
];
