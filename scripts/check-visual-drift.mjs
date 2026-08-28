import { readFileSync, readdirSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const scanRoots = [
  "templates/tanstack-start-app/src/routes",
  "blocks/react/app",
  "blocks/react/chat",
];

const rules = [
  {
    id: "no-heavy-radius",
    pattern: /\brounded-(2xl|3xl|4xl|full)\b/g,
    message: "App surfaces should stay close to default shadcn radius. Prefer primitives, rounded-md, or rounded-lg.",
  },
  {
    id: "no-hero-type",
    pattern: /\btext-(4xl|5xl|6xl|7xl|8xl|9xl)\b/g,
    message: "App surfaces should not use hero-scale type. Prefer text-2xl or smaller for page headers.",
  },
  {
    id: "no-hero-padding",
    pattern: /\bpy-(16|20|24|28|32|36|40)\b/g,
    message: "App surfaces should not use landing-page vertical padding. Prefer py-4, py-5, or py-6.",
  },
  {
    id: "no-landing-viewport",
    pattern: /\b(min-h-screen|h-screen)\b/g,
    message: "App surfaces should not use full-screen landing-page layout unless building a focused tool canvas.",
  },
];

function listFiles(paths) {
  const files = [];
  for (const path of paths) {
    const absolute = resolve(root, path);
    let stats;
    try {
      stats = statSync(absolute);
    } catch {
      throw new Error(`Visual drift scan root does not exist: ${path}`);
    }
    if (!stats.isDirectory()) {
      throw new Error(`Visual drift scan root is not a directory: ${path}`);
    }

    for (const entry of readdirSync(absolute, { recursive: true, withFileTypes: true })) {
      if (!entry.isFile()) continue;
      if (!entry.name.endsWith(".tsx") && !entry.name.endsWith(".ts")) continue;
      files.push(resolve(entry.parentPath ?? entry.path, entry.name));
    }
  }
  return [...new Set(files)];
}

const findings = [];

for (const file of listFiles(scanRoots)) {
  const source = readFileSync(file, "utf8");
  const lines = source.split("\n");

  lines.forEach((line, index) => {
    for (const rule of rules) {
      rule.pattern.lastIndex = 0;
      const matches = [...line.matchAll(rule.pattern)];
      for (const match of matches) {
        findings.push({
          file: relative(root, file),
          line: index + 1,
          rule: rule.id,
          token: match[0],
          message: rule.message,
        });
      }
    }
  });
}

if (findings.length > 0) {
  console.error("Visual drift guard failed:\n");
  for (const finding of findings) {
    console.error(`${finding.file}:${finding.line} ${finding.rule} (${finding.token})`);
    console.error(`  ${finding.message}`);
  }
  process.exit(1);
}

console.log("Visual drift guard passed");
