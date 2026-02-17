import { config as baseConfig } from "./base.js";
import { nodeConfig } from "./lib/index.js";

/**
 * A custom ESLint configuration for Node.js apps (e.g. scraper).
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [...baseConfig, ...nodeConfig];
