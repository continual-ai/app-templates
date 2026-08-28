import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const templates = {
  "astro-default": { sourceRoot: "src", css: "src/styles/global.css", integration: "@tailwindcss/vite" },
  "react-app": { sourceRoot: "src", css: "src/styles/global.css", integration: "@tailwindcss/vite" },
  "nextjs-app": { sourceRoot: "", css: "app/styles.css", integration: "@tailwindcss/postcss" },
  "tanstack-start-app": { sourceRoot: "src", css: "src/styles/global.css", integration: "@tailwindcss/vite" },
};
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

function requireFile(template, file) {
  const absolute = resolve(root, "templates", template, file);
  if (!existsSync(absolute)) failures.push(`${template}: missing ${file}`);
  return absolute;
}

for (const [template, contract] of Object.entries(templates)) {
  const templateRoot = resolve(root, "templates", template);
  const packageJson = JSON.parse(readFileSync(resolve(templateRoot, "package.json"), "utf8"));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

  if (packageJson.dependencies?.["@continual/sdk"] !== "0.1.3") {
    failures.push(`${template}: @continual/sdk must remain exactly 0.1.3`);
  }
  if (packageJson.engines?.node !== ">=24.0.0") {
    failures.push(`${template}: Node engine must match the SDK requirement (>=24.0.0)`);
  }
  for (const forbidden of ["@continual/manifest", "@continual/runtime", "@continual/cli"]) {
    if (dependencies[forbidden]) failures.push(`${template}: forbidden dependency ${forbidden}`);
  }
  for (const dependency of ["tailwindcss", contract.integration, "class-variance-authority", "lucide-react", "radix-ui"] ) {
    if (!dependencies[dependency]) failures.push(`${template}: missing dependency ${dependency}`);
  }

  const css = readFileSync(requireFile(template, contract.css), "utf8");
  if (!css.includes('@import "tailwindcss"')) failures.push(`${template}: global CSS does not import Tailwind v4`);
  if (!css.includes('tokens.css"')) failures.push(`${template}: global CSS does not import the shared token asset`);

  if (template === "nextjs-app") {
    const layout = readFileSync(requireFile(template, "app/layout.tsx"), "utf8");
    if (!layout.includes("Geist") || !layout.includes("Geist_Mono")) {
      failures.push(`${template}: root layout must load Geist and Geist Mono with next/font`);
    }
    if (!layout.includes("next-fonts") || !css.includes("html.next-fonts")) {
      failures.push(`${template}: next/font variables must override root font fallbacks with class specificity`);
    }
    requireFile(template, "postcss.config.mjs");
  } else if (template === "react-app") {
    const tsconfig = readFileSync(requireFile(template, "tsconfig.json"), "utf8");
    requireFile(template, "tsconfig.worker.json");
    if (!tsconfig.includes("tsconfig.worker.json")) {
      failures.push(`${template}: root TypeScript project must check the Worker`);
    }
  } else if (!css.includes("@fontsource-variable/geist") || !css.includes("@fontsource-variable/geist-mono")) {
    failures.push(`${template}: global CSS must load Geist and Geist Mono`);
  }

  const tokensPath = template === "nextjs-app" ? "app/tokens.css" : `${contract.sourceRoot}/styles/tokens.css`;
  const tokens = readFileSync(requireFile(template, tokensPath), "utf8");
  for (const token of requiredTokens) {
    if (!tokens.includes(token)) failures.push(`${template}: missing token ${token}`);
  }

  const uiRoot = contract.sourceRoot ? `${contract.sourceRoot}/components/ui` : "components/ui";
  for (const primitive of requiredPrimitives) requireFile(template, `${uiRoot}/${primitive}.tsx`);

  const agentsGuide = readFileSync(requireFile(template, "AGENTS.md"), "utf8");
  for (const guidance of [
    "custom theme may change both semantic tokens and the owned shadcn primitive recipes",
    "control height, padding, shape, border weight",
    "data-slot",
    "visible focus",
  ]) {
    if (!agentsGuide.includes(guidance)) {
      failures.push(`${template}: AGENTS.md is missing component-theming guidance: ${guidance}`);
    }
  }

  const button = readFileSync(requireFile(template, `${uiRoot}/button.tsx`), "utf8");
  const card = readFileSync(requireFile(template, `${uiRoot}/card.tsx`), "utf8");
  const input = readFileSync(requireFile(template, `${uiRoot}/input.tsx`), "utf8");
  if (!button.includes("buttonVariants") || !button.includes('data-slot="button"')) {
    failures.push(`${template}: button must expose an owned variant recipe and data-slot hook`);
  }
  if (!card.includes('data-slot="card"')) {
    failures.push(`${template}: card must expose an owned data-slot hook`);
  }
  if (!input.includes('data-slot="input"')) {
    failures.push(`${template}: input must expose an owned data-slot hook`);
  }

  if (template === "nextjs-app" || template === "tanstack-start-app") {
    const blocksRoot = contract.sourceRoot ? `${contract.sourceRoot}/components/blocks` : "components/blocks";
    for (const block of ["AppShell", "SidebarNav", "PageHeader", "MetricCard", "EmptyState", "StarterDashboard"]) {
      requireFile(template, `${blocksRoot}/${block}.tsx`);
    }
    requireFile(template, "components.json");
  }
}

if (failures.length > 0) {
  console.error("Template design-system assertions failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Template design-system assertions passed (4 templates)");
