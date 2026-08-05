import { Activity, ArrowUpRight, Clock3, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const metrics = [
  { label: "Active users", value: "12,482", delta: "+8.2%", icon: Users },
  { label: "Tasks complete", value: "1,284", delta: "+14.1%", icon: Activity },
  { label: "Median response", value: "312 ms", delta: "-6.4%", icon: Clock3 },
];

export function Dashboard() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-normal">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Replace this starter content with the app workflow, dashboard, or internal tool.
        </p>
      </div>

      <section className="grid gap-3 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardDescription>{metric.label}</CardDescription>
                <metric.icon className="size-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-1 text-sm text-muted-foreground">
              <ArrowUpRight className="size-4 text-primary" />
              <span>{metric.delta} from last week</span>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Work queue</CardTitle>
            <CardDescription>Prioritized items that need attention.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Review onboarding requests", "Triage support escalations", "Publish weekly report"].map(
              (item, index) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-lg border bg-background px-3 py-2"
                >
                  <span className="text-sm font-medium">{item}</span>
                  <span className="text-xs text-muted-foreground">P{index + 1}</span>
                </div>
              )
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>System health across core services.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["API", "Database", "Scheduler"].map((service) => (
              <div key={service} className="flex items-center justify-between text-sm">
                <span>{service}</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium">Operational</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
