import { ContinualRuntimeError } from "./errors";
import type {
  ContinualJsonRpcToolResponse,
  ContinualToolCall,
  ContinualToolResult,
} from "./types";

/**
 * Call a Continual tool via the same-origin Sites Worker on a published
 * private site. Fetches a short-lived bearer token, then POSTs the tool call.
 *
 * Throws `ContinualRuntimeError` with a code that callers can branch on:
 *   - runtime-unavailable: token route is 404 (raw localhost dev / public site
 *     served without the Worker proxy).
 *   - unsupported-public-site: 403 (Worker refused to mint for a public site).
 *   - unauthenticated: 401 (viewer not signed in).
 *   - request-failed: other token-fetch failures.
 *   - tool-error: call returned a JSON-RPC error.
 */
export async function callPublishedTool(
  params: ContinualToolCall
): Promise<ContinualToolResult> {
  const tokenResponse = await fetch("/__continual/api/token", {
    credentials: "include",
    cache: "no-store",
  }).catch(() => null);

  if (!tokenResponse || tokenResponse.status === 404) {
    throw new ContinualRuntimeError(
      "runtime-unavailable",
      "Live Continual API calls are available after publishing this site privately."
    );
  }
  if (tokenResponse.status === 403) {
    throw new ContinualRuntimeError(
      "unsupported-public-site",
      "Continual API calls are only supported for private sites."
    );
  }
  if (tokenResponse.status === 401) {
    throw new ContinualRuntimeError(
      "unauthenticated",
      "Sign in to use this private site."
    );
  }
  if (!tokenResponse.ok) {
    throw new ContinualRuntimeError("request-failed", "Could not create a site API token.");
  }

  const tokenPayload = (await readJson(tokenResponse)) as { token?: string } | null;
  if (!tokenPayload) {
    throw new ContinualRuntimeError(
      "runtime-unavailable",
      "Live Continual API calls are available after publishing this site privately."
    );
  }

  const { token } = tokenPayload;
  if (!token) {
    throw new ContinualRuntimeError(
      "request-failed",
      "Site API token response was missing a token."
    );
  }

  const callResponse = await fetch("/__continual/api/call", {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params,
    }),
  });

  const payload = (await readJson(callResponse)) as ContinualJsonRpcToolResponse | null;
  if (!payload || !callResponse.ok || payload.error) {
    throw new ContinualRuntimeError(
      "tool-error",
      payload?.error?.message || "Continual tool call failed.",
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
