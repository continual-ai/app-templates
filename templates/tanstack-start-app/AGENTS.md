# Working in this App (TanStack Start)

This is a native TanStack Start full-stack application using the Cloudflare Vite plugin. Run
`pnpm dev` for framework-native development. Keep server behavior in TanStack server functions or a
custom server entry; browser code calls relative routes on this App.

The App serves from `/` locally and at the root of its published hostname. Its `defineApp.route`
identifies it in Continual but is not a native URL prefix. Keep links and server calls relative to
the App root.

Use `/opt/continual/skills/create-app/assets/continual.server.ts.template` from server-only code for
Continual tool calls and declare every call under `runtimeTools` in `continual.config.ts`.

Run `pnpm check`, `pnpm build`, and `pnpm bundle:continual`. Publish the resulting App artifact with
`continual deploy --app <app-id> --artifact apps/<directory>/.continual/artifact.json`.
