import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const templates = ["tanstack-start-app"];
const generatedArtifactNames = new Set([
  "node_modules",
  "dist",
  ".astro",
  ".next",
  ".output",
  ".open-next",
  ".wrangler",
  ".continual",
  ".tanstack",
  ".vite",
  "next-env.d.ts",
]);
const requested = process.argv.slice(2).filter((argument) => !argument.startsWith("--"));
const selected = requested.length > 0 ? templates.filter((template) => requested.includes(template)) : templates;
const temporaryRoot = mkdtempSync(resolve(tmpdir(), "continual-app-templates-"));
const results = [];

if (selected.length === 0) {
  throw new Error(`Unknown template. Choose one of: ${templates.join(", ")}`);
}

function run(command, args, cwd) {
  const started = Date.now();
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, CI: "1" },
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status ?? 1}`);
  }
  return Math.round((Date.now() - started) / 100) / 10;
}

function isGeneratedArtifact(source) {
  const name = basename(source);
  return generatedArtifactNames.has(name) || name.endsWith(".tsbuildinfo");
}

try {
  run("pnpm", ["check:design-system"], root);

  for (const template of selected) {
    const workspace = resolve(temporaryRoot, template);
    const scaffold = resolve(workspace, "templates", template);
    mkdirSync(resolve(workspace, "templates"), { recursive: true });
    cpSync(resolve(root, "templates", template), scaffold, {
      recursive: true,
      filter: (source) => !isGeneratedArtifact(source),
    });
    cpSync(resolve(root, "package.json"), resolve(workspace, "package.json"));
    cpSync(resolve(root, "pnpm-lock.yaml"), resolve(workspace, "pnpm-lock.yaml"));
    writeFileSync(
      resolve(workspace, "pnpm-workspace.yaml"),
      'packages:\n  - "templates/*"\nallowBuilds:\n  esbuild: true\n  sharp: true\n  workerd: true\nminimumReleaseAgeExclude:\n  - "@continual/sdk@0.1.3"\n',
    );

    const install = run("pnpm", ["install", "--offline", "--frozen-lockfile"], scaffold);
    const check = run("pnpm", ["check"], scaffold);
    const build = run("pnpm", ["build"], scaffold);
    results.push({ template, scaffold: "passed", install, check, build });
  }
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}

console.log("\nTemplate verification matrix (seconds)");
console.table(results);
