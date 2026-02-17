import globals from "globals";
import { config as baseConfig } from "./base.js";
import { reactConfig } from "./lib/index.js";

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  ...baseConfig,
  ...reactConfig,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];
