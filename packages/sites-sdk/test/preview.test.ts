import { afterEach, describe, expect, it, vi } from "vitest";
import { ContinualRuntimeError } from "../src/errors";
import { callPreviewTool, getPreviewRuntimeConfig } from "../src/preview";

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

describe("callPreviewTool", () => {
  it("posts a CORS-simple body with the preview token", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        jsonrpc: "2.0",
        id: 1,
        result: { content: [{ type: "json", json: { ok: true } }] },
      })
    );

    const result = await callPreviewTool(
      {
        appInstallationId: "system-tools",
        name: "platform_api",
        arguments: { command: "threads list" },
      },
      { token: "preview.jwt", appOrigin: "https://app.continual.ai" }
    );

    expect(result).toEqual({ content: [{ type: "json", json: { ok: true } }] });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toBe("https://app.continual.ai/api/sites/runtime/preview/call");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ "content-type": "text/plain" });
    // No Authorization header — preflight-avoidance is the whole point.
    expect((init.headers as Record<string, string>).authorization).toBeUndefined();

    const body = JSON.parse(init.body as string);
    expect(body.previewApiToken).toBe("preview.jwt");
    expect(body.request.method).toBe("tools/call");
    expect(body.request.params).toEqual({
      appInstallationId: "system-tools",
      name: "platform_api",
      arguments: { command: "threads list" },
    });
  });

  it("throws tool-error on JSON-RPC error", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ jsonrpc: "2.0", error: { code: -32000, message: "denied" } })
    );

    await expect(
      callPreviewTool(
        { appInstallationId: "x", name: "y" },
        { token: "t", appOrigin: "https://app" }
      )
    ).rejects.toMatchObject({
      name: "ContinualRuntimeError",
      code: "tool-error",
      message: "denied",
    });
  });

  it("throws tool-error on non-2xx", async () => {
    fetchMock.mockResolvedValueOnce(new Response("nope", { status: 500 }));
    await expect(
      callPreviewTool(
        { appInstallationId: "x", name: "y" },
        { token: "t", appOrigin: "https://app" }
      )
    ).rejects.toBeInstanceOf(ContinualRuntimeError);
  });
});

describe("getPreviewRuntimeConfig", () => {
  it("returns null when there is no window", () => {
    expect(getPreviewRuntimeConfig()).toBeNull();
  });

  it("reads URL params and persists to sessionStorage when present", () => {
    const sessionStore: Record<string, string> = {};
    const sessionStorageStub = {
      getItem: (k: string) => sessionStore[k] ?? null,
      setItem: (k: string, v: string) => {
        sessionStore[k] = v;
      },
    };
    vi.stubGlobal("window", {
      location: {
        search:
          "?__continual_preview_token=tok&__continual_app_origin=https://app.continual.ai",
      },
      sessionStorage: sessionStorageStub,
    });

    try {
      expect(getPreviewRuntimeConfig()).toEqual({
        token: "tok",
        appOrigin: "https://app.continual.ai",
      });
      expect(sessionStore["continual.preview.token"]).toBe("tok");
      expect(sessionStore["continual.preview.appOrigin"]).toBe("https://app.continual.ai");
    } finally {
      vi.unstubAllGlobals();
      // Re-stub fetch (the afterEach reset only handles the mock, not the global).
      vi.stubGlobal("fetch", fetchMock);
    }
  });

  it("falls back to sessionStorage when URL params are absent", () => {
    const sessionStore: Record<string, string> = {
      "continual.preview.token": "tok2",
      "continual.preview.appOrigin": "https://app.continual.ai",
    };
    vi.stubGlobal("window", {
      location: { search: "" },
      sessionStorage: {
        getItem: (k: string) => sessionStore[k] ?? null,
        setItem: () => {},
      },
    });

    try {
      expect(getPreviewRuntimeConfig()).toEqual({
        token: "tok2",
        appOrigin: "https://app.continual.ai",
      });
    } finally {
      vi.unstubAllGlobals();
      vi.stubGlobal("fetch", fetchMock);
    }
  });
});
