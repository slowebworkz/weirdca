# @repo/eslint-config

Shared ESLint configurations for the WeirdCA monorepo. Uses ESLint 9 flat config format.

## Exported configs

| Export                               | File                | Used by        | Description                                                                                                                           |
| ------------------------------------ | ------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `@repo/eslint-config/base`           | `base.js`           | —              | TypeScript + Prettier + import-x + unicorn + promise + JSON + Turbo. All errors downgraded to warnings via `eslint-plugin-only-warn`. |
| `@repo/eslint-config/next-js`        | `next.js`           | `apps/web`     | Extends `base` + React + React Hooks + JSX a11y + `@next/eslint-plugin-next` (recommended + core-web-vitals).                         |
| `@repo/eslint-config/node`           | `node.js`           | `apps/scraper` | Extends `base` + Node.js-specific rules (`eslint-plugin-n`).                                                                          |
| `@repo/eslint-config/react-internal` | `react-internal.js` | `packages/ui`  | Extends `base` + React + React Hooks + JSX a11y + browser globals. For React libraries that don't use Next.js.                        |

## Internal modules (`lib/`)

The top-level configs are composed from reusable fragments in `lib/`, exported via `lib/index.js`:

| Module              | Export             | Contents                                                                                                                                         |
| ------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `lib/typescript.js` | `typescriptConfig` | `@eslint/js` recommended, `typescript-eslint` recommended, `eslint-config-prettier`                                                              |
| `lib/import.js`     | `importConfig`     | `eslint-plugin-import-x` recommended with built-in Node resolver                                                                                 |
| `lib/unicorn.js`    | `unicornConfig`    | `eslint-plugin-unicorn` recommended (with opinionated rules relaxed)                                                                             |
| `lib/promise.js`    | `promiseConfig`    | `eslint-plugin-promise` recommended                                                                                                              |
| `lib/json.js`       | `jsonConfig`       | `@eslint/json` recommended for `**/*.json` files                                                                                                 |
| `lib/turbo.js`      | `turboConfig`      | `eslint-plugin-turbo`, `eslint-plugin-only-warn`, `dist/**` ignores. **Must be last** — `only-warn` downgrades all preceding errors to warnings. |
| `lib/react.js`      | `reactConfig`      | `eslint-plugin-react` (flat), `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, serviceworker globals                                       |
| `lib/next.js`       | `nextConfig`       | `@next/eslint-plugin-next` (recommended + core-web-vitals), Next.js framework ignores                                                            |
| `lib/node.js`       | `nodeConfig`       | `eslint-plugin-n` recommended (scoped to non-JSX files)                                                                                          |

## Type declarations

- `base.d.ts` — Types for `base.js` export
- `next.d.ts` — Types for `next.js` export
- `node.d.ts` — Types for `node.js` export
- `react-internal.d.ts` — Types for `react-internal.js` export
- `only-warn.d.ts` — Module declaration for `eslint-plugin-only-warn` (no built-in types)

## Dependencies

All plugins are pinned to ESLint 9 compatible versions. ESLint 10 is **not yet supported** due to incompatibilities with `eslint-plugin-react`.

## Usage

In a consumer's `eslint.config.js`:

```js
/** @type {import("eslint").Linter.Config[]} */
export { config as default } from "@repo/eslint-config/base";
```

```js
/** @type {import("eslint").Linter.Config[]} */
export { nextJsConfig as default } from "@repo/eslint-config/next-js";
```

```js
/** @type {import("eslint").Linter.Config[]} */
export { config as default } from "@repo/eslint-config/node";
```

```js
/** @type {import("eslint").Linter.Config[]} */
export { config as default } from "@repo/eslint-config/react-internal";
```
