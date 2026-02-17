import eslintPluginPromise from "eslint-plugin-promise";

/**
 * Promise / async best-practice rules.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const promiseConfig = [
  {
    ...eslintPluginPromise.configs["flat/recommended"],
    files: ["**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}"],
  },
];
