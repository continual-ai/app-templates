# Working in this site (react-app)

Guidance for agents building or editing this site. This template is optimized for app-like
experiences: dashboards, internal tools, portals, CRUD workflows, authenticated product surfaces,
and highly interactive prototypes. Prefer `astro-default` for SEO-heavy marketing sites, blogs,
docs, and mostly-static content.

This site is a small workspace:

- `frontend/` is a **Vite 7 + React 19 + TypeScript** single-page app with React Router, Tailwind
  v4, shadcn-style UI primitives, and lucide icons.
- `backend/` is optional. Create it only when the site needs server-side `/api/*` logic that should
  run as a Cloudflare module Worker.

Path alias inside `frontend/`: `@/*` -> `frontend/src/*` (for example `@/components/ui/button`).

Unless a path is explicitly prefixed with `backend/`, paths like `src/...`, `public/...`,
`components.json`, `vite.config.ts`, and `tsconfig.json` below are frontend paths. Run frontend file
commands from `frontend/` or prefix them with `frontend/` from the site root.

## When to use this template

Use this template when the requested site behaves like software:

- Dashboards, admin panels, data browsers, queues, approval flows, calculators, configurators, and
  other stateful interfaces.
- Client-side routing where transitions should feel instant and preserve app state.
- Forms, filters, tabs, drawers, command palettes, charts, tables, and repeated interactions.
- Integrations that mostly call public or site-owned APIs from the browser.

Avoid this template for content-first projects where HTML output, metadata, sitemap behavior, and
per-page SEO matter more than rich client-side interaction. Use `astro-default` there.

## Routing

Routes are declared in `src/App.tsx` with React Router:

```tsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);
```

Add route components under `src/routes/` and import them into `src/App.tsx`. Keep persistent app
chrome in `src/components/AppLayout.tsx` so navigation, search, and account controls do not get
copy-pasted into pages.

Because this is a static SPA build, deep links depend on the host falling back to `index.html`. Do
not add server-only React Router loaders, Remix-style actions, or Node request handlers in
`frontend/`.

## App structure

The default structure is:

```txt
frontend/
  src/
    App.tsx                  # router
    main.tsx                 # React root, global CSS, telemetry
    components/AppLayout.tsx # persistent shell
    components/ui/*          # shadcn-style primitives
    routes/*                 # route screens
    styles/global.css        # Tailwind v4 theme tokens
```

Keep route screens focused on data and workflow composition. Extract repeated controls into
`src/components/`, and add shared non-UI helpers under `src/lib/`.

## UI conventions

- Use Tailwind utilities and the CSS variables in `src/styles/global.css`; do not introduce raw
  color literals for normal UI styling.
- Use shadcn primitives from `src/components/ui/` before authoring one-off controls. The template
  ships a broad base set: app shells, sidebar, sheet/dialog/popover/dropdowns, tables, tabs, forms,
  empty/skeleton/spinner states, sonner, Recharts-backed charts, and the official chat primitives
  (`message-scroller`, `message`, `bubble`, `attachment`, `marker`).
- Use lucide icons in icon buttons and navigation.
- Keep dashboards dense, scannable, and work-focused. Avoid marketing hero sections, oversized
  display type, decorative card stacks, or card-in-card layouts.
- Treat app pages as product surfaces, not landing pages. Use compact page headers (`text-2xl` or
  smaller), tight vertical rhythm, and right-aligned actions. Do not use hero-scale spacing such as
  `py-20`, `py-24`, `min-h-screen`, or centered marketing composition for dashboards, queues,
  settings, data browsers, CRUD screens, or chat surfaces.
- Keep custom app wrappers at `rounded-lg` or smaller. Larger radii are acceptable when they come
  from a shadcn primitive, but do not add `rounded-2xl`, `rounded-3xl`, `rounded-full`, or pill-like
  page containers to app routes.
- For tables, filters, dialogs, popovers, dropdown menus, tabs, switches, and charts, install the
  smallest appropriate React library or shadcn primitive instead of hand-rolling complex behavior.

## Shared blocks

The shared design-system library lives next to the templates under `/opt/site-templates/blocks/`.
For this React app template, copy from the React-canonical blocks:

```sh
mkdir -p src/components/app src/components/chat src/components/marketing
cp /opt/site-templates/blocks/react/app/PageHeader.tsx src/components/app/
cp /opt/site-templates/blocks/react/chat/ChatShell.tsx src/components/chat/
cp /opt/site-templates/blocks/react/marketing/Pricing.tsx src/components/marketing/
```

- `blocks/react/marketing/*` — public-site sections that also work in Astro.
- `blocks/react/app/*` — dashboard/internal-tool patterns, including `ChartCard` and `DataTable`.
- `blocks/react/chat/*` — transport-agnostic chat UI; wire it to your own API/data state.
- `blocks/react/nav/*` and `blocks/react/motion/*` — navigation and interaction helpers.

Do not copy from `blocks/astro/*` unless you are intentionally adding Astro-only content, MDX, or OG
image generation to the Astro template.

Read `/opt/site-templates/design-system.json` and `/opt/site-templates/styleguide.json` when you
need the machine-readable component inventory, token contract, or expected styleguide coverage.
Run `pnpm check:visual-drift` when editing app surfaces; it catches the most common heavy-header,
oversized-type, and too-round UI drift.

## Metadata and SEO

This template has a single `frontend/index.html`. Set baseline title, favicon, viewport, and generic
description there. For per-route metadata, add a small React effect helper or use a head-management
library only when the app genuinely needs route-specific titles.

Do not treat this as a substitute for static SEO pages. If most work is page metadata, OpenGraph
cards, content collections, or crawlable pages, switch to `astro-default`.

## Data and APIs

Default to client-side data access for public or user-scoped APIs. Keep request state local to the
route at first; introduce a shared data library only when multiple routes need caching, mutation
coordination, retries, or invalidation.

Create `backend/` only when the requested site needs server-side behavior that cannot safely or
efficiently run in the browser: private business logic, expensive calculations, server-side
validation, `/api/*` endpoints for the frontend, webhook-style handlers, or platform/runtime
mediation.

Do not create `backend/` for layout/styling work, static content, simple charts, client-side
filtering, or hard-coded mock data.

If backend is needed, create:

```txt
backend/
  package.json
  src/index.ts
```

`backend/package.json` should be a Worker package:

```json
{
  "private": true,
  "type": "module",
  "scripts": {
    "check": "tsc --noEmit"
  },
  "dependencies": {},
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20260525.1",
    "esbuild": "^0.27.1",
    "typescript": "^6.0.3"
  }
}
```

`backend/src/index.ts` must compile to a Cloudflare module Worker:

```ts
interface Env {}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({ ok: true });
    }

    return Response.json({ error: "Not found" }, { status: 404 });
  },
};
```

Only `/api` and `/api/*` requests route to the backend. Do not create Express, Fastify, Next.js API
routes, Node HTTP servers, or long-running processes. Do not call `listen()`. Do not use Node-only
modules or globals such as `fs`, `net`, `tls`, `child_process`, or `process`.

## Telemetry

`src/main.tsx` calls `initTelemetry()` from `@continual/sites-sdk/telemetry`. Do not remove it;
site breadcrumbs depend on it.

## Commands

From the template root:

```sh
pnpm install
pnpm dev
pnpm check
pnpm build
```

From `frontend/`, the same commands are available without `pnpm --dir frontend`.
