# Continual App templates

Starter templates for source-owned Continual Apps. Each directory under `templates/` is copied
directly into a project repository at `apps/<app-id>/` and is declared with `defineApp` in the
project's `continual.config.ts`.

## Templates

- [`astro-default`](./templates/astro-default) — Astro + React + Tailwind starter for websites,
  documentation, and content-heavy Apps.
- [`react-app`](./templates/react-app) — Vite + React + Tailwind starter for dashboards,
  internal tools, portals, and interactive Apps.

Each template owns a `package.json` with a root `build` script and emits `dist/index.html` beside
the source `index.html`. That is the layout expected by Continual preview and publishing.

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
- The project declares Apps with `defineApp({ entry: file("apps/<app-id>/index.html") })`.
- Business data and server behavior belong to backend Objects and Actions declared by the project.
- Browser code calls those Actions through relative `/api/actions/<action-id>` routes.
- Templates do not depend on the legacy `@continual/sites-sdk`, Sites telemetry, Sites preview
  routes, or template-owned Worker backends.

## Adding or updating a template

1. Edit the template files directly.
2. Keep the template self-contained and free of project-specific backend definitions.
3. Run `pnpm install` at the repository root to update the lockfile.
4. Run `pnpm check` and `pnpm build` before committing.

## How the templates get into a sandbox

The `create-app` skill drives the scaffold flow. Templates are baked into the sandbox image under
`/opt/app-templates/`. The skill refreshes this repository before scaffolding when network access
is available.
