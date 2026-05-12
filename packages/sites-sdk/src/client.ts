import { unwrapContinualToolJson } from "./parse";
import { callPreviewTool, getPreviewRuntimeConfig } from "./preview";
import { callPublishedTool } from "./published";
import type {
  ContinualToolCall,
  ContinualToolResult,
  PreviewRuntimeConfig,
} from "./types";

/**
 * Call a Continual tool. Routes to the preview runtime when a preview token
 * is present (URL params, sessionStorage, or the optional `runtime` arg) and
 * to the same-origin published Worker otherwise.
 *
 * The `runtime` arg is only used by the test-call script (`scripts/call.ts`)
 * running in Node, where there's no `window` to read URL params from. Site
 * code should not pass it.
 */
export async function callContinualTool(
  params: ContinualToolCall,
  runtime?: PreviewRuntimeConfig
): Promise<ContinualToolResult> {
  const previewRuntime = runtime ?? getPreviewRuntimeConfig();
  if (previewRuntime) {
    return callPreviewTool(params, previewRuntime);
  }
  return callPublishedTool(params);
}

/**
 * Call a Continual tool and unwrap the JSON payload from the MCP response.
 *
 * Prefer this over `callContinualTool` for `platform_api` reads — the typed
 * generic gives the component direct access to the result shape (e.g.
 * `{ threads }`, `{ automations }`) without an extra `parseContent` step.
 *
 * For `web_search`, prefer `unwrapWebSearchResult` / `unwrapWebSearchAnswer`
 * over this, since the envelope wraps the actual result under `result`.
 */
export async function callContinualToolJson<T = unknown>(
  params: ContinualToolCall,
  runtime?: PreviewRuntimeConfig
): Promise<T> {
  return unwrapContinualToolJson<T>(await callContinualTool(params, runtime));
}
