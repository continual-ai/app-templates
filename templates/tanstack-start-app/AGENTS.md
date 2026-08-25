# Working in this App (TanStack Start)

This is a TanStack Start full-stack application using the Cloudflare Vite plugin. Run
`pnpm dev` for framework-native development. Keep server behavior in TanStack server functions or a
custom server entry; browser code calls relative routes on this App.

Continual exposes local Vite servers through generated sandbox hostnames. Keep the controlled
preview suffixes in `server.allowedHosts` in `vite.config.ts`. Current provider defaults include
`.tensorlake.ai` (Tensorlake, including regional hosts such as
`*.sandbox.gcp-use4.tensorlake.ai`), `.e2b.app` (E2B), `.proxy.daytona.work` (Daytona), and
`.modal.host` (Modal). For a custom provider ingress domain, set
`CONTINUAL_ALLOWED_DEV_HOSTS` to a comma-separated list of exact hosts or leading-dot suffixes.
Do not set `allowedHosts: true`, because that disables Vite's DNS-rebinding protection.

The App serves from `/` locally and at the root of its published hostname. Keep links and server
calls relative to the App root.

Use `createServerClient` from `@continual/sdk/server-client` in server-only code for Continual tool
calls and record each exact Connection ID and tool name for publication. Keep the exact
`@continual/sdk` version declared by the template unless the project intentionally upgrades it.

## Database access

Database access is server-only. In published Workers, Continual binds Hyperdrive as `env.DATABASE`;
in local `vite dev` and `vite preview`, the template forwards the sandbox's `DATABASE_URL` and optional
`DATABASE_SCHEMA` only to the Worker as Cloudflare bindings. Resolve the connection string in a server
route with `env.DATABASE?.connectionString ?? env.DATABASE_URL`. Never put either value in a `VITE_*`
variable, a response, a log, or browser code. Create the database client inside each request handler and
close it before the handler returns—do not cache Postgres clients globally.

Use the provided design system first. Tailwind v4 and shadcn are configured through
`src/styles/global.css`, `src/styles/tokens.css`, `vite.config.ts`, and `components.json`; Geist and
Geist Mono are loaded by the global CSS entry point. Use semantic utilities backed by `background`,
`foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`,
`input`, `ring`, `chart-*`, and `sidebar-*` rather than raw product-interface colors.

Start controls with `src/components/ui` (button, card, input, badge, dialog, sheet, and empty).
Reuse `src/components/blocks` for `AppShell`, `SidebarNav`, `PageHeader`, `MetricCard`, `EmptyState`,
and the representative `StarterDashboard`. More framework-neutral React blocks are available under
`/opt/app-templates/blocks/react`; copy only what the App uses. Do not install an unrelated UI or
component library unless the user explicitly requests it. Spectrum/Continual brand colors are
optional accents for charts, diagrams, fields, and small highlights—not semantic control colors.

A custom theme may change both semantic tokens and the owned shadcn primitive recipes; do not stop
at color swaps when the requested direction changes component treatment. Adjust `--radius` plus the
local `src/components/ui` classes and variants for control height, padding, shape, border weight,
elevation, typography, and motion. Keep `data-slot` hooks, state/ARIA selectors, visible focus, and
contrast intact so shared layouts and blocks inherit the theme safely.

Run `pnpm check` and `pnpm bundle:continual`. The bundle command builds the App and writes the
Wrangler production output beneath `.continual/wrangler`. Publish it from the project root with:

```sh
pnpm exec continual deploy --app <app-id> --name "<display name>" \
  --app-dir apps/<directory>
```
