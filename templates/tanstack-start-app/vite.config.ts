import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Vite rejects requests forwarded through unknown hostnames to protect against
// DNS rebinding. These are the controlled sandbox-proxy suffixes Continual
// currently uses. A leading dot also permits provider-specific subdomains.
const defaultPreviewAllowedHosts = [
  ".tensorlake.ai",
  ".e2b.app",
  ".proxy.daytona.work",
  ".modal.host",
];

const configuredPreviewAllowedHosts = (
  process.env.CONTINUAL_ALLOWED_DEV_HOSTS ?? ""
)
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

export default defineConfig(({ command }) => {
  const previewVars =
    command === "serve"
      ? Object.fromEntries(
          [
            ["CONTINUAL_RUNTIME_ORIGIN", process.env.CONTINUAL_RUNTIME_ORIGIN],
            ["CONTINUAL_RUNTIME_URL", process.env.CONTINUAL_RUNTIME_URL],
            ["CONTINUAL_URL", process.env.CONTINUAL_URL],
            [
              "CONTINUAL_EXECUTION_TOKEN",
              process.env.CONTINUAL_EXECUTION_TOKEN,
            ],
          ].filter((entry): entry is [string, string] => Boolean(entry[1])),
        )
      : {};

  return {
    plugins: [
      cloudflare({
        viteEnvironment: { name: "ssr" },
        config: (config) => ({
          vars: { ...config.vars, ...previewVars },
        }),
      }),
      tanstackStart(),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    server: {
      allowedHosts: [
        ...defaultPreviewAllowedHosts,
        ...configuredPreviewAllowedHosts,
      ],
    },
  };
});
