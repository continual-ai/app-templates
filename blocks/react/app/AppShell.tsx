import type { ReactNode } from "react";

import { Bell, PanelLeft, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AppShell({
  brand,
  sidebar,
  children,
  headerActions,
}: {
  brand: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
  headerActions?: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-sidebar px-3 py-3 text-sidebar-foreground lg:block">
        <div className="flex h-10 items-center gap-2 rounded-lg px-2 font-heading font-semibold">
          {brand}
        </div>
        <div className="mt-4">{sidebar}</div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
            <PanelLeft className="size-4" />
          </Button>
          <div className="relative min-w-0 flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-8" placeholder="Search" type="search" />
          </div>
          {headerActions}
          <Button variant="outline" size="icon" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
