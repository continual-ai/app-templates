import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export interface ChartCardSeries {
  key: string;
  label: string;
  color?: string;
}

export function ChartCard({
  title,
  description,
  data,
  xKey,
  series,
  type = "area",
}: {
  title: string;
  description?: string;
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: ChartCardSeries[];
  type?: "area" | "bar";
}) {
  const config = Object.fromEntries(
    series.map((item, index) => [
      item.key,
      {
        label: item.label,
        color: item.color ?? `var(--chart-${index + 1})`,
      },
    ])
  ) satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          {type === "bar" ? (
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent config={config} />} />
              <ChartLegend content={<ChartLegendContent config={config} />} />
              {series.map((item) => (
                <Bar key={item.key} dataKey={item.key} fill={`var(--color-${item.key})`} radius={4} />
              ))}
            </BarChart>
          ) : (
            <AreaChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent config={config} />} />
              <ChartLegend content={<ChartLegendContent config={config} />} />
              {series.map((item) => (
                <Area
                  key={item.key}
                  type="natural"
                  dataKey={item.key}
                  fill={`var(--color-${item.key})`}
                  fillOpacity={0.22}
                  stroke={`var(--color-${item.key})`}
                  stackId="1"
                />
              ))}
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
