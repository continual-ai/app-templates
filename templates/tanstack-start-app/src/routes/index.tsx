import { createFileRoute } from "@tanstack/react-router";
import { StarterDashboard } from "@/components/blocks/StarterDashboard";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <StarterDashboard />;
}
