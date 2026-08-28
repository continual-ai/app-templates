import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { assertSucceeded, isGeneratedArtifact, repoRoot as root, workspaceYaml } from "./lib/repo-config.mjs";

const templates = ["tanstack-start-app"];
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
  assertSucceeded(command, args, result);
  return Math.round((Date.now() - started) / 100) / 10;
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
      workspaceYaml("templates/*"),
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
