// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const projectRoot = dirname(fileURLToPath(import.meta.url));

// `site` is the absolute URL the build is being deployed under. Continual
// injects SITE_URL at build time (the published hostname for this App).
// During local dev (or when SITE_URL is unset) we fall back to a placeholder
// so the sitemap integration has something to work with — those URLs aren't
// shipped to production builds anyway.
const site = process.env.SITE_URL ?? "https://example.com";

// https://astro.build/config
export default defineConfig({
  site,
  output: "static",
  integrations: [react(), mdx(), sitemap()],
  // Hide the dev-mode toolbar so users iterating in the editor iframe don't
  // see Astro branding or floating dev UI that isn't part of their App.
  devToolbar: { enabled: false },
  server: {
    host: "0.0.0.0",
    port: 4321,
  },
  vite: {
    plugins: [tailwindcss()],
    // Force a single React instance. When an App is installed inside a pnpm
    // workspace, React can otherwise resolve to two copies and island hooks
    // fail at runtime with "Cannot read properties of null (reading 'useState')".
    // Harmless for a standalone install.
    resolve: { dedupe: ["react", "react-dom"] },
    server: {
      // Daytona's preview proxy serves this dev server under arbitrary
      // hostnames (e.g. <previewHostId>{-env}.continual.{site|run}). Vite
      // blocks unknown hosts by default; we allow all because the proxy
      // controls who can reach us.
      allowedHosts: true,
      // Let the dev server read files from above the project dir — so fonts and
      // React client runtime resolve when deps are hoisted to a workspace root
      // (pnpm workspace). Three levels up is this repo root; two levels up
      // covers copied Apps at <repo>/apps/<app-id>.
      fs: { allow: [resolve(projectRoot, "../.."), resolve(projectRoot, "../../..")] },
    },
  },
});
