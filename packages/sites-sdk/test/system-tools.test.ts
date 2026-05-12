import { afterEach, describe, expect, it, vi } from "vitest";
import { platformApi, webSearch } from "../src/system-tools";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

afterEach(() => {
  fetchMock.mockReset();
});

const runtime = { token: "t", appOrigin: "https://app.continual.ai" };

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { "content-type": "application/json", ...(init.headers ?? {}) },
  });
}

function mockToolJsonOnce(json: unknown) {
  fetchMock.mockResolvedValueOnce(
    jsonResponse({
      jsonrpc: "2.0",
      id: 1,
      result: { content: [{ type: "json", json }] },
    })
  );
}

/**
 * Pull the parsed JSON-RPC body out of the most recent fetch call so we can
 * assert the exact { appInstallationId, name, arguments } shape the SDK
 * constructed.
 */
function lastCallArgs(): { appInstallationId: string; name: string; arguments: unknown } {
  const init = fetchMock.mock.calls.at(-1)![1] as RequestInit;
  const body = JSON.parse(init.body as string);
  return body.request.params;
}

describe("platformApi.threads", () => {
  it("list builds the right tool call", async () => {
    mockToolJsonOnce({
      projectId: "proj_1",
      threads: [{ id: "th_1", threadId: "th_1", title: "hi" }],
      totalShown: 1,
      pageSize: 20,
    });

    const result = await platformApi.threads.list(
      { pageSize: 20, sortBy: "updatedAt", sortDirection: "desc" },
      runtime
    );
    expect(result.threads[0]!.id).toBe("th_1");
    expect(lastCallArgs()).toEqual({
      appInstallationId: "system-tools",
      name: "platform_api",
      arguments: {
        command: "threads list",
        options: { pageSize: 20, sortBy: "updatedAt", sortDirection: "desc" },
      },
    });
  });

  it("list accepts no input", async () => {
    mockToolJsonOnce({ projectId: "p", threads: [], totalShown: 0, pageSize: 20 });
    await platformApi.threads.list(undefined, runtime);
    expect(lastCallArgs()).toMatchObject({
      arguments: { command: "threads list", options: {} },
    });
  });

  it("get passes threadId through options", async () => {
    mockToolJsonOnce({ projectId: "p", thread: { id: "th_1" } });
    await platformApi.threads.get({ threadId: "th_1" }, runtime);
    expect(lastCallArgs()).toEqual({
      appInstallationId: "system-tools",
      name: "platform_api",
      arguments: { command: "threads get", options: { threadId: "th_1" } },
    });
  });
});

describe("platformApi.invocations.list", () => {
  it("builds the right call", async () => {
    mockToolJsonOnce({
      projectId: "p",
      invocations: [],
      totalCount: 0,
      totalPages: 0,
      page: 1,
      pageSize: 20,
      availableTriggerTypes: [],
    });

    await platformApi.invocations.list({ statuses: ["completed"], order: "desc" }, runtime);
    expect(lastCallArgs()).toMatchObject({
      arguments: {
        command: "invocations list",
        options: { statuses: ["completed"], order: "desc" },
      },
    });
  });
});

describe("platformApi.automations", () => {
  it("list builds the right call", async () => {
    mockToolJsonOnce({ automations: [], totalShown: 0, pageSize: 20 });
    await platformApi.automations.list({ pageSize: 50 }, runtime);
    expect(lastCallArgs()).toMatchObject({
      arguments: { command: "automations list", options: { pageSize: 50 } },
    });
  });

  it("get requires automationId", async () => {
    mockToolJsonOnce({ automation: { id: "auto_1" } });
    await platformApi.automations.get({ automationId: "auto_1" }, runtime);
    expect(lastCallArgs()).toMatchObject({
      arguments: { command: "automations get", options: { automationId: "auto_1" } },
    });
  });
});

describe("platformApi.apps", () => {
  it("listInstalled emits the snake_case command", async () => {
    mockToolJsonOnce({
      projectId: "p",
      apps: [{ appInstallationId: "appi_1", name: "GitHub", appId: "app_github" }],
      pagination: { hasMore: false },
    });

    const result = await platformApi.apps.listInstalled(undefined, runtime);
    expect(result.apps[0]!.appInstallationId).toBe("appi_1");
    expect(lastCallArgs()).toMatchObject({
      arguments: { command: "apps list_installed", options: {} },
    });
  });

  it("get builds the right call", async () => {
    mockToolJsonOnce({ id: "appi_1", tools: {} });
    await platformApi.apps.get({ appInstallationId: "appi_1" }, runtime);
    expect(lastCallArgs()).toMatchObject({
      arguments: { command: "apps get", options: { appInstallationId: "appi_1" } },
    });
  });
});

describe("webSearch", () => {
  it("search unwraps the envelope to the results array", async () => {
    mockToolJsonOnce({
      command: "search",
      result: [
        {
          title: "A",
          publishedDate: "2026-01-01",
          url: "https://a",
          text: "x",
          score: 0.9,
        },
      ],
    });

    const results = await webSearch.search({ query: "q", numResults: 5 }, runtime);
    expect(results).toHaveLength(1);
    expect(results[0]!.title).toBe("A");
    expect(lastCallArgs()).toMatchObject({
      appInstallationId: "system-tools",
      name: "web_search",
      arguments: { command: "search", options: { query: "q", numResults: 5 } },
    });
  });

  it("answer returns { answer, citations }", async () => {
    mockToolJsonOnce({
      command: "answer",
      result: {
        answer: "42",
        citations: [{ id: "c1", score: 0.5, url: "https://x" }],
      },
    });

    const result = await webSearch.answer({ query: "meaning of life" }, runtime);
    expect(result.answer).toBe("42");
    expect(result.citations).toHaveLength(1);
    expect(lastCallArgs()).toMatchObject({
      arguments: { command: "answer", options: { query: "meaning of life" } },
    });
  });

  it("search surfaces web_search help text when result is null", async () => {
    mockToolJsonOnce({
      command: "search",
      result: null,
      help: "rate-limited; retry later",
    });
    await expect(webSearch.search({ query: "q" }, runtime)).rejects.toThrow(/rate-limited/);
  });
});
