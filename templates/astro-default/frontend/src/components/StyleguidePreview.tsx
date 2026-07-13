import { lazy, Suspense, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Bell,
  Check,
  CreditCard,
  FileText,
  Filter,
  LayoutDashboard,
  MessageSquare,
  MoreHorizontal,
  Package,
  Paperclip,
  Search,
  Send,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageHeader } from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const marketingFeatures = [
  "React blocks are canonical",
  "Astro can render static TSX",
  "Apps get shadcn primitives first",
];

const rows = [
  ["Acme workspace", "Ready", "24 ms", "Sahil"],
  ["Internal tools", "Building", "41 ms", "Design"],
  ["Support desk", "Queued", "n/a", "Ops"],
  ["Revenue desk", "Ready", "31 ms", "Sales"],
  ["Insight hub", "Failed", "n/a", "Data"],
  ["Launch room", "Ready", "18 ms", "Product"],
];

const ChartStyleguidePreview = lazy(() =>
  import("@/components/ChartStyleguidePreview").then((module) => ({
    default: module.ChartStyleguidePreview,
  }))
);

export function StyleguidePreview() {
  const [prompt, setPrompt] = useState("Summarize the launch risk.");
  const [messages, setMessages] = useState([
    { id: "1", role: "system", content: "New conversation" },
    { id: "2", role: "user", content: "Draft a launch checklist." },
    {
      id: "3",
      role: "assistant",
      content: "Here is a compact checklist grouped by owner.",
      status: "streaming",
    },
  ]);

  function submitPrompt() {
    if (!prompt.trim()) return;
    setMessages((current) => [
      ...current,
      { id: String(current.length + 1), role: "user", content: prompt },
    ]);
    setPrompt("");
  }

  return (
    <TooltipProvider>
      <Toaster position="bottom-right" />
      <div className="space-y-8">
        <ThemeSection />
        <PrimitiveSection />
        <OverlaySection />
        <DataSection />
        <MarketingSection />
        <AppSection />
        <ChatSection messages={messages} prompt={prompt} onPromptChange={setPrompt} onSubmit={submitPrompt} />
      </div>
    </TooltipProvider>
  );
}

function SectionShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-heading text-xl font-semibold tracking-normal">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

