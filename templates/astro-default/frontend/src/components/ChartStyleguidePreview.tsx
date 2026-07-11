import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartData = [
  { month: "Jan", visitors: 186, conversations: 80 },
  { month: "Feb", visitors: 305, conversations: 200 },
  { month: "Mar", visitors: 237, conversations: 120 },
  { month: "Apr", visitors: 273, conversations: 190 },
  { month: "May", visitors: 209, conversations: 130 },
  { month: "Jun", visitors: 314, conversations: 240 },
];

const chartConfig = {
  visitors: { label: "Visitors", color: "var(--chart-1)" },
  conversations: { label: "Conversations", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function ChartStyleguidePreview({ type = "area" }: { type?: "area" | "bar" }) {
  return (
    <ChartContainer config={chartConfig}>
      {type === "bar" ? (
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent config={chartConfig} />} />
          <ChartLegend content={<ChartLegendContent config={chartConfig} />} />
          <Bar dataKey="visitors" fill="var(--color-visitors)" radius={4} />
          <Bar dataKey="conversations" fill="var(--color-conversations)" radius={4} />
        </BarChart>
      ) : (
        <AreaChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent config={chartConfig} />} />
          <ChartLegend content={<ChartLegendContent config={chartConfig} />} />
          <Area
            type="natural"
            dataKey="visitors"
            fill="var(--color-visitors)"
            fillOpacity={0.22}
            stroke="var(--color-visitors)"
          />
          <Area
            type="natural"
            dataKey="conversations"
            fill="var(--color-conversations)"
            fillOpacity={0.18}
            stroke="var(--color-conversations)"
          />
        </AreaChart>
      )}
    </ChartContainer>
  );
}
