import { callContinualTool } from "../client";
import { unwrapWebSearchResult } from "../parse";
import type { PreviewRuntimeConfig } from "../types";
import type {
  WebSearchAnswerInput,
  WebSearchAnswerResult,
  WebSearchResult,
  WebSearchSearchInput,
} from "./types";

const SYSTEM_TOOLS = "system-tools";
const WEB_SEARCH = "web_search";

/**
 * Typed bindings for the `system_tools__web_search` system tool.
 *
 * `web_search` returns an envelope: `{ command, result, help? }`. The methods
 * here unwrap that envelope so callers receive the actual result type
 * directly — search results array for `search`, the `{ answer, citations }`
 * shape for `answer`.
 */
export const webSearch = {
  search: async (
    options: WebSearchSearchInput,
    runtime?: PreviewRuntimeConfig
  ): Promise<WebSearchResult[]> => {
    const response = await callContinualTool(
      {
        appInstallationId: SYSTEM_TOOLS,
        name: WEB_SEARCH,
        arguments: { command: "search", options },
      },
      runtime
    );
    return unwrapWebSearchResult<WebSearchResult[]>(response);
  },

  answer: async (
    options: WebSearchAnswerInput,
    runtime?: PreviewRuntimeConfig
  ): Promise<WebSearchAnswerResult> => {
    const response = await callContinualTool(
      {
        appInstallationId: SYSTEM_TOOLS,
        name: WEB_SEARCH,
        arguments: { command: "answer", options },
      },
      runtime
    );
    return unwrapWebSearchResult<WebSearchAnswerResult>(response);
  },
} as const;
