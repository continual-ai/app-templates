# Working in this App (Astro)

This is a native Astro 6 application using the Cloudflare adapter. It normally lives under
`apps/<directory>/` and is declared by `defineApp` in `continual.config.ts`. Run `pnpm dev` for the
framework-native server and hot reload. Astro pages and endpoints execute in the same Worker after
publication; use React islands only for browser interactivity.

The App serves from `/` locally and at the root of its published hostname. Its `defineApp.route`
identifies it in Continual but is not a native URL prefix. Keep internal links and endpoint calls
relative to the App root.

Keep credentials, Hyperdrive, and Continual tool calls in `.astro` frontmatter, API endpoints, or
server modules. Browser code calls relative App endpoints and never receives runtime assertions or
execution tokens. Copy `/opt/continual/skills/create-app/assets/continual.server.ts.template` when
the App needs Continual tools and declare each exact call under `runtimeTools` in
`continual.config.ts`.

Use the shadcn primitives in `src/components/ui`, semantic Tailwind tokens, accessible names and
focus states. Shared layouts and blocks are available under `/opt/app-templates`; copy only what the
App uses.

Run `pnpm check`, `pnpm build`, and `pnpm bundle:continual`. The bundle command uses Astro's emitted
`dist/server/wrangler.json`, performs a Wrangler dry run, and writes `.continual/artifact.json`.
Publish only this App from the project root with:

```sh
pnpm exec continual deploy --app <app-id> --artifact apps/<directory>/.continual/artifact.json
```

Do not commit `dist`, `.continual`, `.wrangler`, credentials, logs, or `node_modules`.
