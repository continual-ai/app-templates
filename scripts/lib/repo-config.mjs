import { readFileSync, readdirSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

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

export function isGeneratedArtifact(source) {
  const name = basename(source);
  return generatedArtifactNames.has(name) || name.endsWith(".tsbuildinfo");
}

export function readWorkspaceSettings() {
  const source = readFileSync(resolve(repoRoot, "pnpm-workspace.yaml"), "utf8");
  const kept = [];
  let topLevelKey = null;

  for (const line of source.split("\n")) {
    if (line.trim() === "" || line.trimStart().startsWith("#")) continue;
    if (!/^\s/.test(line)) topLevelKey = line.split(":")[0].trim();
    if (topLevelKey === "packages") continue;
    kept.push(line);
  }

  if (!kept.some((line) => line.startsWith("allowBuilds:"))) {
    throw new Error("pnpm-workspace.yaml does not declare an allowBuilds policy");
  }
  return `${kept.join("\n")}\n`;
}

export function workspaceYaml(packagesGlob) {
  return `packages:\n  - "${packagesGlob}"\n${readWorkspaceSettings()}`;
}

export const sharedPrimitivesDir = "shared/react/components/ui";

export function listPrimitiveSources(directory) {
  const names = [];
  const unsupported = [];

  for (const entry of readdirSync(resolve(repoRoot, directory), { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".tsx")) {
      names.push(entry.name.slice(0, -".tsx".length));
    } else {
      unsupported.push(entry.name);
    }
  }

  return { names: names.sort(), unsupported: unsupported.sort() };
}
