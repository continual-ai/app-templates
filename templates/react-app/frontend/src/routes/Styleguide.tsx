import { StyleguidePreview } from "@/components/StyleguidePreview";

const catalog = [
  "blocks/react/marketing: Hero, HeroSplit, Features, Bento, Pricing, Stats, Testimonials, LogoCloud, Team, Gallery, CTA, Footer, FAQ, Newsletter",
  "blocks/react/app: AppShell, SidebarNav, PageHeader, MetricCard, ChartCard, DataTable, FilterBar, EmptyState, SettingsForm",
  "blocks/react/chat: ChatShell, MessageList, PromptComposer, AttachmentRow, StatusMarker",
  "blocks/react/nav and blocks/react/motion: SiteNav, Reveal",
  "design-system.json and styleguide.json: machine-readable inventory, rules, tokens, and expected coverage",
];

export function Styleguide() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Design system
        </p>
        <h1 className="font-heading text-2xl font-semibold tracking-normal">Styleguide</h1>
        <p className="text-sm text-muted-foreground">
          Hidden reference for shadcn primitives, chat primitives, and shared block locations.
        </p>
      </div>
      <StyleguidePreview />
      <section className="space-y-3">
        <h2 className="font-heading text-xl font-semibold tracking-normal">Copy-on-demand blocks</h2>
        <ul className="divide-y rounded-xl border">
          {catalog.map((item) => (
            <li key={item} className="px-4 py-3 text-sm text-muted-foreground">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
