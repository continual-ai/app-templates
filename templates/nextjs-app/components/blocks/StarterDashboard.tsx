"use client";

import { Activity, ArrowUpRight, Boxes, FolderKanban, Inbox, Plus } from "lucide-react";

import { AppShell } from "./AppShell";
import { EmptyState } from "./EmptyState";
import { MetricCard } from "./MetricCard";
import { PageHeader } from "./PageHeader";
import { SidebarNav } from "./SidebarNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const navigation = [
  { label: "Overview", href: "#overview", active: true, icon: Activity },
  { label: "Projects", href: "#projects", icon: FolderKanban },
  { label: "Inbox", href: "#inbox", icon: Inbox },
];

function CreateProjectDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus data-icon="inline-start" />
          New project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a project</DialogTitle>
          <DialogDescription>
            Start with a clear name. You can connect data and invite collaborators later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="project-name">
            Project name
          </label>
          <Input id="project-name" name="project-name" placeholder="Customer insights" autoFocus />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Create project</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function StarterDashboard() {
  return (
    <AppShell
      brand={
        <>
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Boxes className="size-4" aria-hidden="true" />
          </span>
          <span>Continual App</span>
        </>
      }
      sidebar={<SidebarNav items={navigation} />}
      headerActions={<Badge variant="secondary" className="hidden sm:inline-flex">Starter workspace</Badge>}
    >
      <div id="overview" className="space-y-5">
        <PageHeader
          title="Workspace overview"
          description="A framework-native starter built from shared semantic tokens, primitives, layouts, and blocks."
          actions={<CreateProjectDialog />}
        />

        <section aria-label="Workspace metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard label="Active projects" value="12" delta="2 added this week" icon={FolderKanban} />
          <MetricCard label="Automations" value="34" delta="98.7% successful" icon={Activity} />
          <MetricCard label="Needs attention" value="3" delta="Down from 7" trend="down" icon={Inbox} />
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
          <Card id="projects">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>Recent projects</CardTitle>
                  <CardDescription>Reusable card, badge, button, and token conventions.</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View all
                  <ArrowUpRight data-icon="inline-end" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {["Quarterly planning", "Support intelligence", "Launch readiness"].map((name, index) => (
                <div key={name} className="flex items-center gap-3 rounded-lg border bg-background p-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-xs text-muted-foreground">
                    0{index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{name}</p>
                    <p className="text-xs text-muted-foreground">Updated {index + 1}h ago</p>
                  </div>
                  <Badge variant={index === 2 ? "outline" : "secondary"}>
                    {index === 2 ? "Draft" : "Active"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card id="inbox">
            <CardHeader>
              <CardTitle>Inbox</CardTitle>
              <CardDescription>Empty states remain useful and actionable.</CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={Inbox}
                title="You’re all caught up"
                description="New approvals and automation alerts will appear here."
                action={<Button variant="outline" size="sm">Review activity</Button>}
              />
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
