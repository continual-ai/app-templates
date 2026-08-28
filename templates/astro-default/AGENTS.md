# Working in this App (Astro)

This is an Astro 6 application using the Cloudflare adapter. It normally lives under
`apps/<directory>/`. Run `pnpm dev` for the framework-native server and hot reload. Astro pages and
endpoints execute in the same Worker after publication; use React islands only for browser
interactivity.

The App serves from `/` locally and at the root of its published hostname. Keep internal links and
endpoint calls relative to the App root.

Keep credentials, Hyperdrive, and Continual tool calls in `.astro` frontmatter, API endpoints, or
server modules. Browser code calls relative App endpoints and never receives runtime assertions or
execution tokens. Use `createAppServerClient` from `@continual/sdk/app` in server request handlers,
passing the incoming `Request`, and record each exact Connection ID and tool name for publication.

Use the provided design system first. Canonical Tailwind utilities are backed by the semantic
tokens in `src/styles/tokens.css`: `background`, `foreground`, `card`, `popover`, `primary`,
`secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `chart-*`, and `sidebar-*`.
Geist, Geist Mono, radii, light mode, and dark mode are already configured.

Start controls with the shadcn primitives in `src/components/ui` (including button, card, input,
badge, dialog, sheet, sidebar, empty, fields, tables, charts, and feedback components). Reuse the
React layouts and blocks under `/opt/app-templates/blocks/react` and the Astro layouts/content
helpers under `/opt/app-templates/layouts` and `/opt/app-templates/blocks/astro`; copy only what the
App uses. Keep shared React block props serializable when passing them into islands. Do not install
an unrelated UI or component library unless the user explicitly requests it. Spectrum/Continual
brand colors are optional accents for charts, diagrams, fields, and small highlights—not semantic
control colors.

A custom theme may change both semantic tokens and the owned shadcn primitive recipes; do not stop
at color swaps when the requested direction changes component treatment. Adjust `--radius` plus the
local `src/components/ui` classes and variants for control height, padding, shape, border weight,
elevation, typography, and motion. Keep `data-slot` hooks, state/ARIA selectors, visible focus, and
contrast intact so shared layouts and blocks inherit the theme safely.

Keep the exact `@continual/sdk` version declared by the template unless the project intentionally
upgrades it.

Run `pnpm check` and `pnpm bundle:continual`. The bundle command builds the App, uses Astro's
emitted `dist/server/wrangler.json`, and writes the Wrangler production output beneath
`.continual/wrangler`. Publish only this App from the project root with:

```sh
pnpm exec continual deploy --app <app-id> --name "<display name>" \
  --app-dir apps/<directory>
```

Do not commit `dist`, `.continual`, `.wrangler`, credentials, logs, or `node_modules`.
