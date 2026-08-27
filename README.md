# Continual App template

The TanStack Start starter for source-owned Continual Apps. The directory under `templates/` is
copied directly into a project repository at `apps/<app-id>/`.

## Template

[`tanstack-start-app`](./templates/tanstack-start-app) is a TanStack Start, React, TypeScript,
Tailwind v4, and shadcn starter. It owns native `dev`, `check`, `build`, and
`bundle:continual` scripts plus a Wrangler configuration. The bundle script builds the Cloudflare
Worker and assets that Continual packages when the App is published.

## Shared design system

- `shared/styles/tokens.css` is the canonical Tailwind v4/shadcn semantic-token asset.
- `shared/react/components/ui` contains the canonical source-owned primitives.
- `shared/react/hooks` and `shared/react/lib` contain framework-neutral support code.
- `blocks/react` is the canonical block library for marketing, app, chat, navigation, and motion
  patterns. The starter's core blocks are materialized into the template.
- `design-system.json` is the machine-readable guide for agents.
- `pnpm design-system:sync` refreshes every materialized design-system asset.
- `pnpm check:design-system` fails on drift or a missing dependency, token, primitive, block, or
  exact supported `@continual/sdk` pin.
- `pnpm check:visual-drift` catches app-surface drift such as marketing heroes, oversized route
  headings, hero-scale padding, and overly rounded custom wrappers.
- Direct dependencies use exact versions so the sandbox's prewarmed pnpm cache can satisfy a new
  scaffold without registry resolution.

Use the provided primitives and blocks first. A custom theme may change semantic tokens and the
owned shadcn recipes for control height, padding, shape, borders, elevation, typography, and motion.
Preserve `data-slot` hooks, state and ARIA selectors, visible focus, and contrast.

## App contract

- App source is owned by the customer and lives under `apps/`.
- Server routes and functions call authorized Continual tools through the supplied server client.
- Apps serve from `/` locally and at the root of their published hostname.
- The template pins the supported `@continual/sdk` version and initializes App preview support.

## Updating the template

1. Edit template-owned files directly.
2. Edit canonical tokens, primitives, or blocks under `shared/` or `blocks/`, then run
   `pnpm design-system:sync`.
3. Keep the template self-contained and free of project-specific backend definitions.
4. Run `pnpm install` at the repository root to update the lockfile.
5. Run `pnpm check`, `pnpm build`, `pnpm verify:templates`, and `pnpm verify:offline-cache:warm`
   before committing. The last command warms the pnpm store, then scaffolds, installs, checks, and
   builds the template with `pnpm install --offline`.

## Sandbox installation

The `create-app` skill clones or refreshes this repository under `/opt/app-templates`, reads the
TanStack template's `AGENTS.md`, and copies source-only files into the project's `apps/`
directory.
