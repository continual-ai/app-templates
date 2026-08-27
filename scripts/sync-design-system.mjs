import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");

const starterBlocks = [
  "AppShell",
  "EmptyState",
  "MetricCard",
  "PageHeader",
  "SidebarNav",
  "StarterDashboard",
];

const copies = [
  ["shared/styles/tokens.css", "templates/tanstack-start-app/src/styles/tokens.css"],
  ["shared/react/lib/utils.ts", "templates/tanstack-start-app/src/lib/utils.ts"],
  ["shared/react/hooks/use-mobile.ts", "templates/tanstack-start-app/src/hooks/use-mobile.ts"],
];

for (const primitive of readdirSync(resolve(root, "shared/react/components/ui"))) {
  copies.push([
    `shared/react/components/ui/${primitive}`,
    `templates/tanstack-start-app/src/components/ui/${primitive}`,
  ]);
}

for (const block of starterBlocks) {
  copies.push([
    `blocks/react/app/${block}.tsx`,
    `templates/tanstack-start-app/src/components/blocks/${block}.tsx`,
  ]);
}

const drift = [];

for (const [sourceName, targetName] of copies) {
  const source = resolve(root, sourceName);
  const target = resolve(root, targetName);
  const expected = readFileSync(source, "utf8");

  if (checkOnly) {
    if (!existsSync(target) || readFileSync(target, "utf8") !== expected) {
      drift.push(relative(root, target));
    }
    continue;
  }

  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, expected);
}

if (drift.length > 0) {
  console.error("Generated design-system assets are out of sync:");
  for (const file of drift) console.error(`- ${file}`);
  console.error("Run `pnpm design-system:sync` and review the generated changes.");
  process.exit(1);
}

console.log(
  checkOnly
    ? `Design-system sync check passed (${copies.length} assets)`
    : `Synchronized ${copies.length} design-system assets`,
);
