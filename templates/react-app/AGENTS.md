# Working in this App (React + Vite)

This is a native full-stack React 19 and Vite application using Cloudflare's Vite plugin. It
normally lives under `apps/<directory>/` and is declared by `defineApp` in `continual.config.ts`.
Run `pnpm dev` for HMR and the local Workers runtime.

The App serves from `/` locally and at the root of its published hostname. Its `defineApp.route`
identifies it in Continual but is not a native URL prefix. Keep client links and `/api/*` calls
relative to the App root.

Client code lives in `src`; same-origin server endpoints live in `worker/index.ts`. Browser code
calls relative `/api/*` routes. Keep Hyperdrive, credentials, runtime assertions, and Continual tool
calls in the Worker. Copy `/opt/continual/skills/create-app/assets/continual.server.ts.template`
when the Worker needs Continual tools and declare each exact call under `runtimeTools` in
`continual.config.ts`.

Use the shadcn primitives in `src/components/ui`, semantic Tailwind tokens, accessible names and
focus states. Shared layouts and blocks are available under `/opt/app-templates`; copy only what the
App uses.

Run `pnpm check`, `pnpm build`, and `pnpm bundle:continual`. The bundle command performs a Wrangler
dry run and writes `.continual/artifact.json`. Publish only this App from the project root with:

```sh
pnpm exec continual deploy --app <app-id> --artifact apps/<directory>/.continual/artifact.json
```

Do not commit `dist`, `.continual`, `.wrangler`, credentials, logs, or `node_modules`.
