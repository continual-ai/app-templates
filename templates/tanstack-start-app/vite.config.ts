import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
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
        viteEnvironment: { name: "ssr" },
        config: (config) => ({
          vars: { ...config.vars, ...previewVars },
        }),
      }),
      tanstackStart(),
      react(),
    ],
  };
});
