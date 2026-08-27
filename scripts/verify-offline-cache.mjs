import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { performance } from "node:perf_hooks";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const template = resolve(root, "templates/tanstack-start-app");
const temporaryRoot = mkdtempSync(resolve(tmpdir(), "continual-tanstack-offline-"));
const workspace = resolve(temporaryRoot, "project");
const scaffold = resolve(workspace, "apps/app");
const warmScaffold = resolve(temporaryRoot, "warm");
const excluded = new Set(["node_modules", "dist", ".continual", ".wrangler"]);
const workspaceSettings =
  'allowBuilds:\n  esbuild: true\n  sharp: true\n  workerd: true\nminimumReleaseAgeExclude:\n  - "@continual/sdk@0.1.2"\n';

function copyTemplate(destination) {
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(template, destination, {
    recursive: true,
    filter: (source) => !excluded.has(basename(source)),
  });
}

function run(cwd, command, args) {
  const startedAt = performance.now();
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, CI: "1" },
    stdio: "inherit",
  });
  const seconds = Number(((performance.now() - startedAt) / 1000).toFixed(2));

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}`);
  }
  return seconds;
}

function output(cwd, command, args) {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, CI: "1" },
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}`);
  }
  return result.stdout.trim();
}

try {
  if (process.argv.includes("--warm")) {
    copyTemplate(warmScaffold);
    writeFileSync(resolve(warmScaffold, "pnpm-workspace.yaml"), workspaceSettings);
    const warmSeconds = run(warmScaffold, "pnpm", [
      "install",
      "--frozen-lockfile=false",
      "--side-effects-cache",
      "--config.dangerouslyAllowAllBuilds=true",
    ]);
    console.log(`TanStack cache warm completed in ${warmSeconds}s`);
  }

  mkdirSync(workspace, { recursive: true });
  writeFileSync(
    resolve(workspace, "package.json"),
    `${JSON.stringify({ private: true, packageManager: "pnpm@11.3.0" }, null, 2)}\n`
  );
  writeFileSync(
    resolve(workspace, "pnpm-workspace.yaml"),
    `packages:\n  - "apps/*"\n${workspaceSettings}`
  );
  copyTemplate(scaffold);
  const pnpmVersion = output(scaffold, "pnpm", ["--version"]);
  const storePath = output(scaffold, "pnpm", ["store", "path"]);
  if (pnpmVersion !== "11.3.0") {
    throw new Error(`Expected scaffold pnpm 11.3.0, received ${pnpmVersion}`);
  }
  console.log(`Verifying pnpm ${pnpmVersion} cache at ${storePath}`);

  const installSeconds = run(scaffold, "pnpm", [
    "install",
    "--offline",
    "--frozen-lockfile=false",
    "--side-effects-cache-readonly",
  ]);
  const checkSeconds = run(scaffold, "pnpm", ["check"]);
  const buildSeconds = run(scaffold, "pnpm", ["build"]);

  if (!existsSync(resolve(scaffold, "dist/server/wrangler.json"))) {
    throw new Error("TanStack build did not emit dist/server/wrangler.json");
  }
  if (!existsSync(resolve(scaffold, "dist/client"))) {
    throw new Error("TanStack build did not emit dist/client");
  }

  console.log(
    `Offline TanStack cache verification passed: install=${installSeconds}s check=${checkSeconds}s build=${buildSeconds}s`
  );
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
