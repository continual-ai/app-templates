import { cn } from "@/lib/utils";

import { SectionHeading } from "./SectionHeading";

export interface StatItem {
  value: string;
  label: string;
}

export function Stats({
  items,
  heading,
  subheading,
}: {
  items: StatItem[];
  heading?: string;
  subheading?: string;
}) {
  const columns =
    items.length <= 2 ? "sm:grid-cols-2" : items.length === 3 ? "sm:grid-cols-3" : "md:grid-cols-4";

  return (
    <section className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading heading={heading} subheading={subheading} />
        <dl className={cn("grid grid-cols-2 gap-8 rounded-xl border bg-muted p-8 sm:p-12", columns)}>
          {items.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2 text-center">
              <dt className="sr-only">{item.label}</dt>
              <dd className="font-heading text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
                {item.value}
              </dd>
              <p className="text-sm text-pretty text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default Stats;
