import { config as baseConfig } from "./base.js";
import { reactConfig, nextConfig } from "./lib/index.js";

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nextJsConfig = [...baseConfig, ...reactConfig, ...nextConfig];
