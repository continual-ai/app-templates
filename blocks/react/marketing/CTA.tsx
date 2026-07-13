import { Button } from "@/components/ui/button";

import type { Cta } from "./types";

export function CTA({ title, subtitle, cta }: { title: string; subtitle?: string; cta?: Cta }) {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 rounded-2xl border bg-muted px-6 py-14 text-center shadow-sm">
        <h2 className="font-heading text-3xl font-semibold tracking-normal text-balance text-foreground">
          {title}
        </h2>
        {subtitle && <p className="max-w-xl text-pretty text-muted-foreground">{subtitle}</p>}
        {cta && (
          <Button asChild size="lg">
            <a href={cta.href}>{cta.label}</a>
          </Button>
        )}
      </div>
    </section>
  );
}

export default CTA;
