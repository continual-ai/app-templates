import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initTelemetry } from "@continual/sites-sdk/telemetry";

import App from "@/App";
import "@/styles/global.css";

initTelemetry();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
