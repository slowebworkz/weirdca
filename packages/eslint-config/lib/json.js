import json from "@eslint/json";

/**
 * JSON file linting.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const jsonConfig = [
  {
    ...json.configs.recommended,
    files: ["**/*.json"],
    language: "json/json",
  },
];
