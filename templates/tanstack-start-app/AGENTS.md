# Working in this App (TanStack Start)

This is a TanStack Start full-stack application using the Cloudflare Vite plugin. Run
`pnpm dev` for framework-native development. Keep server behavior in TanStack server functions or a
custom server entry; browser code calls relative routes on this App.

The App serves from `/` locally and at the root of its published hostname. Keep links and server
calls relative to the App root.

Use `createServerClient` from `@continual/sdk/server-client` in server-only code for Continual tool
calls and record each exact Connection ID and tool name for publication. Keep the exact
`@continual/sdk` version declared by the template unless the project intentionally upgrades it.

Run `pnpm check` and `pnpm bundle:continual`. The bundle command builds the App and writes the
Wrangler production output beneath `.continual/wrangler`. Publish it from the project root with:

```sh
pnpm exec continual deploy --app <app-id> --name "<display name>" \
  --app-dir apps/<directory>
```
