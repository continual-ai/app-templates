import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  listPrimitiveSources,
  pnpmPackageManager,
  repoRoot as root,
  sharedPrimitivesDir,
} from "./lib/repo-config.mjs";

const templateRoot = resolve(root, "templates/tanstack-start-app");
const requiredTokens = [
  "--background:",
  "--foreground:",
  "--card:",
  "--muted:",
  "--border:",
  "--primary:",
  "--destructive:",
  "--ring:",
  "--font-sans:",
  "--font-mono:",
];
const requiredPrimitives = ["badge", "button", "card", "dialog", "empty", "input", "sheet"];
const failures = [];

function requireFile(file) {
  const absolute = resolve(templateRoot, file);
  if (!existsSync(absolute)) {
    failures.push(`tanstack-start-app: missing ${file}`);
    return null;
  }
  return absolute;
}

function readRequiredFile(file) {
  const absolute = requireFile(file);
  return absolute === null ? null : readFileSync(absolute, "utf8");
}

const packageJson = JSON.parse(readFileSync(resolve(templateRoot, "package.json"), "utf8"));
if (packageJson.packageManager !== pnpmPackageManager) {
  failures.push(
    `tanstack-start-app: packageManager must match the root pin ${pnpmPackageManager}, received ${packageJson.packageManager}`,
  );
}
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

for (const [dependency, version] of Object.entries(dependencies)) {
  if (typeof version !== "string" || !/^\d+\.\d+\.\d+(?:[-+].+)?$/.test(version)) {
    failures.push(`tanstack-start-app: ${dependency} must use an exact version for offline installs`);
  }
}

if (packageJson.dependencies?.["@continual/sdk"] !== "0.1.3") {
  failures.push("tanstack-start-app: @continual/sdk must remain exactly 0.1.3");
}
for (const forbidden of ["@continual/manifest", "@continual/runtime", "@continual/cli"]) {
  if (dependencies[forbidden]) failures.push(`tanstack-start-app: forbidden dependency ${forbidden}`);
}
for (const dependency of ["tailwindcss", "@tailwindcss/vite", "class-variance-authority", "lucide-react", "radix-ui", "shadcn"]) {
  if (!dependencies[dependency]) failures.push(`tanstack-start-app: missing dependency ${dependency}`);
}

const css = readRequiredFile("src/styles/global.css");
if (css !== null) {
  if (!css.includes('@import "tailwindcss"')) failures.push("tanstack-start-app: global CSS does not import Tailwind v4");
  if (!css.includes('tokens.css"')) failures.push("tanstack-start-app: global CSS does not import the shared token asset");
  if (!css.includes('@import "shadcn/tailwind.css"')) {
    failures.push("tanstack-start-app: global CSS does not import shadcn/tailwind.css from the shadcn dependency");
  }
  if (!css.includes("@fontsource-variable/geist") || !css.includes("@fontsource-variable/geist-mono")) {
    failures.push("tanstack-start-app: global CSS must load Geist and Geist Mono");
  }
}

const tokens = readRequiredFile("src/styles/tokens.css");
for (const token of requiredTokens) {
  if (tokens !== null && !tokens.includes(token)) failures.push(`tanstack-start-app: missing token ${token}`);
}

for (const primitive of requiredPrimitives) requireFile(`src/components/ui/${primitive}.tsx`);

const agentsGuide = readRequiredFile("AGENTS.md");
for (const guidance of [
  "custom theme may change both semantic tokens and the owned shadcn primitive recipes",
  "shadcn/tailwind.css",
  "control height, padding, shape, border weight",
  "data-slot",
  "visible focus",
]) {
  if (agentsGuide !== null && !agentsGuide.includes(guidance)) {
    failures.push(`tanstack-start-app: AGENTS.md is missing component-theming guidance: ${guidance}`);
  }
}

