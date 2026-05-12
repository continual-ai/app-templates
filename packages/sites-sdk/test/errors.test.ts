import { describe, expect, it } from "vitest";
import { ContinualRuntimeError } from "../src/errors";

describe("ContinualRuntimeError", () => {
  it("preserves the code through instanceof", () => {
    const err = new ContinualRuntimeError("tool-error", "boom", { foo: 1 });
    expect(err).toBeInstanceOf(ContinualRuntimeError);
    expect(err.code).toBe("tool-error");
    expect(err.message).toBe("boom");
    expect(err.data).toEqual({ foo: 1 });
    expect(err.name).toBe("ContinualRuntimeError");
  });

  it("can be created without data", () => {
    const err = new ContinualRuntimeError("runtime-unavailable", "no runtime here");
    expect(err.data).toBeUndefined();
  });
});
