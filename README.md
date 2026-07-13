# Continual site templates

Starter templates for sites scaffolded by Continual's `create-site` skill. Each subdirectory under
`templates/` is a self-contained template that the agent copies into a project repo's
`sites/<slug>/` directory.

## Templates

- [`astro-default`](./templates/astro-default) — Astro + React + Tailwind starter (the default).
- [`react-app`](./templates/react-app) — Vite + React + Tailwind starter for dashboards,
  internal tools, portals, and other app-like sites.

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

## Adding or updating a template

1. Edit the template files directly.
2. Make sure `package.json` keeps `@continual/sites-sdk` as a normal npm range (e.g. `^0.1.0`).
3. Update the lockfile (`pnpm install` at the template root) and commit it.
4. Bump the template version if you make a breaking change.

## SDK

The `@continual/sites-sdk` package is **not** developed here. It's published to npm as
[`@continual/sites-sdk`](https://www.npmjs.com/package/@continual/sites-sdk) and templates depend
on it the same way they depend on any other npm package.

To pick up a new SDK version, bump the version in each template's `package.json`, refresh the
lockfile, and commit.

## How the templates get into a sandbox

The `create-site` skill drives the scaffold flow. Templates are baked into the Daytona base image
under `/opt/site-templates/`. The skill runs a best-effort `git pull` before scaffolding so
template fixes ship without a snapshot rebake.
