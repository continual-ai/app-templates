# Working in this site (astro-default)

Guidance for any agent building or editing this site. It covers how routing/multi-page works in this
template and how to implement common things in this stack. It is more specific than the general
create-site skill; when they conflict, this wins.

This site is a small workspace:

- `frontend/` is an **Astro 6, `output: "static"`** app with React islands, Tailwind v4,
  shadcn-style UI primitives, and MDX.
- `backend/` is optional. Create it only when the site needs server-side `/api/*` logic that should
  run as a Cloudflare module Worker.

Most sites should stay frontend-only. The frontend is prerendered to static HTML at build time.
Runtime Continual API calls usually happen client-side via `@continual/sites-sdk`; see the
create-site skill for that.

Path alias inside `frontend/`: `@/*` → `frontend/src/*` (e.g. `@/layouts/Layout.astro`,
`@/components/ui/button`).

Unless a path is explicitly prefixed with `backend/`, paths like `src/...`, `public/...`,
`components.json`, `astro.config.mjs`, and `tsconfig.json` below are frontend paths. Run frontend
file commands from `frontend/` or prefix them with `frontend/` from the site root.

## Routing & multi-page sites

Astro uses **file-based routing** under `frontend/src/pages/`. The file path becomes the URL. There
is no router config and no route table — to add a route, add a file.

| File                              | URL              |
| --------------------------------- | ---------------- |
| `frontend/src/pages/index.astro`           | `/`              |
| `frontend/src/pages/about.astro`           | `/about`         |
| `frontend/src/pages/pricing.astro`         | `/pricing`       |
| `frontend/src/pages/blog/index.astro`      | `/blog`          |
| `frontend/src/pages/blog/first-post.astro` | `/blog/first-post` |
| `frontend/src/pages/blog/[slug].astro`     | `/blog/<slug>` (dynamic, see below) |

`.astro`, `.md`, and `.mdx` files in `src/pages/` all become pages. Folders create nested routes.

**Building a multi-page site (the common case):**

1. Create one file per page under `src/pages/`, each wrapping `<Layout>` (see below).
2. Build a single shared nav component (e.g. `src/components/SiteNav.astro`) and render it from
   `Layout.astro` so every page gets the same header/footer. Don't copy-paste nav markup into each
   page.
3. Link between pages with plain root-relative anchors: `<a href="/about">About</a>`. No client
   router needed — these are full-page static navigations. Use root-relative paths (`/pricing`), not
   relative (`pricing`), so links work from any depth.

**Dynamic routes** (`[param].astro`) must be prerendered because the output is static. Export
`getStaticPaths()` returning every path to build:

```astro
---
// src/pages/blog/[slug].astro
import Layout from "@/layouts/Layout.astro";

export function getStaticPaths() {
  const posts = [
    { slug: "hello-world", title: "Hello World", body: "..." },
    { slug: "second-post", title: "Second Post", body: "..." },
  ];
  return posts.map((post) => ({ params: { slug: post.slug }, props: { post } }));
}

const { post } = Astro.props;
---

<Layout title={post.title}>
  <article>{post.body}</article>
</Layout>
```

For a real blog/docs site with many entries, prefer **Astro content collections**
(`src/content/`, `getCollection()`) over hand-maintained arrays — it gives typed frontmatter and
scales. Add the content config only when the site genuinely needs it.

**What does NOT work here (static output):**

- No SSR / server-rendered routes, no `Astro.request` body reading, no per-request logic. A route
  with `[slug]` but no `getStaticPaths()` will fail the build.
- Static endpoints (non-HTML files generated at build) DO work — see
  `frontend/src/pages/robots.txt.ts` for the pattern (`export const GET`). Use these for
  `robots.txt`, JSON feeds, etc., not for dynamic request handling.

## Optional backend package

Default to frontend-only. Create `backend/` only when the requested site needs server-side behavior
that cannot safely or efficiently run in the browser: private business logic, expensive
calculations, server-side validation, `/api/*` endpoints for the frontend, webhook-style handlers,
or platform/runtime mediation.

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

## Layout & page structure

Every page wraps `@/layouts/Layout.astro` and passes `title` (plus optional `description`, `image`,
`canonical`, `type`):

