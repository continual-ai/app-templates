# Working in this App (React + Vite)

This is a full-stack React 19 and Vite application using Cloudflare's Vite plugin. It normally
lives under `apps/<directory>/`. Run `pnpm dev` for HMR and the local Workers runtime.

The App serves from `/` locally and at the root of its published hostname. Keep client links and
`/api/*` calls relative to the App root.

Client code lives in `src`; same-origin server endpoints live in `worker/index.ts`. Browser code
calls relative `/api/*` routes. Keep Hyperdrive, credentials, runtime assertions, and Continual tool
calls in the Worker. Use `createServerClient` from `@continual/sdk/server-client` for Continual tool
calls and record each exact Connection ID and tool name for publication.

Use the shadcn primitives in `src/components/ui`, semantic Tailwind tokens, accessible names and
focus states. Shared layouts and blocks are available under `/opt/app-templates`; copy only what the
App uses.

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
