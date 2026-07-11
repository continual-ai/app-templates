import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

import type { Cta } from "./types";

export interface HeroSplitProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  visual?: ReactNode;
}

export function HeroSplit({
  title,
  subtitle,
  eyebrow,
  primaryCta,
  secondaryCta,
  visual,
}: HeroSplitProps) {
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          {eyebrow && (
            <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {eyebrow}
            </span>
          )}
          <h1 className="font-heading text-4xl font-semibold tracking-normal text-balance text-foreground sm:text-5xl">
            {title}
          </h1>
          {subtitle && <p className="text-lg text-pretty text-muted-foreground">{subtitle}</p>}
          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap items-center gap-3">
              {primaryCta && (
                <Button asChild size="lg">
                  <a href={primaryCta.href}>{primaryCta.label}</a>
                </Button>
              )}
              {secondaryCta && (
                <Button asChild size="lg" variant="outline">
                  <a href={secondaryCta.href}>{secondaryCta.label}</a>
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-xl border bg-muted">
          {visual}
        </div>
      </div>
    </section>
  );
}

export default HeroSplit;
