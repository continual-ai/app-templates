import { ContinualRuntimeError } from "./errors";
import type {
  ContinualJsonRpcToolResponse,
  ContinualToolCall,
  ContinualToolResult,
  PreviewRuntimeConfig,
} from "./types";

const SESSION_STORAGE_TOKEN_KEY = "continual.preview.token";
const SESSION_STORAGE_ORIGIN_KEY = "continual.preview.appOrigin";

/**
 * Detect a preview runtime config from URL query params (first load) or
 * sessionStorage (subsequent navigations). The Continual in-thread preview
 * panel injects `__continual_preview_token` and `__continual_app_origin` into
 * the iframe URL; we cache them so client-side navigation doesn't lose auth.
 */
export function getPreviewRuntimeConfig(): PreviewRuntimeConfig | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const tokenFromUrl = params.get("__continual_preview_token");
  const appOriginFromUrl = params.get("__continual_app_origin");

  if (tokenFromUrl && appOriginFromUrl) {
    try {
      window.sessionStorage.setItem(SESSION_STORAGE_TOKEN_KEY, tokenFromUrl);
      window.sessionStorage.setItem(SESSION_STORAGE_ORIGIN_KEY, appOriginFromUrl);
    } catch {
      // sessionStorage can throw in some sandboxes; the URL params still work
      // for this page load.
    }
    return { token: tokenFromUrl, appOrigin: appOriginFromUrl };
  }

  try {
    const token = window.sessionStorage.getItem(SESSION_STORAGE_TOKEN_KEY);
    const appOrigin = window.sessionStorage.getItem(SESSION_STORAGE_ORIGIN_KEY);
    return token && appOrigin ? { token, appOrigin } : null;
  } catch {
    return null;
  }
}

export async function callPreviewTool(
  params: ContinualToolCall,
  runtime: PreviewRuntimeConfig
): Promise<ContinualToolResult> {
  const callResponse = await fetch(new URL("/api/sites/runtime/preview/call", runtime.appOrigin), {
    method: "POST",
    // Keep this as a CORS-simple request. Some edge paths do not route OPTIONS
    // preflight to the app, so preview auth goes in the body instead of
    // Authorization. The endpoint also accepts bearer auth for compatibility.
    headers: { "content-type": "text/plain" },
    body: JSON.stringify({
      previewApiToken: runtime.token,
      request: {
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/call",
        params,
      },
    }),
  });

  const payload = (await readJson(callResponse)) as ContinualJsonRpcToolResponse | null;
  if (!payload || !callResponse.ok || payload.error) {
    throw new ContinualRuntimeError(
      "tool-error",
      payload?.error?.message || "Continual preview tool call failed.",
      payload?.error
    );
  }

  return payload.result as ContinualToolResult;
}

async function readJson(response: Response): Promise<unknown | null> {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;
  return response.json().catch(() => null);
}
