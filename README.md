# Continual App templates

Starter templates for source-owned Continual Apps. Each directory under `templates/` is copied
directly into a project repository at `apps/<app-id>/` and is declared with `defineApp` in the
project's `continual.config.ts`.

## Templates

- [`astro-default`](./templates/astro-default) — Astro + React + Tailwind starter for websites,
  documentation, and content-heavy Apps.
- [`nextjs-app`](./templates/nextjs-app) — Next.js App Router starter with React Server Components,
  Route Handlers, and OpenNext Cloudflare output.
- [`react-app`](./templates/react-app) — Vite + React + Tailwind starter for dashboards,
  internal tools, portals, interactive Apps, and Worker API routes.
- [`tanstack-start-app`](./templates/tanstack-start-app) — TanStack Start starter with file-based
  routing, server functions, and Cloudflare Vite output.

Each template owns native `dev`, `check`, `build`, and `bundle:continual` scripts plus a Wrangler
configuration. The bundle script builds the framework's Cloudflare Worker and assets and packages
them as one immutable Continual deployment artifact.

## Shared design system

- `design-system.json` is the machine-readable manifest for agents. It lists stack choices, rules,
  primitives, blocks, tokens, and verification commands.
- `styleguide.json` describes the rendered `_styleguide` coverage and expected interactions.
- `blocks/react/**` is the canonical shared block library. Copy these TSX blocks into either
  template for marketing sections, app/dashboard patterns, chat UI, nav, and motion.
- `blocks/astro/**` contains Astro-only content helpers: MDX components, blog index/content config,
  and dynamic OG route support.
- Both templates use the same shadcn/ui token contract and ship a broad primitive set, including the
  official shadcn chat primitives and Recharts-backed chart primitives.
- `pnpm check:visual-drift` catches app-surface drift such as marketing heroes, oversized route
  headings, hero-scale padding, and too-round custom wrappers.

## App framework contract

- App source is owned by the customer and lives under `apps/`.
- The project declares each App with the source entry named by its `.continual-template.json`.
- Framework-native Apps own their server routes and call authorized Continual tools from those
  routes through the supplied server client.
- Native Apps serve from `/` in local development and at the root of their published hostname.
- Templates do not depend on the legacy `@continual/sites-sdk`, Sites telemetry, Sites preview
  routes, or legacy Sites publication.

## Adding or updating a template

1. Edit the template files directly.
2. Keep the template self-contained and free of project-specific backend definitions.
3. Run `pnpm install` at the repository root to update the lockfile.
4. Run `pnpm check` and `pnpm build` before committing.

## How the templates get into a sandbox

The `create-app` skill clones or refreshes this repository's `main` branch under
`/opt/app-templates/`, reads the selected template's `AGENTS.md`, and copies source-only files into
the project's `apps/` directory.
