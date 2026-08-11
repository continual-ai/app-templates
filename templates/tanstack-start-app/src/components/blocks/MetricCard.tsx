import type { ComponentType } from "react";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  delta,
  trend = "neutral",
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  icon?: ComponentType<{ className?: string }>;
}) {
  const TrendIcon = trend === "down" ? ArrowDownRight : ArrowUpRight;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardDescription>{label}</CardDescription>
          {Icon && <Icon className="size-4 text-muted-foreground" />}
        </div>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
      {delta && (
        <CardContent className="flex items-center gap-1 text-sm text-muted-foreground">
          <TrendIcon
            className={cn(
              "size-4",
              trend === "up" && "text-primary",
              trend === "down" && "text-destructive"
            )}
          />
          <span>{delta}</span>
        </CardContent>
      )}
    </Card>
  );
}
