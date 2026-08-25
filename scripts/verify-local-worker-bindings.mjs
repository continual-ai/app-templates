import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

for (const template of ["react-app", "tanstack-start-app"]) {
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

const reactPackage = JSON.parse(readFileSync(resolve(root, "templates/react-app/package.json"), "utf8"));
if (!reactPackage.devDependencies?.["@types/node"]) {
  failures.push("react-app: missing @types/node development dependency");
}

const reactNodeTsconfig = JSON.parse(readFileSync(resolve(root, "templates/react-app/tsconfig.node.json"), "utf8"));
if (!reactNodeTsconfig.compilerOptions?.types?.includes("node")) {
  failures.push("react-app: Vite tsconfig must include Node types");
}

const healthRoute = readFileSync(resolve(root, "templates/react-app/worker/index.ts"), "utf8");
if (!healthRoute.includes("databaseConfigured") || !healthRoute.includes("env.DATABASE?.connectionString ?? env.DATABASE_URL")) {
  failures.push("react-app: health route must report database binding availability without exposing its value");
}

for (const template of ["react-app", "tanstack-start-app"]) {
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
