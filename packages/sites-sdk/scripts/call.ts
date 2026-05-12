#!/usr/bin/env tsx
/**
 * Test-call harness. Invokes a Continual tool through the SDK's preview
 * transport so the agent can verify a call works before wiring it into a
 * site component.
 *
 *   usage: tsx scripts/call.ts <appInstallationId> <toolName> '<argsJson>'
 *   env:   CONTINUAL_PREVIEW_TOKEN  short-lived JWT from `sites preview-token`
 *          CONTINUAL_APP_ORIGIN      e.g. https://app.continual.ai
 *
 * Prints the raw MCP ToolResult as JSON on success. Exits non-zero with the
 * error code + message on failure.
 */
import { callContinualTool, ContinualRuntimeError } from "../src/index.js";

const USAGE =
  "usage: tsx scripts/call.ts <appInstallationId> <toolName> '<argsJson>'\n" +
  "env:   CONTINUAL_PREVIEW_TOKEN, CONTINUAL_APP_ORIGIN";

const [appInstallationId, name, argsJson = "{}"] = process.argv.slice(2);
const token = process.env.CONTINUAL_PREVIEW_TOKEN;
const appOrigin = process.env.CONTINUAL_APP_ORIGIN;

if (!appInstallationId || !name) {
  console.error(USAGE);
  process.exit(2);
}
if (!token || !appOrigin) {
  console.error("Missing CONTINUAL_PREVIEW_TOKEN or CONTINUAL_APP_ORIGIN env vars.\n");
  console.error(USAGE);
  process.exit(2);
}

let parsedArgs: Record<string, unknown>;
try {
  parsedArgs = JSON.parse(argsJson);
} catch (err) {
  console.error(`Could not parse arguments JSON: ${(err as Error).message}`);
  console.error(USAGE);
  process.exit(2);
}

try {
  const result = await callContinualTool(
    { appInstallationId, name, arguments: parsedArgs },
    { token, appOrigin }
  );
  console.log(JSON.stringify(result, null, 2));
} catch (err) {
  if (err instanceof ContinualRuntimeError) {
    console.error(`[${err.code}] ${err.message}`);
    if (err.data) console.error(JSON.stringify(err.data, null, 2));
    process.exit(1);
  }
  console.error(err);
  process.exit(1);
}