const button = readRequiredFile("src/components/ui/button.tsx");
const card = readRequiredFile("src/components/ui/card.tsx");
const input = readRequiredFile("src/components/ui/input.tsx");
if (button !== null && (!button.includes("buttonVariants") || !button.includes('data-slot="button"'))) {
  failures.push("tanstack-start-app: button must expose an owned variant recipe and data-slot hook");
}
if (card !== null && !card.includes('data-slot="card"')) {
  failures.push("tanstack-start-app: card must expose an owned data-slot hook");
}
if (input !== null && !input.includes('data-slot="input"')) {
  failures.push("tanstack-start-app: input must expose an owned data-slot hook");
}

for (const block of ["AppShell", "SidebarNav", "PageHeader", "MetricCard", "EmptyState", "StarterDashboard"]) {
  requireFile(`src/components/blocks/${block}.tsx`);
}
requireFile("components.json");

const designSystem = JSON.parse(readFileSync(resolve(root, "design-system.json"), "utf8"));
const templateRoots = { tanstackStartApp: templateRoot };
const sharedPrimitives = listPrimitiveSources(sharedPrimitivesDir);

for (const entry of sharedPrimitives.unsupported) {
  failures.push(`${sharedPrimitivesDir}: unsupported entry ${entry}; only .tsx primitive sources are supported`);
}

if (!Array.isArray(designSystem.primitives) || designSystem.primitives.some((name) => typeof name !== "string")) {
  failures.push("design-system.json: primitives must be a string array");
}

for (const [starter, capabilities] of Object.entries(designSystem.starterCapabilities ?? {})) {
  const declared = capabilities.primitives;
  if (declared !== "all" && !(Array.isArray(declared) && declared.every((name) => typeof name === "string"))) {
    failures.push(`design-system.json: starterCapabilities.${starter}.primitives must be a string array or "all"`);
    continue;
  }
  if (!Array.isArray(capabilities.layoutsAndBlocks)) {
    failures.push(`design-system.json: starterCapabilities.${starter}.layoutsAndBlocks must be an array`);
  }

  const starterRoot = templateRoots[starter];
  if (!starterRoot) {
    failures.push(`design-system.json: starterCapabilities.${starter} has no known template root`);
    continue;
  }

  const shippedDirectory = resolve(starterRoot, "src/components/ui");
  if (!existsSync(shippedDirectory)) {
    failures.push(`${starter}: missing src/components/ui`);
    continue;
  }

  const shipped = listPrimitiveSources(shippedDirectory);
  for (const entry of shipped.unsupported) {
    failures.push(`${starter}: unsupported entry ${entry} in src/components/ui; only .tsx primitive sources are supported`);
  }

  const shippedPrimitives = new Set(shipped.names);
  const catalog = new Set(Array.isArray(designSystem.primitives) ? designSystem.primitives : []);

  for (const primitive of sharedPrimitives.names) {
    if (!shippedPrimitives.has(primitive)) {
      failures.push(`${starter}: shared primitive ${primitive} is missing from src/components/ui`);
    }
  }
  for (const primitive of shippedPrimitives) {
    if (!sharedPrimitives.names.includes(primitive)) {
      failures.push(`${starter}: src/components/ui/${primitive}.tsx has no source in ${sharedPrimitivesDir}`);
    }
  }

  if (declared === "all") {
    for (const primitive of catalog) {
      if (!shippedPrimitives.has(primitive)) {
        failures.push(`${starter}: declared primitive ${primitive} is missing from src/components/ui`);
      }
    }
    for (const primitive of shippedPrimitives) {
      if (!catalog.has(primitive)) {
        failures.push(
          `design-system.json: primitives must list ${primitive}, which ${starter} ships under the "all" sentinel`,
        );
      }
    }
    continue;
  }

  for (const primitive of declared) {
    if (!catalog.has(primitive)) {
      failures.push(`design-system.json: starterCapabilities.${starter} declares unknown primitive ${primitive}`);
      continue;
    }
    if (!shippedPrimitives.has(primitive)) {
      failures.push(`${starter}: declared primitive ${primitive} is missing from src/components/ui`);
    }
  }
}

if (failures.length > 0) {
  console.error("Template design-system assertions failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Template design-system assertions passed (TanStack Start)");
