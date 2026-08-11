# Working in this App (React + Vite)

This is a full-stack React 19 and Vite application using Cloudflare's Vite plugin. It normally
lives under `apps/<directory>/`. Run `pnpm dev` for HMR and the local Workers runtime.

Continual exposes local Vite servers through generated sandbox hostnames. Keep the controlled
preview suffixes in `server.allowedHosts` in `vite.config.ts`. Current provider defaults include
`.sandbox.tensorlake.ai` (Tensorlake), `.e2b.app` (E2B), `.proxy.daytona.work` (Daytona), and
`.modal.host` (Modal). Add only the suffixes needed for the preview URLs returned by the platform;
providers may use custom ingress domains. Do not set `allowedHosts: true`, because that disables
Vite's DNS-rebinding protection.

The App serves from `/` locally and at the root of its published hostname. Keep client links and
`/api/*` calls relative to the App root.

Client code lives in `src`; same-origin server endpoints live in `worker/index.ts`. Browser code
calls relative `/api/*` routes. Keep Hyperdrive, credentials, runtime assertions, and Continual tool
calls in the Worker. Use `createServerClient` from `@continual/sdk/server-client` for Continual tool
calls and record each exact Connection ID and tool name for publication.

Use the provided design system first. Canonical Tailwind utilities are backed by the semantic
tokens in `src/styles/tokens.css`: `background`, `foreground`, `card`, `popover`, `primary`,
`secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `chart-*`, and `sidebar-*`.
Geist, Geist Mono, radii, light mode, and dark mode are already configured.

Start controls with the shadcn primitives in `src/components/ui` (including button, card, input,
badge, dialog, sheet, sidebar, empty, fields, tables, charts, and feedback components). Reuse the
framework-neutral layouts and app, chat, marketing, navigation, and motion blocks under
`/opt/app-templates/blocks/react`; copy only what the App uses. Do not install an unrelated UI or
component library unless the user explicitly requests it. Spectrum/Continual brand colors are
optional accents for charts, diagrams, fields, and small highlights—not semantic control colors.

A custom theme may change both semantic tokens and the owned shadcn primitive recipes; do not stop
at color swaps when the requested direction changes component treatment. Adjust `--radius` plus the
local `src/components/ui` classes and variants for control height, padding, shape, border weight,
elevation, typography, and motion. Keep `data-slot` hooks, state/ARIA selectors, visible focus, and
contrast intact so shared layouts and blocks inherit the theme safely.

Keep the exact `@continual/sdk` version declared by the template unless the project intentionally
upgrades it.

Run `pnpm check` and `pnpm bundle:continual`. The bundle command builds the App and writes the
Wrangler production output beneath `.continual/wrangler`. Publish only this App from the project
root with:

```sh
pnpm exec continual deploy --app <app-id> --name "<display name>" \
  --app-dir apps/<directory>
```

Do not commit `dist`, `.continual`, `.wrangler`, credentials, logs, or `node_modules`.