function ThemeSection() {
  const swatches = [
    ["bg-background", "text-foreground", "Background"],
    ["bg-card", "text-card-foreground", "Card"],
    ["bg-primary", "text-primary-foreground", "Primary"],
    ["bg-secondary", "text-secondary-foreground", "Secondary"],
    ["bg-muted", "text-muted-foreground", "Muted"],
    ["bg-accent", "text-accent-foreground", "Accent"],
  ];

  return (
    <SectionShell title="Theme And Tokens" description="Light and dark token previews, chart colors, typography, and radius scale.">
      <div className="grid gap-4 lg:grid-cols-2">
        {[false, true].map((dark) => (
          <div key={dark ? "dark" : "light"} className={dark ? "dark" : ""}>
            <Card className="bg-background text-foreground">
              <CardHeader>
                <CardTitle>{dark ? "Dark" : "Light"} mode</CardTitle>
                <CardDescription>Token-backed surfaces and text styles.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  {swatches.map(([bg, fg, label]) => (
                    <div key={label} className={`${bg} ${fg} rounded-lg border px-3 py-2 text-sm`}>
                      <div className="font-medium">{label}</div>
                      <div className="opacity-70">Aa 123</div>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-heading text-2xl font-semibold tracking-normal">Heading sample</p>
                  <p className="text-sm text-muted-foreground">Body copy uses tokenized foreground, muted and border colors.</p>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <span
                      key={index}
                      className="size-8 rounded-lg border"
                      style={{ background: `var(--chart-${index})` }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function PrimitiveSection() {
  return (
    <SectionShell title="Core Primitives" description="Buttons, fields, inputs, selection controls, avatars, loading states and feedback.">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Button variants and compact icon actions.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline" aria-label="Notifications">
                  <Bell className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fields</CardTitle>
            <CardDescription>Field composition, grouped inputs and textarea.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldSet>
              <FieldLegend>Workspace</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input placeholder="Continual" />
                  <FieldDescription>Visible in app shells and metadata.</FieldDescription>
                </Field>
                <InputGroup>
                  <InputGroupInput placeholder="Search records" />
                  <InputGroupAddon align="inline-start">
                    <Search className="size-4" />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton>⌘K</InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <InputGroup>
                  <InputGroupTextarea placeholder="Notes" rows={2} />
                </InputGroup>
              </FieldGroup>
            </FieldSet>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selection</CardTitle>
            <CardDescription>Checkbox, switch, select, badges and avatar groups.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field orientation="horizontal">
              <Checkbox id="styleguide-checkbox" defaultChecked />
              <FieldContent>
                <FieldTitle>Enable previews</FieldTitle>
                <FieldDescription>Interactive components hydrate in app templates.</FieldDescription>
              </FieldContent>
            </Field>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="styleguide-switch">Streaming</Label>
              <Switch id="styleguide-switch" defaultChecked />
            </div>
            <Select defaultValue="react">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="react">React app</SelectItem>
                <SelectItem value="astro">Astro default</SelectItem>
                <SelectItem value="chat">Chat surface</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge>Ready</Badge>
                <Badge variant="secondary">Draft</Badge>
              </div>
              <AvatarGroup>
                <Avatar>
                  <AvatarFallback>SA</AvatarFallback>
                  <AvatarBadge />
                </Avatar>
                <Avatar>
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <AvatarGroupCount>+3</AvatarGroupCount>
              </AvatarGroup>
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionShell>
  );
}

function OverlaySection() {
  return (
    <SectionShell title="Overlays And Commands" description="Dialog, sheet, dropdown, popover, command, tooltip and sonner.">
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 pt-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm deployment</DialogTitle>
                <DialogDescription>This demonstrates modal structure, footer actions and close behavior.</DialogDescription>
              </DialogHeader>
              <DialogFooter showCloseButton>
                <Button>Deploy</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Use sheets for mobile nav, filters and secondary panels.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-3 px-4">
                <Button variant="outline" className="justify-start">
                  <Filter className="size-4" />
                  Status: ready
                </Button>
                <Button variant="outline" className="justify-start">
                  <Users className="size-4" />
                  Owner: design
                </Button>
              </div>
              <SheetFooter>
                <Button>Apply</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Actions
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Template</DropdownMenuLabel>
              <DropdownMenuItem>
                Duplicate
                <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle>Popover panel</PopoverTitle>
                <PopoverDescription>Compact floating content for object details and quick edits.</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            onClick={() => toast.success("Styleguide toast", { description: "Sonner is wired in this template." })}
          >
            Show toast
          </Button>
        </CardContent>
      </Card>

      <Command className="border shadow-sm">
        <CommandInput placeholder="Search components..." />
        <CommandList>
          <CommandEmpty>No components found.</CommandEmpty>
          <CommandGroup heading="Blocks">
            <CommandItem>
              <LayoutDashboard />
              App shell
              <CommandShortcut>AS</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <MessageSquare />
              Chat shell
              <CommandShortcut>CS</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Sparkles />
              Hero
              <CommandShortcut>HR</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </SectionShell>
  );
}

function DataSection() {
  return (
    <SectionShell title="Data Display" description="Tables, tabs, empty states, attachments, charts, data tables, skeletons and spinners.">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Records and analytics</CardTitle>
            <CardDescription>Table, chart, data-table and status states for dashboard surfaces.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="table">
              <TabsList>
                <TabsTrigger value="table">Table</TabsTrigger>
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="data-table">Data table</TabsTrigger>
                <TabsTrigger value="empty">Empty</TabsTrigger>
                <TabsTrigger value="loading">Loading</TabsTrigger>
              </TabsList>
              <TabsContent value="table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Latency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.slice(0, 3).map(([name, status, latency]) => (
                      <TableRow key={name}>
                        <TableCell>{name}</TableCell>
                        <TableCell>{status}</TableCell>
                        <TableCell>{latency}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="chart">
                <Suspense fallback={<Skeleton className="h-72 w-full" />}>
                  <ChartStyleguidePreview type="area" />
                </Suspense>
              </TabsContent>
              <TabsContent value="data-table">
                <DataTablePreview />
              </TabsContent>
              <TabsContent value="empty">
                <Empty>
                  <EmptyMedia variant="icon">
                    <Package />
                  </EmptyMedia>
                  <EmptyHeader>
                    <EmptyTitle>No records</EmptyTitle>
                    <EmptyDescription>Add data to populate this view.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TabsContent>
              <TabsContent value="loading" className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Spinner />
                  Loading records
                </div>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-5/6" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
            <CardDescription>Upload, processing, done and error states.</CardDescription>
          </CardHeader>
          <CardContent>
            <AttachmentGroup>
              {["uploading", "processing", "done", "error"].map((state) => (
                <Attachment key={state} state={state as "uploading" | "processing" | "done" | "error"} size="sm">
                  <AttachmentMedia>
                    <FileText className="size-4" />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>{state}.md</AttachmentTitle>
                    <AttachmentDescription>24 KB</AttachmentDescription>
                  </AttachmentContent>
                  <AttachmentActions>
                    <AttachmentAction aria-label={`Open ${state}`}>
                      <MoreHorizontal className="size-3" />
                    </AttachmentAction>
                  </AttachmentActions>
                </Attachment>
              ))}
            </AttachmentGroup>
          </CardContent>
        </Card>
      </div>
    </SectionShell>
  );
}

function DataTablePreview() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | null>(null);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const pageSize = 3;
  const filteredRows = rows
    .filter((row) => row.join(" ").toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (!sort) return 0;
      return sort === "asc" ? a[0].localeCompare(b[0]) : b[0].localeCompare(a[0]);
    });
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pageRows = filteredRows.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            className="pl-8"
            placeholder="Search rows"
          />
        </div>
        <Badge variant="secondary">{selected.size} selected</Badge>
      </div>
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  aria-label="Select all rows"
                  checked={pageRows.length > 0 && pageRows.every(([name]) => selected.has(name))}
                  onCheckedChange={(checked) => {
                    const next = new Set(selected);
                    pageRows.forEach(([name]) => {
                      if (checked) next.add(name);
                      else next.delete(name);
                    });
                    setSelected(next);
                  }}
                />
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-2"
                  onClick={() => setSort((current) => (current === "asc" ? "desc" : current === "desc" ? null : "asc"))}
                >
                  Name
                  {sort === "asc" && <ArrowUp className="size-3.5" />}
                  {sort === "desc" && <ArrowDown className="size-3.5" />}
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Owner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map(([name, status, , owner]) => (
              <TableRow key={name} data-state={selected.has(name) ? "selected" : undefined}>
                <TableCell>
                  <Checkbox
                    aria-label={`Select ${name}`}
                    checked={selected.has(name)}
                    onCheckedChange={(checked) => {
                      const next = new Set(selected);
                      if (checked) next.add(name);
                      else next.delete(name);
                      setSelected(next);
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">{name}</TableCell>
                <TableCell>{status}</TableCell>
                <TableCell>{owner}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page + 1} of {pageCount}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled={page >= pageCount - 1} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

function MarketingSection() {
  return (
    <SectionShell title="Marketing Blocks" description="Compact previews for the canonical React marketing block set.">
      <div className="overflow-hidden rounded-xl border">
        <div className="px-6 py-12 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Hero</p>
          <h3 className="mx-auto mt-3 max-w-2xl font-heading text-4xl font-semibold tracking-normal text-balance">
            Build SEO pages in Astro and app surfaces in React from the same system
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Shared TSX blocks keep the design language portable while Astro keeps metadata, content and static output.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button>Get started</Button>
            <Button variant="outline">View blocks</Button>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4 p-4 md:grid-cols-3">
          {marketingFeatures.map((feature) => (
            <Card key={feature}>
              <CardHeader>
                <CardTitle className="text-base">{feature}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Representative feature card styling from the marketing block family.
              </CardContent>
            </Card>
          ))}
        </div>
        <Separator />
        <div className="grid gap-4 p-4 md:grid-cols-3">
          {["Starter", "Growth", "Scale"].map((tier, index) => (
            <Card key={tier} className={index === 1 ? "border-primary ring-1 ring-primary" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{tier}</CardTitle>
                  {index === 1 && <Badge>Popular</Badge>}
                </div>
                <p className="font-heading text-3xl font-semibold">${index === 0 ? "19" : index === 1 ? "49" : "99"}</p>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p className="flex gap-2">
                  <Check className="size-4 text-primary" />
                  Shared blocks
                </p>
                <p className="flex gap-2">
                  <Check className="size-4 text-primary" />
                  shadcn primitives
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function AppSection() {
  return (
    <SectionShell title="App Blocks" description="Dashboard shell, page headers, metrics, filters, settings forms and empty states.">
      <div className="overflow-hidden rounded-xl border">
        <div className="grid min-h-[520px] lg:grid-cols-[220px_1fr]">
          <aside className="border-r bg-muted/40 p-3">
            <div className="mb-4 flex items-center gap-2 px-2 font-heading font-semibold">
              <LayoutDashboard className="size-4" />
              Console
            </div>
            <nav className="grid gap-1 text-sm">
              {[
                [LayoutDashboard, "Dashboard"],
                [MessageSquare, "Conversations"],
                [BarChart3, "Analytics"],
                [Settings, "Settings"],
              ].map(([Icon, label]) => (
                <Button key={label as string} variant={label === "Dashboard" ? "secondary" : "ghost"} className="justify-start">
                  <Icon className="size-4" />
                  {label as string}
                </Button>
              ))}
            </nav>
          </aside>
          <main className="space-y-4 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-heading text-2xl font-semibold tracking-normal">Dashboard</h3>
                <p className="text-sm text-muted-foreground">Operational preview for app-style generated sites.</p>
              </div>
              <Button>
                <CreditCard className="size-4" />
                New report
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                ["Active users", "12.4k", "+18%"],
                ["Runs", "842", "+9%"],
                ["Errors", "7", "-3%"],
              ].map(([label, value, delta]) => (
                <Card key={label}>
                  <CardHeader>
                    <CardDescription>{label}</CardDescription>
                    <CardTitle className="text-2xl">{value}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{delta} this week</CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Dashboard chart</CardTitle>
                <CardDescription>Recharts through the shared chart primitive.</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-72 w-full" />}>
                  <ChartStyleguidePreview type="bar" />
                </Suspense>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Filter bar</CardTitle>
                <CardDescription>Common app toolbar pattern.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 sm:flex-row">
                <Input className="sm:max-w-xs" placeholder="Search workspaces" />
                <Select defaultValue="ready">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="queued">Queued</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="size-4" />
                  Filters
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SectionShell>
  );
}

function ChatSection({
  messages,
  prompt,
  onPromptChange,
  onSubmit,
}: {
  messages: Array<{ id: string; role: string; content: string; status?: string }>;
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <SectionShell title="Chat Blocks" description="Transport-agnostic shell using shadcn chat primitives and prompt input.">
      <Card className="h-[640px] overflow-hidden p-0">
        <MessageScrollerProvider>
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent className="p-4">
                {messages.map((message) => (
                  <MessageScrollerItem key={message.id} scrollAnchor={message.status === "streaming"}>
                    {message.role === "system" ? (
                      <Marker>
                        <MarkerIcon>
                          <MessageSquare className="size-4" />
                        </MarkerIcon>
                        <MarkerContent>{message.content}</MarkerContent>
                      </Marker>
                    ) : (
                      <Message align={message.role === "user" ? "end" : "start"}>
                        {message.role !== "user" && <MessageAvatar>AI</MessageAvatar>}
                        <MessageContent>
                          <MessageHeader>{message.role === "user" ? "You" : "Assistant"}</MessageHeader>
                          <Bubble
                            align={message.role === "user" ? "end" : "start"}
                            variant={message.role === "user" ? "default" : "secondary"}
                          >
                            <BubbleContent>{message.content}</BubbleContent>
                          </Bubble>
                          {message.role === "assistant" && (
                            <AttachmentGroup>
                              <Attachment size="sm">
                                <AttachmentMedia>
                                  <FileText className="size-4" />
                                </AttachmentMedia>
                                <AttachmentContent>
                                  <AttachmentTitle>launch-plan.md</AttachmentTitle>
                                  <AttachmentDescription>Generated artifact</AttachmentDescription>
                                </AttachmentContent>
                              </Attachment>
                            </AttachmentGroup>
                          )}
                          {message.status === "streaming" && (
                            <MessageFooter>
                              <Spinner />
                              Streaming
                            </MessageFooter>
                          )}
                        </MessageContent>
                      </Message>
                    )}
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
        <Separator />
        <form
          className="space-y-2 p-3"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <AttachmentGroup>
            <Attachment state="done" size="sm">
              <AttachmentMedia>
                <Paperclip className="size-4" />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>brief.pdf</AttachmentTitle>
                <AttachmentDescription>Attached context</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
          </AttachmentGroup>
          <InputGroup>
            <InputGroupTextarea
              value={prompt}
              onChange={(event) => onPromptChange(event.target.value)}
              placeholder="Ask anything..."
              rows={2}
            />
            <InputGroupAddon align="inline-start">
              <InputGroupButton aria-label="Attach file">
                <Paperclip className="size-4" />
              </InputGroupButton>
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Button type="submit" size="icon-sm" aria-label="Send message" disabled={!prompt.trim()}>
                <Send className="size-4" />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </Card>
    </SectionShell>
  );
}

export default StyleguidePreview;
