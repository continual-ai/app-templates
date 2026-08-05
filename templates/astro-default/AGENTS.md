# Working in this App (astro-default)

This directory is a source-owned Continual App built with Astro 6, React islands, Tailwind v4,
shadcn/ui, and MDX. It normally lives at `apps/<app-id>/` in a Continual project.

## App framework boundary

- Keep `index.html`; it is the source marker referenced by `defineApp` in `continual.config.ts`.
- `pnpm build` must emit the complete App at `dist/index.html` with its JS, CSS, fonts, and images.
- Do not add `@continual/sites-sdk`, Sites runtime files, telemetry, publishing config, or a separate
  Worker backend.
- Define durable data and server behavior as project Objects and Actions outside this App directory.
- Browser code calls Actions with `POST /api/actions/<action-id>` and a JSON body shaped as
  `{ "input": { ... } }`. Never connect to the project database from browser code.
- Preview the complete project with the root `continual dev` command, not Astro's dev server alone.

## Routing and content

Astro uses file-based routing under `src/pages/`. `src/pages/index.astro` is `/`,
`src/pages/about.astro` is `/about`, and dynamic routes must export `getStaticPaths()` because the
App builds as static output. Prefer Astro pages for content and React islands only where browser
interactivity is required.

`src/layouts/Layout.astro` owns the document shell and renders `Seo.astro`. Set title, description,
canonical URL, and social image through Layout props. Use `astro:assets` for imported images and
put files that must retain their names in `public/`.

## Components and design system

- Use shadcn primitives from `src/components/ui/` before creating standard controls from scratch.
- Use `cn()` from `src/lib/utils.ts` to merge classes.
- Use semantic Tailwind tokens from `src/styles/global.css`; do not scatter raw color values.
- Preserve keyboard behavior, visible focus, semantic HTML, accessible names, and WCAG AA contrast.
- Interactive React components require a `client:` directive. Use `client:load` above the fold and
  `client:visible` or `client:idle` for deferred interactions.

Shared starting kits live in `/opt/app-templates/`:

- `layouts/*.astro` contains page shells.
- `blocks/react/app/` contains dashboards and workflow UI.
- `blocks/react/chat/`, `blocks/react/marketing/`, `blocks/react/nav/`, and
  `blocks/react/motion/` contain focused composition blocks.
- `blocks/astro/` contains Astro-only content, MDX, SEO, and OG helpers.
- `design-system.json` and `styleguide.json` provide machine-readable design guidance.

Copy only the files the App uses, then customize the owned copies. Each shared block's header lists
its props, prerequisites, and usage.

## App surfaces

Dashboards, CRUD interfaces, queues, settings, and data browsers should be dense and scannable.
Use compact page headers, aligned actions, clear loading/empty/error states, and ordinary shadcn
radii. Avoid marketing heroes, oversized display type, deep card nesting, and decorative spacing in
workflow UI. Marketing pages may use the marketing layouts and blocks when that is the actual job.

Theming is token-driven. Define both `:root` and `.dark`, keep foreground/background pairs
accessible, and add any non-system font dependency you reference. Temporary visual variants may
use `variants/VariantChooser.tsx`, but remove the chooser and rejected variants before committing.

## Forms and project Actions

`src/components/ContactForm.tsx` demonstrates the native App boundary. Pass the id of a project
Action and hydrate it:

```astro
<ContactForm actionId="captureLead" client:load />
```

The matching Action is declared in a project module, validates its input, owns persistence and
external effects, and is composed into `continual.config.ts`. If that Action calls a Continual or
Connection tool, declare the exact call in `defineProject.runtimeTools`.

## Verification

From the project root, install dependencies with `pnpm` and run the narrow App checks:

```sh
pnpm --dir apps/<app-id> check
pnpm --dir apps/<app-id> build
```

Then run the project's normal checks and preview through `continual dev`. Confirm the App route,
`/api/health`, `/api/manifest`, and every changed Action flow. Do not commit `dist/`, preview files,
credentials, logs, or `node_modules/`.
