export type ContinualToolCall = {
  appInstallationId: string;
  name: string;
  arguments?: Record<string, unknown>;
};

export type ContinualToolContentPart =
  | { type: "json"; json: unknown }
  | { type: "text"; text?: string }
  | ({ type: string } & Record<string, unknown>);

export type ContinualToolResult = {
  content: ContinualToolContentPart[];
  isError?: boolean;
};

export type ContinualJsonRpcToolResponse = {
  jsonrpc?: "2.0";
  id?: string | number;
  result?: ContinualToolResult;
  error?: { code: number; message: string; data?: unknown };
};

export type WebSearchToolJson<T = unknown> = {
  command: string;
  result: T | null;
  help?: string;
};

export type PreviewRuntimeConfig = {
  appOrigin: string;
  token: string;
};
