import { cn } from "@/lib/utils";

import type { SectionHeadingProps } from "./types";

export function SectionHeading({ heading, subheading, align = "center" }: SectionHeadingProps) {
  if (!heading && !subheading) return null;

  return (
    <div
      className={cn(
        "mb-12 max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left"
      )}
    >
      {heading && (
        <h2 className="font-heading text-3xl font-semibold tracking-normal text-balance text-foreground">
          {heading}
        </h2>
      )}
      {subheading && <p className="mt-3 text-pretty text-muted-foreground">{subheading}</p>}
    </div>
  );
}
