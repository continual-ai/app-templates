# Continual App templates

Starter templates for source-owned Continual Apps. Each directory under `templates/` is copied
directly into a project repository at `apps/<app-id>/`.

## Templates

- [`astro-default`](./templates/astro-default) — Astro + React + Tailwind starter for websites,
  documentation, and content-heavy Apps.
- [`nextjs-app`](./templates/nextjs-app) — Next.js App Router + Tailwind starter with React Server
  Components, reusable shadcn primitives/blocks, Route Handlers, and OpenNext Cloudflare output.
- [`react-app`](./templates/react-app) — Vite + React + Tailwind starter for dashboards,
  internal tools, portals, interactive Apps, and Worker API routes.
- [`tanstack-start-app`](./templates/tanstack-start-app) — TanStack Start + Tailwind starter with
  reusable shadcn primitives/blocks, file-based routing, server functions, and Cloudflare Vite
  output.

Each template owns native `dev`, `check`, `build`, and `bundle:continual` scripts plus a Wrangler
configuration. The bundle script builds the framework's Cloudflare Worker and assets and produces
the Wrangler output that Continual packages when the App is published.

## Shared design system

- `shared/styles/tokens.css` is the single canonical Tailwind v4/shadcn semantic-token asset. The
  sync script materializes it inside each self-contained template.
- `design-system.json` is the machine-readable template guide for agents. It lists stack choices,
  source-of-truth paths, rules, primitives, blocks, tokens, and verification commands.
- `styleguide.json` describes the rendered `_styleguide` coverage and expected interactions.
- `templates/react-app/src/components/ui/**` is the canonical primitive implementation. Astro and
  React/Vite ship the broad set; Next.js and TanStack Start materialize the focused starter set.
- `blocks/react/**` is the canonical framework-neutral React block library. Copy these TSX blocks
  into any React-capable template for marketing sections, app/dashboard patterns, chat UI, nav, and
  motion. The starter `AppShell`, navigation, metrics, header, empty state, and dashboard are kept
  in sync in Next.js and TanStack Start.
- `blocks/astro/**` contains Astro-only content helpers: MDX components, blog index/content config,
  and dynamic OG route support.
- All four templates use the same neutral shadcn token contract, Tailwind v4 utilities, Geist/Geist
  Mono typography, primitive conventions, and shared blocks. Spectrum/Continual brand colors are an
  optional expressive layer for charts and small accents, never a replacement for semantic controls.
- Use the provided primitives and blocks first. Do not add an unrelated UI/component library unless
  an App request explicitly calls for one.
- shadcn primitives are source-owned, so a custom theme can change more than color tokens. When the
  requested direction changes component treatment, update `--radius` and the local primitive recipes
  for control height, padding, shape, border weight, elevation, typography, and motion. Preserve
  `data-slot` hooks, state/ARIA selectors, visible focus, and contrast so shared blocks inherit the
  new treatment safely. For factory-wide changes, edit the canonical React primitive and sync it;
  generated Apps should customize their own materialized primitive files.
- `pnpm design-system:sync` refreshes materialized assets; `pnpm check:design-system` fails on drift
  or a missing dependency, token, primitive, block, or exact `@continual/sdk@0.1.1` pin.
- `pnpm check:visual-drift` catches app-surface drift such as marketing heroes, oversized route
  headings, hero-scale padding, and too-round custom wrappers.

## App framework contract

- App source is owned by the customer and lives under `apps/`.
- Framework-native Apps own their server routes and call authorized Continual tools from those
  routes through the supplied server client.
- Native Apps serve from `/` in local development and at the root of their published hostname.
- Templates pin the supported `@continual/sdk` version and initialize App preview support in their
  browser entry.

## Adding or updating a template

1. Edit the template files directly.
2. When changing shared tokens, starter primitives, or starter blocks, edit the canonical source and
   run `pnpm design-system:sync`.
3. Keep every template self-contained and free of project-specific backend definitions.
4. Run `pnpm install` at the repository root to update the lockfile.
5. Run `pnpm check`, `pnpm build`, and `pnpm verify:templates` before committing. The last command
   copies each template to an isolated scaffold, installs its dependencies, then runs its native
   check and production build.

## How the templates get into a sandbox

The `create-app` skill clones or refreshes this repository's `main` branch under
`/opt/app-templates/`, reads the selected template's `AGENTS.md`, and copies source-only files into
the project's `apps/` directory.
