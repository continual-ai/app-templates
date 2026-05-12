import { afterEach, describe, expect, it, vi } from "vitest";
import { callContinualTool, callContinualToolJson } from "../src/client";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

afterEach(() => {
  fetchMock.mockReset();
});

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { "content-type": "application/json", ...(init.headers ?? {}) },
  });
}

describe("callContinualTool", () => {
  it("uses the preview transport when runtime is passed (Node case)", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        jsonrpc: "2.0",
        result: { content: [{ type: "json", json: { ok: true } }] },
      })
    );

    await callContinualTool(
      { appInstallationId: "x", name: "y" },
      { token: "t", appOrigin: "https://app.continual.ai" }
    );

    const [url] = fetchMock.mock.calls[0]!;
    expect(String(url)).toBe("https://app.continual.ai/api/sites/runtime/preview/call");
  });

  it("falls back to the published transport when no runtime is available", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ token: "bearer" }))
      .mockResolvedValueOnce(
        jsonResponse({ jsonrpc: "2.0", result: { content: [{ type: "json", json: {} }] } })
      );

    await callContinualTool({ appInstallationId: "x", name: "y" });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0]![0]).toBe("/__continual/api/token");
    expect(fetchMock.mock.calls[1]![0]).toBe("/__continual/api/call");
  });
});

describe("callContinualToolJson", () => {
  it("returns the unwrapped JSON payload", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        jsonrpc: "2.0",
        result: {
          content: [{ type: "json", json: { threads: [{ id: "t_1" }] } }],
        },
      })
    );

    const value = await callContinualToolJson<{ threads: Array<{ id: string }> }>(
      { appInstallationId: "system-tools", name: "platform_api" },
      { token: "t", appOrigin: "https://app" }
    );
    expect(value).toEqual({ threads: [{ id: "t_1" }] });
  });
});
