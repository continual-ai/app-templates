import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

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
        config: (config) => ({
          vars: { ...config.vars, ...previewVars },
        }),
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    server: {
      fs: {
        allow: [
          path.resolve(import.meta.dirname, "../.."),
          path.resolve(import.meta.dirname, "../../.."),
        ],
      },
    },
  };
});
