# Working in this App (Astro)

This is an Astro 6 application using the Cloudflare adapter. It normally lives under
`apps/<directory>/`. Run `pnpm dev` for the framework-native server and hot reload. Astro pages and
endpoints execute in the same Worker after publication; use React islands only for browser
interactivity.

The App serves from `/` locally and at the root of its published hostname. Keep internal links and
endpoint calls relative to the App root.

Keep credentials, Hyperdrive, and Continual tool calls in `.astro` frontmatter, API endpoints, or
server modules. Browser code calls relative App endpoints and never receives runtime assertions or
execution tokens. Use `createServerClient` from `@continual/sdk/server-client` for Continual tool
calls and record each exact Connection ID and tool name for publication.

Use the shadcn primitives in `src/components/ui`, semantic Tailwind tokens, accessible names and
focus states. Shared layouts and blocks are available under `/opt/app-templates`; copy only what the
App uses.

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
