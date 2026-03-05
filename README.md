# WeirdCA

A ground-up rewrite of [weirdca.com](https://www.weirdca.com) — a guide to strange, offbeat, and unconventional attractions across California. The original site is a legacy PHP application; this project rebuilds it as a modern, statically-driven web app using Next.js, with a custom scraper to preserve the existing content.

## What it is

The site lets visitors browse weird California attractions by location, category, county, and city. A random redirect lets you discover something unexpected. Search and an interactive map are planned.

Data is collected from the live weirdca.com site by the scraper and stored as JSON, which the web app reads at build time and runtime.

## Monorepo structure

This is a **pnpm + Turborepo** monorepo:

```
apps/
  web/       — Next.js 16 frontend (App Router, React 19, Tailwind CSS 4)
  scraper/   — Node.js scraper (Cheerio) that collects data from weirdca.com

packages/
  ui/                — Shared React component library
  types/             — Shared TypeScript interfaces (Location, Category, County, …)
  messages/          — i18n message files (next-intl)
  eslint-config/     — Shared ESLint 9 flat configs (base, next-js, node, react-internal)
  typescript-config/ — Shared tsconfig presets (base, nextjs, react-library)
  prettier-config/   — Shared Prettier configs
```

## Tech stack

| Layer         | Choice                                             |
| ------------- | -------------------------------------------------- |
| Framework     | Next.js 16 (App Router)                            |
| UI primitives | `@base-ui/react` (headless)                        |
| Styling       | Tailwind CSS 4 + CSS Modules                       |
| Language      | TypeScript 5.9 (strict)                            |
| Scraping      | Cheerio                                            |
| i18n          | next-intl                                          |
| Monorepo      | Turborepo + pnpm workspaces                        |
| Linting       | ESLint 9 flat config + unicorn + typescript-eslint |

## Routes

| Path                      | Description                                |
| ------------------------- | ------------------------------------------ |
| `/`                       | Home page                                  |
| `/search`                 | Full-text search (Fuse.js — planned)       |
| `/map`                    | Interactive map (Leaflet/Mapbox — planned) |
| `/random`                 | Redirects to a random location             |
| `/location/[slug]`        | Location detail page                       |
| `/category/[slug]`        | Listings by category                       |
| `/county/[county]`        | County overview                            |
| `/county/[county]/[city]` | City listings                              |

## Data flow

1. The **scraper** fetches individual location pages from weirdca.com (IDs 1–1235, sparse), parses the HTML with Cheerio, and writes structured JSON to `apps/scraper/data/`.
2. The **web app** reads that JSON to render pages. Build-time static generation is used where data is stable; dynamic routes fall back to server rendering.

## Commands

Run from the repo root:

```bash
pnpm install          # Install all dependencies
pnpm dev              # Dev server (web on :3000)
pnpm build            # Production build
pnpm lint             # Lint all packages (zero warnings allowed)
pnpm check-types      # TypeScript across all packages
pnpm format           # Prettier format
pnpm scrape           # Run the scraper
```

Scraper sub-commands (from `apps/scraper/`):

```bash
pnpm scrape:locations   # → data/locations.json
pnpm scrape:categories  # → data/categories.json
```

Turborepo filters:

```bash
pnpm turbo dev --filter=web
pnpm turbo build --filter=scraper
pnpm turbo lint --filter=@repo/ui
```

## UI package (`@repo/ui`)

The component library is consumed directly from source — no build step. Exports follow two patterns:

- **Wildcard** — `"./*": "./src/*.tsx"` for single-file components (`@repo/ui/Box`, etc.)
- **Named entry points** — `./typography`, `./page`, `./layout` for multi-file modules with a barrel `index.ts`

Internal utilities live in `packages/ui/lib/` and are resolved via a `#lib` subpath import alias (both `tsconfig paths` and the `package.json` `imports` field). They are not exported to consumers.

Key components:

- **`Box`** — polymorphic primitive with `boxWithDefaultAs` for pre-configured variants
- **`PageLayout`** — compound component (`PageLayout.Header`, `.Content`, `.TopNav`, `.Logo`)
- **`LayoutContainer`** — inner content wrapper (max-width + centering)
- **`Hero`** — full-width section layout component
- **`Paragraph`** / **`DropCap`** — typography with drop-cap support and double-newline splitting

## CSS conventions

- Tailwind CSS 4 is the primary styling tool in `apps/web`
- `@layer` is only used in global CSS files (`globals.css`) — never inside `.module.css` files
- CSS Modules provide encapsulation via hashed class names; unlayered module rules sit above all Tailwind layers in the cascade
- `display: flex` and similar base display values are applied inline via `clsx`; CSS Modules handle layout-specific rules only
