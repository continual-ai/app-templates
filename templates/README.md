# Continual App template contract

This document describes what a maintained Continual App template must contain. Use it when adding a
new framework template or bringing an older template up to the current App runtime contract. The
TanStack Start template is the reference implementation; copy the behavior described here, not
framework-specific file names or APIs.

## Required package contract

Every template is a self-contained package that can be copied into `apps/<app-key>/`. Its
`package.json` must provide:

| Script               | Contract                                                                 |
| -------------------- | ------------------------------------------------------------------------ |
| `dev`                | Start the framework's native development server on a configurable port.  |
| `check`              | Generate framework-owned types/routes first, then run static validation. |
| `build`              | Produce the framework's Cloudflare Worker and static assets.             |
| `bundle:continual`   | Build and write deployable Wrangler output to `.continual/wrangler`.      |
| `clean:continual`    | Remove only the generated Continual bundle directory.                    |

Use `pnpm` commands throughout. Pin the supported `@continual/sdk` version exactly so a scaffolded
App does not silently pick up a different runtime contract.

## Required files and behavior

Every template must include:

- `AGENTS.md` with framework-specific development, server-route, verification, database, design
  system, and publication guidance.
- A Wrangler JSON or JSONC configuration with the framework entrypoint, compatibility date and
  flags, and observability settings required by the generated Worker.
- A framework build adapter that preserves Worker modules and static assets as separate files.
- A browser entry that initializes `initDesignMode()` and `initTelemetry()` from
  `@continual/sdk/app-preview` inside the App frame.
- Server-route guidance for `@continual/sdk` calls. Browser code calls relative App routes and never
  receives Continual credentials, runtime assertions, or database secrets.
- `.gitignore` coverage for dependencies, framework output, `.wrangler`, `.continual`, local
  environment files, and other generated or secret-bearing files.
- The shared semantic design tokens, supported UI primitives and blocks, Geist typography, and the
  framework's Tailwind v4 integration. Follow the canonical sources described in the repository
  README rather than maintaining independent copies.

Apps serve from `/` in development and at the root of their published hostname. Do not introduce a
production base path into a template.

## Cloudflare runtime bindings

Framework server code must have a documented, typed way to access Cloudflare Worker bindings. For a
framework that supports Cloudflare's module environment import, the underlying access is:

```ts
import { env } from "cloudflare:workers";
```

Do not make each generated App invent an ambient declaration. The template must either generate
Worker types from a stable Wrangler configuration or own a narrow checked-in declaration for the
managed bindings it exposes. Keep that type source easy to extend when another binding is added.

Environment wiring has two different owners:

- Local development maps sandbox process values into the framework's server/Worker environment.
- Published bindings are attached by Continual's trusted publisher and must not be copied into
  Wrangler configuration, source files, browser variables, or build output.

Values intended for server code must never use a public prefix such as `VITE_*`.

## Optional Branch database support

A template must make database-backed Apps straightforward without requiring every App to install a
database driver. It should include a small server-only environment resolver or an equally direct
framework-native example. The resolver must:

- read `DATABASE_URL` and optional `DATABASE_SCHEMA` from the Worker environment;
- fail clearly when a database-backed route runs without `DATABASE_URL`;
- return only server-side values; and
- remain independent of a specific PostgreSQL driver.

The TanStack reference is `src/server/database-env.ts`, with binding types in
`src/worker-env.d.ts`. Local development injects the sandbox values through `vite.config.ts`.
Published database-backed Apps receive a pooled Neon URL as the encrypted `DATABASE_URL` Worker
secret. The source package declares the capability with:

```json
{
  "continual": {
    "database": true
  }
}
```

Add that declaration only when the App actually uses the Branch database. A database-free App must
not request or receive database credentials.

Database clients are request-scoped. Create and close the client inside the server handler; never
cache a client, pool, connection promise, or connection string in module state. With Postgres.js,
use `{ max: 1, prepare: false }` against the publisher-provided transaction-pooler URL.

For ordinary numeric primary keys, prefer
`integer generated by default as identity primary key`. JavaScript drivers commonly return
PostgreSQL `bigint` values as strings to prevent precision loss. Use `bigint` only when its range is
needed and keep its API representation as a string. UUIDs are appropriate when IDs must be
generated outside PostgreSQL.

## Generated routes and types

The template's `check` command must be valid immediately after an App adds, moves, or removes a
framework route. If the framework generates a route tree or types, run that generator before the
typechecker. A bare `tsc --noEmit` is not a sufficient `check` command when it can read stale
generated output.

The isolated template verifier adds a route to the copied TanStack scaffold before running
`pnpm check`. Add an equivalent verifier case for another framework when its routing or type
generation can become stale.

## `AGENTS.md` requirements

Keep operational knowledge beside the scaffold so it survives copying. At minimum, explain:

- the supported framework stack and its server-code boundary;
- the correct commands for development, checking, building, and bundling;
- how server routes obtain Worker bindings and where their types live;
- how to declare and safely use the optional Branch database;
- that new server routes may require framework code generation before typechecking;
- how to call Continual tools without exposing credentials to browser code;
- where shared primitives, blocks, tokens, and theme recipes live;
- which generated and secret-bearing files must stay out of source control; and
- that edit operations targeting the same file must be sequenced rather than run concurrently.

Prefer executable examples over statements that leave framework glue implicit.

## Reference implementation map

| Concern                       | TanStack Start reference                         |
| ----------------------------- | ------------------------------------------------ |
| Agent instructions            | `tanstack-start-app/AGENTS.md`                    |
| Package scripts               | `tanstack-start-app/package.json`                 |
| Cloudflare configuration      | `tanstack-start-app/wrangler.jsonc`               |
| Local binding injection       | `tanstack-start-app/vite.config.ts`               |
| Typed database environment    | `tanstack-start-app/src/server/database-env.ts`   |
| Worker binding declarations   | `tanstack-start-app/src/worker-env.d.ts`          |
| Preview initialization        | `tanstack-start-app/src/routes/__root.tsx`        |
| Generated route tree          | `tanstack-start-app/src/routeTree.gen.ts`         |
| Design tokens                 | `tanstack-start-app/src/styles/tokens.css`        |
| Owned UI primitives           | `tanstack-start-app/src/components/ui/`           |
| Starter composition blocks    | `tanstack-start-app/src/components/blocks/`       |

## Adding another template

1. Choose the framework's supported Cloudflare adapter and identify its Worker entrypoint, assets,
   local-development binding mechanism, and production output format.
2. Implement the required package scripts and Wrangler configuration.
3. Add typed server-only access for managed bindings and the optional database resolver.
4. Add the SDK preview initialization, server-call guidance, design-system materialization, and
   complete `AGENTS.md`.
5. Add the template to the root workspace, verification matrix, design-system synchronization, and
   drift checks where applicable.
6. Extend isolated verification with any framework-specific generated-route or generated-type
   regression case.
7. Run `pnpm check`, `pnpm build`, and `pnpm verify:templates` from the repository root.

Do not call a template supported until an isolated copy installs, checks, builds, and emits the
expected Cloudflare deployment artifact without relying on files from this repository.
