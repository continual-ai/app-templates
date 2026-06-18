/**
 * FAQ — accordion list of question/answer pairs. Self-contained (no external
 * accordion dependency). Interactive (React state) → use with a client directive:
 *   <FAQ client:visible heading="FAQ" items={[{ q: "…", a: "…" }]} />
 *
 * Tier: block / section.
 * Props: items (required, { q: string; a: string }[]), heading? (string).
 * Prerequisites: lucide-react (ships with the template).
 */
import * as React from "react";
import { ChevronDown } from "lucide-react";

interface QA {
  q: string;
  a: string;
}

export function FAQ({ items, heading }: { items: QA[]; heading?: string }) {
  const [open, setOpen] = React.useState<number | null>(null);

  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-20">
      {heading && (
        <h2 className="text-foreground font-heading mb-8 text-center text-3xl font-semibold tracking-tight">
          {heading}
        </h2>
      )}
      <ul className="divide-border border-border divide-y border-y">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <li key={i}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="text-foreground flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium"
              >
                {item.q}
                <ChevronDown
                  className={`size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && <p className="text-muted-foreground pb-4 text-sm text-pretty">{item.a}</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default FAQ;
