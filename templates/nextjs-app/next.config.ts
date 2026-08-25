import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

initOpenNextCloudflareForDev();

const configuredDevOrigins = (process.env.CONTINUAL_ALLOWED_DEV_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export default {
  reactStrictMode: true,
  allowedDevOrigins: [
    "*.daytonaproxy01.net",
    "**.tensorlake.ai",
    "*.e2b.dev",
    "*.modal.run",
    ...configuredDevOrigins,
  ],
} satisfies NextConfig;
