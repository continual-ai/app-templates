import { afterEach, describe, expect, it, vi } from "vitest";
import { ContinualRuntimeError } from "../src/errors";
import { callPublishedTool } from "../src/published";

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

describe("callPublishedTool", () => {
  it("fetches a bearer token and calls /__continual/api/call", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ token: "bearer.jwt" }))
      .mockResolvedValueOnce(
        jsonResponse({
          jsonrpc: "2.0",
          id: 1,
          result: { content: [{ type: "json", json: { threads: [] } }] },
        })
      );

    const result = await callPublishedTool({
      appInstallationId: "system-tools",
      name: "platform_api",
      arguments: { command: "threads list" },
    });

    expect(result).toEqual({ content: [{ type: "json", json: { threads: [] } }] });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const [tokenUrl, tokenInit] = fetchMock.mock.calls[0]!;
    expect(tokenUrl).toBe("/__continual/api/token");
    expect(tokenInit.credentials).toBe("include");

    const [callUrl, callInit] = fetchMock.mock.calls[1]!;
    expect(callUrl).toBe("/__continual/api/call");
    expect(callInit.method).toBe("POST");
    expect((callInit.headers as Record<string, string>).authorization).toBe("Bearer bearer.jwt");
    expect((callInit.headers as Record<string, string>)["content-type"]).toBe("application/json");
  });

  it("throws runtime-unavailable on 404 token route", async () => {
    fetchMock.mockResolvedValueOnce(new Response("nope", { status: 404 }));
    await expect(callPublishedTool({ appInstallationId: "x", name: "y" })).rejects.toMatchObject({
      code: "runtime-unavailable",
    });
  });

  it("throws unsupported-public-site on 403", async () => {
    fetchMock.mockResolvedValueOnce(new Response("nope", { status: 403 }));
    await expect(callPublishedTool({ appInstallationId: "x", name: "y" })).rejects.toMatchObject({
      code: "unsupported-public-site",
    });
  });

  it("throws unauthenticated on 401", async () => {
    fetchMock.mockResolvedValueOnce(new Response("nope", { status: 401 }));
    await expect(callPublishedTool({ appInstallationId: "x", name: "y" })).rejects.toMatchObject({
      code: "unauthenticated",
    });
  });

  it("throws request-failed on other token-fetch failures", async () => {
    fetchMock.mockResolvedValueOnce(new Response("nope", { status: 500 }));
    await expect(callPublishedTool({ appInstallationId: "x", name: "y" })).rejects.toMatchObject({
      code: "request-failed",
    });
  });

  it("throws request-failed when token body is missing the token field", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}));
    await expect(callPublishedTool({ appInstallationId: "x", name: "y" })).rejects.toMatchObject({
      code: "request-failed",
    });
  });

  it("throws tool-error on JSON-RPC error in the call response", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ token: "t" }))
      .mockResolvedValueOnce(
        jsonResponse({ jsonrpc: "2.0", error: { code: -32000, message: "bad args" } })
      );

    await expect(
      callPublishedTool({ appInstallationId: "x", name: "y" })
    ).rejects.toMatchObject({ code: "tool-error", message: "bad args" });
  });

  it("treats a fetch rejection on the token route as runtime-unavailable", async () => {
    fetchMock.mockRejectedValueOnce(new Error("offline"));
    await expect(callPublishedTool({ appInstallationId: "x", name: "y" })).rejects.toBeInstanceOf(
      ContinualRuntimeError
    );
  });
});