```astro
---
import Layout from "@/layouts/Layout.astro";
---
<Layout title="About — Acme" description="What Acme does." image="/og/about.png">
  <main class="...">...</main>
</Layout>
```

`Layout.astro` owns `<html>`/`<head>`/`<body>`, imports global styles, wires telemetry, and renders
`<Seo>` (title, description, canonical, OpenGraph/Twitter cards) from those props. **Do not add a
second `<html>` or duplicate `<head>`** in pages, **set head metadata through Layout props rather
than editing `<head>`**, and **do not remove the telemetry `initTelemetry()` script** — site
breadcrumbs depend on it. Put shared chrome (nav, footer, skip links) in the layout or in components
rendered by it.

## What ships in the template

Beyond the `src/components/ui/` primitives, the template includes ready-to-use pieces — prefer wiring
these up over rebuilding them:

- **`src/pages/404.astro`** — styled not-found page. Static hosting serves it automatically; keep it.
- **`src/components/Seo.astro`** — all `<head>` metadata. You don't import it directly; pass
  `image` / `canonical` / `type` through `Layout` (see above).
- **Dark mode (opt-in):** `src/components/ThemeToggle.tsx` (a `client:`-hydrated toggle) plus
  `src/components/ThemeScript.astro` (a no-flash inline script). The token system already defines a
  full dark palette. To enable it, add `<ThemeScript />` to `Layout`'s `<head>` and place
  `<ThemeToggle client:load />` in the UI. Leave both out for a light-only site.
- **`src/components/ContactForm.tsx`** — accessible contact-form island with submit states. See
  "Forms" below for how to wire its backend.

These live in the scaffold unused until you import them. Delete any you don't use before publishing.

## Composing from layouts & blocks

There's a shared library next to the templates — a **starting kit to move fast, not a fence.** Reach
for it first for common page shells and sections so you don't redo the boring parts — but it's a
vocabulary, not the whole language. When the design needs something the library doesn't have, **build
your own** block/layout/component; that's expected, not a workaround. It's organized as a small design
system:

`ui primitives → blocks (sections) → layouts (page shells) → base Layout (html/head/telemetry)`

- **Layouts** (`/opt/site-templates/layouts/*.astro`) — full **page shells** that wrap the base
  `Layout` and own the hard structural/responsive behavior (sticky header, sidebar with independent
  scroll + mobile drawer, full-height columns). Pick ONE per page and fill its named slots:
  `MarketingLayout` (contained pages), `SectionedLayout` (full-bleed landing), `SidebarLayout`
  (app/dashboard), `DocsLayout` (docs: nav + content + TOC rail), `BlogPostLayout` (single post:
  header + cover + prose — see "Blog / content").
- **Blocks** (`/opt/site-templates/blocks/**`) — drop-in **sections**. Static `.astro` unless marked
  (island):
  - Heroes & content: `sections/Hero.astro`, `sections/HeroSplit.astro`, `sections/Features.astro`,
    `sections/Bento.astro` (asymmetric grid), `sections/CTA.astro`, `sections/Footer.astro`.
  - Marketing: `sections/Pricing.astro` (tiers + popular), `sections/Stats.astro` (metrics band),
    `sections/Testimonials.astro`, `sections/LogoCloud.astro`, `sections/Team.astro`,
    `sections/Gallery.astro`.
  - Interactive (island, needs a `client:` directive): `nav/SiteNav.tsx` (mobile menu),
    `sections/FAQ.tsx` (accordion), `sections/Newsletter.tsx` (email capture).
  - Content: `sections/BlogIndex.astro` (post cards — see "Blog / content").
  - Motion: `motion/Reveal.tsx` (scroll reveal — see "Motion").
  - MDX: `mdx/Callout.astro`, `mdx/Figure.astro`, `mdx/CodeBlock.astro` (see "Blog / content").

**How to use one — copy it into the site, then import and fill props:**

```sh
mkdir -p src/components/sections
cp /opt/site-templates/layouts/SectionedLayout.astro src/layouts/
cp /opt/site-templates/blocks/sections/Hero.astro     src/components/sections/
cp /opt/site-templates/blocks/nav/SiteNav.tsx         src/components/
```

