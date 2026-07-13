/**
 * content.config.ts — Astro content-collections config for a "blog" collection.
 * COPY-ON-DEMAND: this is opt-in. To enable the blog, copy this file to the
 * project root as `src/content.config.ts`, add posts under `src/content/blog/`
 * as .md/.mdx, and follow the "Blog / content" setup in AGENTS.md (typography
 * plugin + post/index routes). Without it, nothing changes.
 *
 * Frontmatter schema: title, description, date, author?, image?, draft?.
 * Images are optimized via astro:assets (the `image()` helper), so reference a
 * local file in the post's frontmatter (e.g. ./cover.jpg).
 */
import { defineCollection } from "astro:content";
import { z } from "astro:schema";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      author: z.string().optional(),
      image: image().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
