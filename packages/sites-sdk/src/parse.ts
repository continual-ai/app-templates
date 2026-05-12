import { ContinualRuntimeError } from "./errors";
import type {
  ContinualJsonRpcToolResponse,
  ContinualToolResult,
  WebSearchToolJson,
} from "./types";

export function isContinualToolResult(value: unknown): value is ContinualToolResult {
  return Boolean(
    value && typeof value === "object" && Array.isArray((value as ContinualToolResult).content)
  );
}

/**
 * Unwrap an MCP tool response to its JSON payload.
 *
 * MUST check `type: "json"` before `type: "text"`. Continual platform_api responses
 * return `content: [{ type: "json", json: { ... } }]`; a text-first parser will
 * silently miss them.
 */
export function unwrapContinualToolJson<T = unknown>(
  response: ContinualToolResult | ContinualJsonRpcToolResponse
): T {
  if ("error" in response && response.error) {
    throw new ContinualRuntimeError("tool-error", response.error.message, response.error);
  }

  const result = isContinualToolResult(response) ? response : response.result;
  if (!result || !Array.isArray(result.content)) {
    throw new ContinualRuntimeError(
      "tool-error",
      "Continual tool response did not include a content array.",
      response
    );
  }

  const jsonPart = result.content.find(
    (part): part is { type: "json"; json: T } => part.type === "json" && "json" in part
  );
  if (jsonPart) return jsonPart.json;

  const textPart = result.content.find(
    (part): part is { type: "text"; text?: string } =>
      part.type === "text" && typeof part.text === "string"
  );
  if (textPart?.text) {
    try {
      return JSON.parse(textPart.text) as T;
    } catch {
      // Fall through to the clearer error below.
    }
  }

  throw new ContinualRuntimeError(
    "tool-error",
    "Continual tool response did not include JSON content.",
    result
  );
}

/**
 * Back-compat alias kept so generated sites that imported `parseContent` from
 * the old inline helper continue to compile after migrating to the SDK.
 * Returns `null` on failure instead of throwing.
 */
export function parseContent<T = unknown>(
  response: ContinualToolResult | ContinualJsonRpcToolResponse
): T | null {
  try {
    return unwrapContinualToolJson<T>(response);
  } catch {
    return null;
  }
}

export function unwrapWebSearchResult<T = unknown>(
  response: ContinualToolResult | ContinualJsonRpcToolResponse
): T {
  const payload = unwrapContinualToolJson<WebSearchToolJson<T>>(response);
  if (!payload || typeof payload !== "object" || !("result" in payload)) {
    throw new ContinualRuntimeError(
      "tool-error",
      "web_search response did not include a result field.",
      payload
    );
  }
  if (payload.result === null || payload.result === undefined) {
    throw new ContinualRuntimeError(
      "tool-error",
      payload.help || "web_search returned an empty result.",
      payload
    );
  }
  return payload.result;
}

export function unwrapWebSearchAnswer(
  response: ContinualToolResult | ContinualJsonRpcToolResponse
): string | Record<string, unknown> {
  const result = unwrapWebSearchResult<{
    answer?: string | Record<string, unknown>;
    citations?: unknown[];
  }>(response);
  if (!result || !("answer" in result) || result.answer === undefined) {
    throw new ContinualRuntimeError(
      "tool-error",
      "web_search answer response did not include result.answer.",
      result
    );
  }
  return result.answer;
}
