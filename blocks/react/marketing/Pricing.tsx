import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { SectionHeading } from "./SectionHeading";
import type { Cta } from "./types";

export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  cta: Cta;
  popular?: boolean;
}

export function Pricing({
  tiers,
  heading,
  subheading,
}: {
  tiers: PricingTier[];
  heading?: string;
  subheading?: string;
}) {
  return (
    <section className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading heading={heading} subheading={subheading} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn("gap-6", tier.popular && "border-primary ring-1 ring-primary")}
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{tier.name}</CardTitle>
                  {tier.popular && <Badge>Popular</Badge>}
                </div>
                <p className="flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-semibold tracking-normal text-foreground">
                    {tier.price}
                  </span>
                  {tier.period && <span className="text-sm text-muted-foreground">{tier.period}</span>}
                </p>
                {tier.description && (
                  <p className="text-sm text-pretty text-muted-foreground">{tier.description}</p>
                )}
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <ul className="flex flex-col gap-3 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-pretty text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="mt-6 w-full"
                  variant={tier.popular ? "default" : "outline"}
                >
                  <a href={tier.cta.href}>{tier.cta.label}</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;
