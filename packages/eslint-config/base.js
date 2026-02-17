import {
  importConfig,
  jsonConfig,
  promiseConfig,
  turboConfig,
  typescriptConfig,
  unicornConfig,
} from "./lib/index.js";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  ...typescriptConfig,
  ...importConfig,
  ...unicornConfig,
  ...promiseConfig,
  ...jsonConfig,
  ...turboConfig,
];
