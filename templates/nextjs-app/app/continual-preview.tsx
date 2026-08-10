"use client";

import { initDesignMode, initTelemetry } from "@continual/sdk/app-preview";
import { useEffect } from "react";

export function ContinualPreview() {
  useEffect(() => {
    initDesignMode();
    initTelemetry();
  }, []);

  return null;
}
