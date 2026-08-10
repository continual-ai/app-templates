import { initDesignMode, initTelemetry } from "@continual/sdk/app-preview";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@/App";
import "@/styles/global.css";

initDesignMode();
initTelemetry();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
