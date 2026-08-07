import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main
      style={{ maxWidth: 760, margin: "15vh auto", fontFamily: "system-ui" }}
    >
      <p>TanStack Start + Cloudflare</p>
      <h1>Your Continual App is ready.</h1>
    </main>
  );
}
