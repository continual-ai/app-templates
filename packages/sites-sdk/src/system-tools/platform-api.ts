import { callContinualToolJson } from "../client";
import type { PreviewRuntimeConfig } from "../types";
import type {
  AppsGetInput,
  AppsGetResult,
  AppsListInstalledInput,
  AppsListInstalledResult,
  AutomationsGetInput,
  AutomationsGetResult,
  AutomationsListInput,
  AutomationsListResult,
  InvocationsListInput,
  InvocationsListResult,
  ThreadsGetInput,
  ThreadsGetResult,
  ThreadsListInput,
  ThreadsListResult,
} from "./types";

const SYSTEM_TOOLS = "system-tools";
const PLATFORM_API = "platform_api";

/**
 * Typed bindings for the `system_tools__platform_api` system tool.
 *
 * Each method wraps `callContinualToolJson` with the right `command` and
 * `options` shape. Pass `runtime` from `process.env` when calling from a Node
 * script (e.g. `scripts/call.ts`); site code in the browser omits it and the
 * SDK auto-detects the preview/published transport.
 *
 * Coverage is intentionally focused on read commands a site uses for live
 * dashboards. For commands not exposed here, fall back to:
 *
 *   callContinualToolJson({ appInstallationId: "system-tools",
 *                            name: "platform_api",
 *                            arguments: { command: "<...>", options: {...} } })
 */
export const platformApi = {
  threads: {
    list: (options: ThreadsListInput = {}, runtime?: PreviewRuntimeConfig) =>
      callContinualToolJson<ThreadsListResult>(
        {
          appInstallationId: SYSTEM_TOOLS,
          name: PLATFORM_API,
          arguments: { command: "threads list", options },
        },
        runtime
      ),

    get: (options: ThreadsGetInput, runtime?: PreviewRuntimeConfig) =>
      callContinualToolJson<ThreadsGetResult>(
        {
          appInstallationId: SYSTEM_TOOLS,
          name: PLATFORM_API,
          arguments: { command: "threads get", options },
        },
        runtime
      ),
  },

  invocations: {
    list: (options: InvocationsListInput = {}, runtime?: PreviewRuntimeConfig) =>
      callContinualToolJson<InvocationsListResult>(
        {
          appInstallationId: SYSTEM_TOOLS,
          name: PLATFORM_API,
          arguments: { command: "invocations list", options },
        },
        runtime
      ),
  },

  automations: {
    list: (options: AutomationsListInput = {}, runtime?: PreviewRuntimeConfig) =>
      callContinualToolJson<AutomationsListResult>(
        {
          appInstallationId: SYSTEM_TOOLS,
          name: PLATFORM_API,
          arguments: { command: "automations list", options },
        },
        runtime
      ),

    get: (options: AutomationsGetInput, runtime?: PreviewRuntimeConfig) =>
      callContinualToolJson<AutomationsGetResult>(
        {
          appInstallationId: SYSTEM_TOOLS,
          name: PLATFORM_API,
          arguments: { command: "automations get", options },
        },
        runtime
      ),
  },

  apps: {
    listInstalled: (options: AppsListInstalledInput = {}, runtime?: PreviewRuntimeConfig) =>
      callContinualToolJson<AppsListInstalledResult>(
        {
          appInstallationId: SYSTEM_TOOLS,
          name: PLATFORM_API,
          arguments: { command: "apps list_installed", options },
        },
        runtime
      ),

    get: (options: AppsGetInput, runtime?: PreviewRuntimeConfig) =>
      callContinualToolJson<AppsGetResult>(
        {
          appInstallationId: SYSTEM_TOOLS,
          name: PLATFORM_API,
          arguments: { command: "apps get", options },
        },
        runtime
      ),
  },
} as const;
