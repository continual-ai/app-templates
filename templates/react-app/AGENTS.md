# Working in this App (react-app)

This directory is a source-owned Continual App built with Vite 7, React 19, TypeScript, React
Router, Tailwind v4, and shadcn/ui. It normally lives at `apps/<app-id>/` in a Continual project.
Use it for dashboards, internal tools, portals, workflow UI, and interactive public Apps. Prefer
`astro-default` for content-heavy websites and documentation.

## App framework boundary

- Keep `index.html`; it is both the Vite source entry and the file referenced by `defineApp` in
  `continual.config.ts`.
- `pnpm build` must emit the complete App at `dist/index.html` with its JS, CSS, fonts, and images.
- Do not add `@continual/sites-sdk`, Sites runtime files, telemetry, publishing config, or a separate
  Worker backend.
- Define durable data and server behavior as project Objects and Actions outside this App directory.
- Browser code calls Actions with `POST /api/actions/<action-id>` and a JSON body shaped as
  `{ "input": { ... } }`. Never connect to the project database from browser code.
- Preview the complete project with the root `continual dev` command, not Vite's dev server alone.

## Structure and routing

- `src/main.tsx` mounts React and imports global styles.
- `src/App.tsx` owns route composition.
- `src/routes/` contains route-level screens.
- `src/components/` contains App-owned components; `src/components/ui/` contains shadcn primitives.
- `src/lib/utils.ts` owns `cn()` and `src/hooks/` owns focused browser hooks.

Add a route in `src/App.tsx`, add navigation deliberately, and include a not-found route. Keep
route components thin enough to scan: compose feature components and keep remote-state operations
close to their consumer. Keep hash routing unless the App runtime gains an explicit history
fallback; it makes nested screens refresh-safe regardless of the App's declared route.

## Components and design system

- Use shadcn primitives from `src/components/ui/` before creating standard controls from scratch.
- Use `cn()` rather than ad hoc class concatenation.
- Use semantic Tailwind tokens from `src/styles/global.css`; do not scatter raw color values.
- Preserve keyboard behavior, visible focus, semantic HTML, accessible names, and WCAG AA contrast.
- Use named component functions and direct props types. Do not add `React.FC`, `defaultProps`, or
  `forwardRef` in new React 19 code.

Shared starting kits live in `/opt/app-templates/`:

- `blocks/react/app/` contains dashboard and workflow compositions.
- `blocks/react/chat/`, `blocks/react/marketing/`, `blocks/react/nav/`, and
  `blocks/react/motion/` contain focused blocks.
- `design-system.json` and `styleguide.json` provide machine-readable design guidance.

Copy only the files the App uses, then customize the owned copies. Each shared block's header lists
its props, prerequisites, and usage.

## App surfaces

Workflow UI should be dense, scannable, and explicit about loading, empty, error, success, and
disabled states. Prefer compact page headers, aligned actions, tables, filters, and ordinary shadcn
radii. Avoid marketing heroes, oversized display type, deep card nesting, and decorative spacing in
dashboards. Marketing blocks remain appropriate for actual public marketing routes.

Theming is token-driven. Define both `:root` and `.dark`, keep foreground/background pairs
accessible, and add any non-system font dependency you reference. Temporary visual variants may
use `variants/VariantChooser.tsx`, but remove the chooser and rejected variants before committing.

## Project Actions

Call a project Action through the App's own origin:

```ts
const response = await fetch("/api/actions/updateSettings", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ input: values }),
});
```

The Action validates input and owns persistence, authorization, transactions, and external effects.
If it calls a Continual or Connection tool, declare the exact call in
`defineProject.runtimeTools`. Surface useful errors in the UI instead of exposing transport details.

## Verification

From the project root, install dependencies with `pnpm` and run the narrow App checks:

```sh
pnpm --dir apps/<app-id> check
pnpm --dir apps/<app-id> build
```

Then run the project's normal checks and preview through `continual dev`. Confirm the App route,
`/api/health`, `/api/manifest`, and every changed Action flow. Do not commit `dist/`, preview files,
credentials, logs, or `node_modules/`.
