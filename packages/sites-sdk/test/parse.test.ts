import { describe, expect, it } from "vitest";
import { ContinualRuntimeError } from "../src/errors";
import {
  parseContent,
  unwrapContinualToolJson,
  unwrapWebSearchAnswer,
  unwrapWebSearchResult,
} from "../src/parse";

describe("unwrapContinualToolJson", () => {
  it("returns the JSON part when present (JSON-first ordering)", () => {
    const result = unwrapContinualToolJson<{ threads: number[] }>({
      content: [
        // A text part appears first but must NOT be used when JSON is also present.
        { type: "text", text: "ignored" },
        { type: "json", json: { threads: [1, 2, 3] } },
      ],
    });
    expect(result).toEqual({ threads: [1, 2, 3] });
  });

  it("accepts a JSON-RPC envelope", () => {
    const result = unwrapContinualToolJson<{ ok: true }>({
      jsonrpc: "2.0",
      id: 1,
      result: { content: [{ type: "json", json: { ok: true } }] },
    });
    expect(result).toEqual({ ok: true });
  });

  it("falls back to parsing text content as JSON", () => {
    const result = unwrapContinualToolJson<{ n: number }>({
      content: [{ type: "text", text: '{"n":42}' }],
    });
    expect(result).toEqual({ n: 42 });
  });

  it("throws tool-error when the JSON-RPC response carries an error", () => {
    expect(() =>
      unwrapContinualToolJson({
        jsonrpc: "2.0",
        error: { code: -32000, message: "boom" },
      })
    ).toThrow(ContinualRuntimeError);
  });

  it("throws tool-error when content is missing", () => {
    expect(() => unwrapContinualToolJson({ content: undefined as unknown as [] })).toThrow(
      /content array/
    );
  });

  it("throws tool-error when no JSON or text part is present", () => {
    expect(() =>
      unwrapContinualToolJson({ content: [{ type: "image", url: "x" } as never] })
    ).toThrow(/JSON content/);
  });
});

describe("parseContent (back-compat)", () => {
  it("returns the JSON payload on success", () => {
    expect(parseContent({ content: [{ type: "json", json: { ok: true } }] })).toEqual({
      ok: true,
    });
  });

  it("returns null instead of throwing on failure", () => {
    expect(parseContent({ content: [] })).toBeNull();
  });
});

describe("unwrapWebSearchResult", () => {
  it("returns the result field of the envelope", () => {
    const value = unwrapWebSearchResult<Array<{ title: string }>>({
      content: [
        {
          type: "json",
          json: { command: "search", result: [{ title: "hi" }] },
        },
      ],
    });
    expect(value).toEqual([{ title: "hi" }]);
  });

  it("throws when the envelope lacks a result field", () => {
    expect(() =>
      unwrapWebSearchResult({
        content: [{ type: "json", json: { command: "search" } }],
      })
    ).toThrow(/result field/);
  });

  it("uses help text in the error when result is null", () => {
    expect(() =>
      unwrapWebSearchResult({
        content: [
          {
            type: "json",
            json: { command: "search", result: null, help: "rate-limited" },
          },
        ],
      })
    ).toThrow(/rate-limited/);
  });
});

describe("unwrapWebSearchAnswer", () => {
  it("returns the answer field", () => {
    expect(
      unwrapWebSearchAnswer({
        content: [
          {
            type: "json",
            json: { command: "answer", result: { answer: "42" } },
          },
        ],
      })
    ).toBe("42");
  });

  it("throws when answer is missing", () => {
    expect(() =>
      unwrapWebSearchAnswer({
        content: [
          { type: "json", json: { command: "answer", result: { citations: [] } } },
        ],
      })
    ).toThrow(/answer/);
  });
});
