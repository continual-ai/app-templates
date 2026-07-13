/**
 * og-route.ts — dynamic OpenGraph image generation. COPY-ON-DEMAND / OPT-IN.
 *
 * Auto-generates a per-page social image from each page's title/description so
 * the <Seo /> `image` can point at a real preview card instead of nothing.
 *
 * Setup (see AGENTS.md "Dynamic OG images"):
 *   1) pnpm add astro-og-canvas
 *   2) copy this file to `src/pages/og/[...route].ts`
 *   3) point Seo at the generated image, e.g. in a blog post:
 *        <BlogPostLayout {...entry.data} image={`/og/${entry.id}.png`} ... />
 *      (the Seo `image` prop becomes og:image / twitter:image)
 *
 * Static output requires every OG image to be enumerated at build time, so we
 * build the `pages` map from content (here: the blog collection). Extend `pages`
 * with any other routes that need a card.
 *
 * NOTE: the colors below are raw RGB/hex because they configure a generated PNG
 * canvas (canvaskit), NOT the CSS design-token system. Mirror your brand here by
 * hand; tokens don't apply to rasterized images.
 */
import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

const posts = await getCollection("blog");

const pages = Object.fromEntries(
  posts.map((post) => [post.id, { title: post.data.title, description: post.data.description }])
);

export const { getStaticPaths, GET } = OGImageRoute({
  param: "route",
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    padding: 80,
    bgGradient: [
      [250, 250, 250],
      [235, 235, 235],
    ],
    border: { color: [20, 20, 20], width: 8, side: "inline-start" },
    font: {
      title: { color: [20, 20, 20], weight: "SemiBold", size: 64 },
      description: { color: [90, 90, 90], weight: "Normal", size: 30 },
    },
  }),
});
