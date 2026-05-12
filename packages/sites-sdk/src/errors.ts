export type ContinualRuntimeErrorCode =
  | "runtime-unavailable"
  | "unsupported-public-site"
  | "unauthenticated"
  | "tool-error"
  | "request-failed";

export class ContinualRuntimeError extends Error {
  code: ContinualRuntimeErrorCode;
  data?: unknown;

  constructor(code: ContinualRuntimeErrorCode, message: string, data?: unknown) {
    super(message);
    this.name = "ContinualRuntimeError";
    this.code = code;
    this.data = data;
  }
}
