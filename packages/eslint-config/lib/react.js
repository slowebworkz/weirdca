import jsxA11y from "eslint-plugin-jsx-a11y";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

const JSX_FILES = ["**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}"];

/**
 * React + React Hooks + JSX a11y shared config.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const reactConfig = [
  {
    ...pluginReact.configs.flat.recommended,
    files: JSX_FILES,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
      },
    },
  },
  {
    ...pluginReact.configs.flat["jsx-runtime"],
    files: JSX_FILES,
  },
  {
    files: JSX_FILES,
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    settings: { react: { version: "detect", defaultVersion: "19" } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
    },
  },
  {
    ...jsxA11y.flatConfigs.recommended,
    files: JSX_FILES,
  },
];
