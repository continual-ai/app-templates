import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const template = resolve(root, "templates/tanstack-start-app");
const failures = [];

const config = readFileSync(resolve(template, "vite.config.ts"), "utf8");
for (const binding of ["DATABASE_URL", "DATABASE_SCHEMA"]) {
  if (!config.includes(`["${binding}", process.env.${binding}]`)) {
    failures.push(`tanstack-start-app: local Worker config must inject ${binding}`);
  }
}
if (!config.includes('command === "serve"')) {
  failures.push("tanstack-start-app: database bindings must be limited to local dev and preview");
}

const wrangler = readFileSync(resolve(template, "wrangler.jsonc"), "utf8");
if (wrangler.includes("DATABASE_URL") || wrangler.includes("DATABASE_SCHEMA")) {
  failures.push("tanstack-start-app: production Wrangler config must not contain database credentials");
}

const healthRoute = readFileSync(resolve(template, "src/routes/api.health.ts"), "utf8");
if (!healthRoute.includes('createFileRoute("/api/health")') || !healthRoute.includes("GET:")) {
  failures.push("tanstack-start-app: missing GET /api/health route");
}

const guidance = readFileSync(resolve(template, "AGENTS.md"), "utf8");
if (!guidance.includes("env.DATABASE?.connectionString ?? env.DATABASE_URL")) {
  failures.push("tanstack-start-app: missing server-only Hyperdrive/local database guidance");
}

if (failures.length > 0) {
  console.error("Local Worker binding assertions failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Local Worker binding assertions passed");