```astro
---
import SectionedLayout from "@/layouts/SectionedLayout.astro";
import SiteNav from "@/components/SiteNav";
import Hero from "@/components/sections/Hero.astro";
---
<SectionedLayout title="Acme — Ship faster">
  <SiteNav slot="header" client:load brand="Acme" links={[{ label: "Pricing", href: "/pricing" }]} />
  <Hero title="Ship faster" subtitle="…" primaryCta={{ label: "Start", href: "/signup" }} />
</SectionedLayout>
```

**Rules of the road:**

- **Each file is self-documenting** — its header comment is the catalog entry (props, slots,
  prerequisites, usage). Read it before copying. To browse the whole library at once:

  ```sh
  head -n 28 /opt/site-templates/layouts/*.astro /opt/site-templates/blocks/*/*
  ```

  The template also ships `src/pages/_styleguide.astro` — a hidden reference (not built/served;
  rename to `styleguide.astro` to view) rendering the token palette (light + dark), the type scale,
  and the full block/layout catalog at a glance.

- **Honor prerequisites.** Blocks assume this template's contract (`@/lib/utils`, `@/components/ui/*`,
  the design tokens, lucide/radix). If a file's header names an extra prerequisite (e.g.
  `shadcn add accordion`), run it first or the copied import breaks.
- **Copy only what you use.** The build already drops anything unimported, so unused blocks cost
  nothing in `dist/` — but keep the source lean by copying on demand rather than wholesale.
- **Customize after copying** — the files are now yours; edit content, classes, and props freely.
- **Build your own when it fits better.** The library is a head start, not the whole vocabulary — if a
  section, layout, or component the site needs isn't here (or a canned one would compromise the
  design), author it directly in `src/components/…`. Hold custom pieces to the same bar: design tokens
  (never raw colors), `cn()` for class merging, static `.astro` by default with a React island only
  where interaction requires it, WCAG AA — and give a reusable one the same header comment so it stays
  self-documenting. Composing and authoring are equally first-class.

## Motion

Keep motion subtle — it should make a site feel considered, not gimmicky. Two tools:

- **`motion/Reveal.tsx`** — a dependency-light island that fades/slides content up as it scrolls into
  view (IntersectionObserver). Wrap a section, or pass `stagger` to cascade its direct children. It
  respects `prefers-reduced-motion` and degrades safely without JS (content is never left hidden).
  Copy it in and use with a client directive:

  ```astro
  import Reveal from "@/components/motion/Reveal";
  <Reveal client:visible><Features … /></Reveal>
  <Reveal client:visible stagger={80}>{cards}</Reveal>
  ```

  Use one Reveal per section (or a single staggered group), not on every element.

- **`tw-animate-css`** (already imported in `global.css`) for one-shot entrance/marquee/spin effects
  via utility classes, e.g. `animate-in fade-in slide-in-from-bottom-4 duration-700` on an element,
  or `animate-pulse` for skeletons. Pair with `motion-reduce:animate-none` so reduced-motion users
  opt out. Reach for `Reveal` for scroll-triggered reveals; reach for `tw-animate-css` for immediate,
  on-load flourishes.

## Blog / content (opt-in)

A typed blog/content system ships in the library but is **not baked into every site** — enable it
only when the site needs articles/docs. One-time setup:

1. **Collection config:** copy `/opt/site-templates/blocks/content/content.config.ts` to
   `src/content.config.ts`. It defines a `blog` collection (frontmatter: `title`, `description`,
   `date`, `author?`, `image?`, `draft?`) loaded from `src/content/blog/**/*.{md,mdx}`.
2. **Typography:** `pnpm add -D @tailwindcss/typography`, then add `@plugin "@tailwindcss/typography";`
   near the top of `src/styles/global.css`. This powers the `prose` body styling in `BlogPostLayout`.
3. **Post layout:** copy `/opt/site-templates/layouts/BlogPostLayout.astro` to `src/layouts/`. It
   renders the title/date/author header, an optional cover, and a token-aware `prose` body.
