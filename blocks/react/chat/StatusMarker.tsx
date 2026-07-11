import { Loader2 } from "lucide-react";

import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";

export function StatusMarker({ children = "Generating response..." }: { children?: string }) {
  return (
    <Marker>
      <MarkerIcon>
        <Loader2 className="size-4 animate-spin" />
      </MarkerIcon>
      <MarkerContent className="shimmer">{children}</MarkerContent>
    </Marker>
  );
}
