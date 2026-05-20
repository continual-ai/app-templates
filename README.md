# Continual site templates

Starter templates for sites scaffolded by Continual's `create-site` skill. Each subdirectory under
`templates/` is a self-contained template that the agent copies into a project repo's
`sites/<slug>/` directory.

## Templates

- [`astro-default`](./templates/astro-default) — Astro + React + Tailwind starter (the default).

## Adding or updating a template

1. Edit the template files directly.
2. Make sure `package.json` keeps `@continual/sites-sdk` as a normal npm range (e.g. `^0.1.0`).
3. Update the lockfile (`pnpm install` at the template root) and commit it.
4. Bump the template version if you make a breaking change.

## SDK

The `@continual/sites-sdk` package is **not** developed here. It lives in the private `davinci`
monorepo and is published to npm as `@continual/sites-sdk`. Templates depend on it the same way
they depend on any other npm package.

To make an SDK change, see `apps/continual/docs/sites-sdk-development.md` in the davinci repo. The
short version: bump the version in `packages/sites-sdk/`, merge, tag `sites-sdk-vX.Y.Z`, and CI
publishes. Then bump the version in each template here.

## How the templates get into a sandbox

`apps/continual/server/integrations/skills/create-site/SKILL.md` (in davinci) drives the scaffold
flow. Templates are baked into the Daytona base image under `/opt/site-templates/`. The skill
runs a best-effort `git pull` before scaffolding so template fixes ship without a snapshot rebake.
