import { Button } from "@/components/ui/button";

import type { Cta } from "./types";

export interface HeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
}

export function Hero({ title, subtitle, eyebrow, primaryCta, secondaryCta }: HeroProps) {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        {eyebrow && (
          <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {eyebrow}
          </span>
        )}
        <h1 className="font-heading text-4xl font-semibold tracking-normal text-balance text-foreground sm:text-5xl">
          {title}
        </h1>
        {subtitle && <p className="max-w-xl text-lg text-pretty text-muted-foreground">{subtitle}</p>}
        {(primaryCta || secondaryCta) && (
          <div className="flex flex-wrap items-center justify-center gap-3">
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
    </section>
  );
}

export default Hero;
