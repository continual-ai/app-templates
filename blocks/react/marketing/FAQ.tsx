import * as React from "react";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  q: string;
  a: string;
}

export function FAQ({ items, heading }: { items: FAQItem[]; heading?: string }) {
  const [open, setOpen] = React.useState<number | null>(null);

  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-20">
      {heading && (
        <h2 className="mb-8 text-center font-heading text-3xl font-semibold tracking-normal text-foreground">
          {heading}
        </h2>
      )}
      <ul className="divide-y divide-border border-y border-border">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <li key={item.q}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-foreground"
              >
                {item.q}
                <ChevronDown className={`size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && <p className="pb-4 text-sm text-pretty text-muted-foreground">{item.a}</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default FAQ;
