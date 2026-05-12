/**
 * Shared input/output types for built-in Continual system tools.
 *
 * These mirror the zod schemas in
 * `apps/continual/server/integrations/tools/continual-platform-api.ts` and
 * `system-web-search.ts`. They are hand-authored — drift is possible if the
 * davinci schemas change without an SDK update. Keep this file boring and
 * tightly scoped: cover the read commands a site actually uses.
 */

// ─── shared ────────────────────────────────────────────────────────────────

export type ProjectScoped = {
  /** Defaults to the current thread's project when omitted. */
  projectId?: string;
};

export type PaginationInput = {
  /** 1–100. Defaults to 20. */
  pageSize?: number;
  nextPageToken?: string;
  previousPageToken?: string;
};

export type PaginatedResult = {
  nextPageToken?: string;
  previousPageToken?: string;
  totalShown: number;
  pageSize: number;
};

export type DateRange = {
  /** ISO-8601 timestamp. */
  from?: string;
  /** ISO-8601 timestamp. */
  to?: string;
};

export type SortDirection = "asc" | "desc";

// ─── threads ───────────────────────────────────────────────────────────────

export type ThreadStatus =
  | "open"
  | "inProgress"
  | "awaitingResponse"
  | "awaitingEvent"
  | "done"
  | "canceled";

export type ThreadsListInput = ProjectScoped &
  PaginationInput & {
    status?: ThreadStatus | ThreadStatus[];
    automationId?: string;
    automationIds?: string[];
    search?: string;
    searchMode?: "basic" | "full" | "messages_only";
    /** null for top-level threads only. */
    parentThreadId?: string | null;
    createdAt?: DateRange;
    updatedAt?: DateRange;
    starred?: boolean;
    archived?: boolean;
    sortBy?: "createdAt" | "updatedAt" | "title" | "status" | "order";
    sortDirection?: SortDirection;
  };

export type ThreadSummary = {
  id: string;
  threadId: string;
  title: string;
  name?: string | null;
  status?: string | null;
  projectId?: string | null;
  automationId?: string | null;
  parentThreadId?: string | null;
  creatorId?: string | null;
  ownerId?: string | null;
  starred?: boolean | null;
  archived?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ThreadsListResult = PaginatedResult & {
  projectId: string;
  threads: ThreadSummary[];
};

export type ThreadsGetInput = ProjectScoped & { threadId: string };
export type ThreadsGetResult = {
  projectId: string;
  thread: Record<string, unknown>;
};

// ─── invocations ───────────────────────────────────────────────────────────

export type InvocationStatus =
  | "triggered"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "interrupted";

export type InvocationSource = "automation" | "threadTrigger";

export type InvocationsListInput = ProjectScoped & {
  page?: number;
  pageSize?: number;
  sources?: InvocationSource[];
  triggerTypes?: string[];
  statuses?: InvocationStatus[];
  /** ISO-8601 timestamp. */
  triggeredAtFrom?: string;
  /** ISO-8601 timestamp. */
  triggeredAtTo?: string;
  sortBy?: "triggeredAt" | "status" | "source" | "sourceName" | "triggerType";
  order?: SortDirection;
};

export type InvocationSummary = {
  id: string;
  status: InvocationStatus;
  source: InvocationSource;
  sourceName?: string;
  automationName?: string;
  threadTitle?: string;
  triggerType?: string;
  triggeredAt?: string;
};

export type InvocationsListResult = {
  projectId: string;
  invocations: InvocationSummary[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  availableTriggerTypes: string[];
};

// ─── automations ───────────────────────────────────────────────────────────

export type AutomationsListInput = ProjectScoped & PaginationInput;

export type AutomationSummary = {
  id: string;
  name?: string;
  triggerType?: string;
};

export type AutomationsListResult = PaginatedResult & {
  automations: AutomationSummary[];
};

export type AutomationsGetInput = ProjectScoped & { automationId: string };
export type AutomationsGetResult = {
  automation: Record<string, unknown>;
};

// ─── apps ──────────────────────────────────────────────────────────────────

export type AppsListInstalledInput = ProjectScoped &
  PaginationInput & {
    /** Filter results to a specific app ID. */
    appId?: string;
  };

export type AppInstallationSummary = {
  appInstallationId: string;
  name: string;
  appId?: string;
};

export type AppsListInstalledResult = {
  projectId: string;
  apps: AppInstallationSummary[];
  pagination: {
    hasMore: boolean;
    nextPageToken?: string;
  };
};

export type AppsGetInput = { appInstallationId: string };
export type AppsGetResult = Record<string, unknown> & {
  tools?: Record<string, { description?: string; schema?: Record<string, unknown> }>;
};

// ─── web_search ────────────────────────────────────────────────────────────

export type WebSearchCategory =
  | "company"
  | "research paper"
  | "news"
  | "pdf"
  | "github"
  | "tweet"
  | "personal site"
  | "linkedin profile"
  | "financial report";

export type WebSearchSearchInput = {
  query: string;
  category?: WebSearchCategory;
  /** 1–25. Defaults to 10. */
  numResults?: number;
  /** 2-letter ISO country code (e.g. "US"). */
  userLocation?: string;
  includeDomains?: string[];
  /** ISO-8601 timestamp with offset. */
  startPublishedDate?: string;
  /** ISO-8601 timestamp with offset. */
  endPublishedDate?: string;
  /** 0–10. Defaults to 0. */
  subpages?: number;
  /** 0–25. Defaults to 10. */
  links?: number;
  crawlStrategy?: "always" | "preferred" | "fallback" | "never";
};

export type WebSearchResult = {
  title: string;
  publishedDate: string;
  url: string;
  text: string;
  score: number;
  links?: string[];
  subpages?: Array<Omit<WebSearchResult, "subpages">>;
};

export type WebSearchAnswerInput = { query: string };

export type WebSearchCitation = {
  id: string;
  score: number;
  url: string;
  title?: string;
  author?: string;
  publishedDate?: string;
  text?: string;
  image?: string;
};

export type WebSearchAnswerResult = {
  answer: string | Record<string, unknown>;
  citations: WebSearchCitation[];
};
