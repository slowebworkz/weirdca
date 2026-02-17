import eslintPluginUnicorn from "eslint-plugin-unicorn";

/**
 * Unicorn best-practice rules.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const unicornConfig = [
  {
    ...eslintPluginUnicorn.configs.recommended,
    files: ["**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}"],
    rules: {
      ...eslintPluginUnicorn.configs.recommended.rules,
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-null": "off",
      "unicorn/filename-case": "off",
      "unicorn/prefer-top-level-await": "off",
      "unicorn/import-style": "off",
    },
  },
];
