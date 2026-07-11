import { cn } from "@/lib/utils";

import { SectionHeading } from "./SectionHeading";

export interface BentoItem {
  title: string;
  description?: string;
  eyebrow?: string;
  span?: "sm" | "md" | "lg";
}

const spanClasses: Record<NonNullable<BentoItem["span"]>, string> = {
  sm: "",
  md: "sm:col-span-2",
  lg: "sm:col-span-2 lg:row-span-2",
};

export function Bento({
  items,
  heading,
  subheading,
}: {
  items: BentoItem[];
  heading?: string;
  subheading?: string;
}) {
  return (
    <section className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading heading={heading} subheading={subheading} />
        <div className="grid auto-rows-[minmax(12rem,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className={cn(
                "flex flex-col rounded-xl border bg-card p-6 text-card-foreground shadow-sm",
                spanClasses[item.span ?? "sm"]
              )}
            >
              {item.eyebrow && (
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {item.eyebrow}
                </span>
              )}
              <h3 className="mt-2 font-heading font-medium text-foreground">{item.title}</h3>
              {item.description && (
                <p className="mt-2 text-sm text-pretty text-muted-foreground">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Bento;
