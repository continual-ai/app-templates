import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

for (const template of ["tanstack-start-app"]) {
  const config = readFileSync(resolve(root, "templates", template, "vite.config.ts"), "utf8");
  for (const binding of ["DATABASE_URL", "DATABASE_SCHEMA"]) {
    if (!config.includes(`["${binding}", process.env.${binding}]`)) {
      failures.push(`${template}: local Worker config must inject ${binding}`);
    }
  }
  if (!config.includes('command === "serve"')) {
    failures.push(`${template}: database bindings must be limited to local dev and preview`);
  }

  const wrangler = readFileSync(resolve(root, "templates", template, "wrangler.jsonc"), "utf8");
  if (wrangler.includes("DATABASE_URL") || wrangler.includes("DATABASE_SCHEMA")) {
    failures.push(`${template}: production Wrangler config must not contain database credentials`);
  }
}

const healthRoute = readFileSync(
  resolve(root, "templates/tanstack-start-app/src/routes/api.health.ts"),
  "utf8",
);
if (!healthRoute.includes('createFileRoute("/api/health")') || !healthRoute.includes("GET:")) {
  failures.push("tanstack-start-app: missing GET /api/health route");
}

for (const template of ["tanstack-start-app"]) {
  const guidance = readFileSync(resolve(root, "templates", template, "AGENTS.md"), "utf8");
  if (!guidance.includes("env.DATABASE?.connectionString ?? env.DATABASE_URL")) {
    failures.push(`${template}: missing server-only Hyperdrive/local database guidance`);
  }
}

if (failures.length > 0) {
  console.error("Local Worker binding assertions failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Local Worker binding assertions passed");