4. **Routes:** add `src/pages/blog/[...slug].astro` (uses `getCollection` + `render` and
   `BlogPostLayout`, with `<Content components={{ pre: CodeBlock }} />`) and `src/pages/blog/index.astro`
   (maps `getCollection("blog")` into the `BlogIndex` block's `posts` prop).
5. **MDX components** (`/opt/site-templates/blocks/mdx/`) — copy to `src/components/mdx/`:
   - `Callout.astro` — info / warn / success aside (note: the base palette has no green/amber, so
     variants map to muted/primary/destructive tokens).
   - `Figure.astro` — image + caption.
   - `CodeBlock.astro` — `<pre>` with a copy button; wire it as the MDX `pre` override via the
     `components` prop on `<Content>`. Use `Callout`/`Figure` by importing them inside the `.mdx` file.

Keep it opt-in: if the site has no blog, skip all of the above.

## Interactivity: React islands

Astro renders everything to static HTML by default — **React components are not interactive unless
you hydrate them with a `client:` directive.** Pages stay fast because only the islands ship JS.

```astro
---
import ThemeToggle from "@/components/ThemeToggle";
import Newsletter from "@/components/Newsletter";
---
<ThemeToggle client:load />     <!-- hydrate immediately -->
<Newsletter client:visible />   <!-- hydrate when scrolled into view -->
```

Use `client:load` for above-the-fold interactivity, `client:visible` / `client:idle` to defer.
Components with no directive render as static markup (fine for purely presentational pieces).
**Continual SDK calls must run inside a hydrated (client-side) island** — server-rendered Astro
frontmatter has no preview token. Keep data-fetching in the React island's effects, not in `.astro`
frontmatter.

## UI primitives & styling

- **shadcn components** live in `src/components/ui/` (`button`, `card`, `input` ship by default). Add
  more with the shadcn CLI — see "Adding shadcn components" below. Prefer a shadcn primitive over
  re-implementing a standard one, but compose and restyle them freely, and build bespoke components
  when the design calls for them.
- Merge classes with `cn()` from `@/lib/utils` (clsx + tailwind-merge) instead of string
  concatenation.
- **Tailwind v4** (via `@tailwindcss/vite`). Use the **design tokens** defined in
  `src/styles/global.css` — `bg-background`, `text-foreground`, `text-muted-foreground`, `border`,
  etc. — rather than raw colors like `text-gray-500`, so light/dark and theming stay consistent. Edit
  the tokens in `global.css` to rebrand; don't scatter hardcoded hex values.
- Fonts: Geist (`@fontsource-variable/geist`) is available — import it where you set up typography.
- Icons: `lucide-react` is installed.

## Theming — generate a direction, don't pick from presets

The whole look is token-driven (`src/styles/global.css`), so you **generate** a palette to fit the
brand rather than choosing a canned theme. A direction is a set of token values applied to `:root`
(light) and `.dark` (dark) — the same layouts and blocks then render in that look.

**Token contract** — when theming, set/override these (keep the names; values are oklch):

- Surfaces: `--background`/`--foreground`, `--card`/`--card-foreground`, `--popover`/`--popover-foreground`,
  `--muted`/`--muted-foreground`
- Brand & actions: `--primary`/`--primary-foreground`, `--secondary`/`--secondary-foreground`,
  `--accent`/`--accent-foreground`, `--destructive`
- Lines & affordances: `--border`, `--input`, `--ring`
- Shape & type: `--radius`, `--font-heading` (headings already use `font-heading`)
- Optional: `--chart-1..5`, `--sidebar*`

**Rules (non-negotiable):**

- Define **both** `:root` and `.dark`. Every `--x-foreground` must stay legible on its `--x` — target
  WCAG AA (4.5:1 body text, 3:1 large text / UI). Specifically check foreground-on-background,
  foreground-on-card/-muted, and primary-foreground-on-primary.
- Use oklch and a consistent hue family so the palette reads as intentional.
- Non-system heading font? Set `--font-heading` **and** add the font (`pnpm add @fontsource-variable/<x>`
  + import) — otherwise use a system stack (e.g. `ui-serif, Georgia, serif`).

Reference seeds to learn the shape (then generate your own — don't just copy):
`/opt/site-templates/variants/theme-seeds.css`.

**Preview vs bake:** to let the user compare directions, apply each as a scoped override
`html[data-theme="<id>"] { … }` and use the `VariantChooser` (below) to flip between them live. Once
the user picks, **bake** the winner straight into `:root`/`.dark` in `global.css` and delete the
scoped overrides + the chooser.

## Proposing variants (offer directions, let the user pick)

For high-impact, genuinely ambiguous, hard-to-reverse decisions — the overall aesthetic, the site's
structure/IA, or a key feature's approach — don't guess silently and don't ask an abstract text
question. **Generate 2–3 concrete variants, show them rendered, and let the user pick.** For
everything else, choose a sensible default and keep moving (the user can redirect). Never turn this
into a constant quiz — branch only where it materially changes what the user gets.

Copy the chooser in while proposing (it's proposal-time tooling, not site content):

```sh
cp /opt/site-templates/variants/VariantChooser.tsx src/components/
```

The chooser shows as a small bubble in the corner that expands into a panel of options. Give each
variant a **`blurb`** — a short, user-facing description of the direction; it's shown in the panel, so
write it for the user.

**Mode 1 — style / token variants (cheap, same page).** Apply each direction as a scoped
`html[data-theme="<id>"]` override (see Theming), then flip between them instantly on the user's real
content:

```astro
import VariantChooser from "@/components/VariantChooser";
<VariantChooser title="Aesthetic" client:load
  variants={[
    { id: "base", label: "Minimal", blurb: "Neutral, flat, tight" },
    { id: "editorial", label: "Editorial", blurb: "Warm paper, serif headings, calm" },
    { id: "vibrant", label: "Vibrant", blurb: "Saturated violet, rounded, bold" },
  ]} />
```

**Mode 2 — structure / feature variants (more work, separate routes).** There's no attribute to flip,
so build each variant as a throwaway preview route under `src/pages/preview/` and give the chooser
`href`s; the user navigates between separately-rendered versions:

```astro
<VariantChooser title="Pricing" client:load
  variants={[
    { id: "cards", label: "Cards", blurb: "Three tiers side by side", href: "/preview/pricing-cards" },
    { id: "table", label: "Table", blurb: "Feature-comparison grid", href: "/preview/pricing-table" },
  ]} />
```

**Pick → bake → clean up.** The user names the one they want (referencing the labels). Then collapse
to it: for style, bake the tokens into `:root`/`.dark`; for structure, move the chosen route's markup
into the real page. **Delete the `VariantChooser`, the scoped overrides, and every alternative /
preview route** before committing — the site ships single-variant and clean.

## Adding shadcn components

`components.json` is already configured for this template (style `radix-nova`, `neutral` base color,
`lucide` icons, tokens in `src/styles/global.css`, `@/components/ui` alias). **Do not run
`shadcn init`** — it's already set up. Just add components, running the CLI from the site directory:

```sh
pnpm dlx shadcn@latest add dialog
```

- **Multiple at once:** `pnpm dlx shadcn@latest add dialog tabs badge`.
- **Flags:** `-y` skip prompts · `-o` overwrite existing files · `-a` add all components ·
  `-p <path>` custom target dir.
- **Where they land:** `src/components/ui/` (the `ui` alias); import as `@/components/ui/<name>`.
  Generated components use Radix primitives and `cn()` from `@/lib/utils` — both already installed,
  so the `add` resolves cleanly without extra setup.
- **From a URL or local path:** the component argument also accepts a full registry URL
  (`pnpm dlx shadcn@latest add https://registry.example.com/button.json`) or a local path — handy for
  one-off blocks.
- **Other design systems / third-party registries:** map a namespace to a registry URL under
  `registries` in `components.json` (the `{name}` placeholder is filled in at install time), then add
  by namespace. Use `${ENV_VAR}` headers for private registries:

  ```json
  // components.json
  "registries": {
    "@acme": "https://registry.acme.com/{name}.json"
  }
  ```

  ```sh
  pnpm dlx shadcn@latest add @acme/button @acme/hero
  ```
- **Hydration:** interactive components (dialog, dropdown, tabs, accordion, forms) are React, so when
  you use them in an `.astro` page they need a `client:` directive (see Interactivity above).
  Presentational ones (badge, card, separator) can render statically.

## Images

Use Astro's built-in `astro:assets` `<Image>` for anything you import — it optimizes format, size,
and lazy-loads, which raw `<img>` does not:

```astro
---
import { Image } from "astro:assets";
import hero from "@/assets/hero.jpg"; // local file in src/assets/
---
<Image src={hero} alt="..." width={1200} height={630} />
```

- **`src/assets/`** — images you `import` and optimize through `<Image>`. Preferred for content.
- **`public/`** — files served as-is at the root (favicons, `og` images, downloads). Not optimized,
  referenced by absolute path (`/favicon.svg`).
- You can't generate real photography — use the user's assets, an explicit placeholder service, or a
  tasteful illustration/gradient built from tokens. Always set `alt`, and `width`/`height` (or
  `aspect-ratio`) to avoid layout shift.

## Forms

`ContactForm` (shipped) and `Newsletter` (block) handle client-side validation and inline,
aria-correct error states for you. There is **no server** on a static site, so a form can't POST to
your own backend — both components support two submission paths via props:

- **Public site →** pass `action` (a third-party form backend like Formspree / Web3Forms). A normal
  cross-origin POST that works on public hosting:

  ```astro
  ---
  import ContactForm from "@/components/ContactForm";
  ---
  <ContactForm action="https://formspree.io/f/yourid" client:load />
  ```

- **Private / in-thread preview site →** pass `tool={{ appInstallationId, name }}` instead of
  `action`. The form fields become the tool arguments and the component calls `@continual/sites-sdk`
  (`callContinualToolJson`) from the hydrated island. Live Continual calls only work on
  private/preview sites — see the create-site skill's "Sites that call Continual APIs" section.

  ```astro
  <ContactForm tool={{ appInstallationId: "appi_…", name: "leads__create" }} client:load />
  ```

Both are React islands and need a `client:` directive. They handle validation, the disabled/submitting
state, success confirmation, and `ContinualRuntimeError` messaging — don't reimplement those.

## SEO & build

- `@astrojs/sitemap` auto-generates the sitemap; `robots.txt` is served by `src/pages/robots.txt.ts`.
  Both rely on `SITE_URL`, which Continual injects at build time — don't hardcode the production
  hostname.
- Set per-page metadata (`title`, `description`, OG `image`) through `Layout` props — `<Seo>` turns
  them into title/description/canonical + OpenGraph/Twitter tags. Don't edit `<head>` directly.
- Build output goes to `frontend/dist/` (matches `template.json`'s `buildOutDir`). Don't change it
  without updating `template.json`.

## Dynamic OG images (opt-in)

`<Seo>` already accepts an `image` (becomes `og:image` / `twitter:image`). To auto-generate a per-page
social card from the title/description instead of hand-making images, enable the OG route — opt-in
because it pulls a rendering dependency:

1. `pnpm add astro-og-canvas`
2. copy `/opt/site-templates/blocks/og/og-route.ts` to `src/pages/og/[...route].ts`. It enumerates the
   pages to render (by default, the blog collection) and emits a PNG per page at build.
3. point `Seo` at the generated image, e.g. `image={`/og/${entry.id}.png`}` on a post.

Static output requires every OG image to be enumerated at build, so extend the route's `pages` map for
non-blog routes. NOTE: the card colors in `og-route.ts` are raw RGB — they configure a rasterized
canvas, not the CSS token system, so set them to mirror the brand by hand.

## Gotchas checklist

- Adding a page? Drop a file in `src/pages/` — no config to touch.
- `[param]` route? It needs `getStaticPaths()` or the build fails.
- Button/form not responding? It's missing a `client:` directive.
- Live Continual data? Fetch it client-side in a hydrated island, never in `.astro` frontmatter.
- Colors look off in dark mode / after rebrand? You used raw colors instead of tokens.
- Contact form on a public site? Wire `ContactForm`'s `action` to a third-party backend — a static
  site has no server to POST to.
- Dark-mode toggle flips but flashes on load? You added `<ThemeToggle>` without `<ThemeScript />` in
  the `<head>`.
- Images blurry/heavy or shifting layout? Use `astro:assets` `<Image>` with `alt` + dimensions.
- Set page title/description/OG via `Layout` props, not by hand-editing `<head>`.
- Need a common section/page shell? Check the library first to move fast — but build a custom one when the design needs something it doesn't have.
- `Reveal`, `FAQ`, `Newsletter`, `SiteNav` not animating/interacting? They're islands — add `client:`.
- `prose` body unstyled in a blog post? Install `@tailwindcss/typography` and add the `@plugin` line
  (blog is opt-in — see "Blog / content").
- Building a blog? Start from `BlogIndex`, `BlogPostLayout`, and the MDX components (the form blocks
  already validate), then customize — or build your own if they don't fit.
- Keep `template.json` in the site (the publish build reads it).
