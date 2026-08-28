import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { assertSpawned } from "./lib/repo-config.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "blocks/react");
const target = resolve(root, "templates/tanstack-start-app/src/__blocks_check");

if (!existsSync(source)) {
  throw new Error(`Missing shared React blocks at ${source}`);
}

rmSync(target, { force: true, recursive: true });
cpSync(source, target, { recursive: true });

try {
  const result = spawnSync(
    "pnpm",
    ["--filter", "@continual/tanstack-start-app-template", "check"],
    {
      cwd: root,
      stdio: "inherit",
      shell: process.platform === "win32",
    }
  );

  assertSpawned("pnpm", ["--filter", "@continual/tanstack-start-app-template", "check"], result);
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
} finally {
  rmSync(target, { force: true, recursive: true });
}
