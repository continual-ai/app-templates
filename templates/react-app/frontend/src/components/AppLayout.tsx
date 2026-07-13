import { Link, NavLink, Outlet } from "react-router";
import { Bell, Gauge, PanelLeft, Search, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/", icon: Gauge },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-sidebar px-3 py-3 text-sidebar-foreground lg:block">
        <Link to="/" className="flex h-10 items-center gap-2 rounded-lg px-2 font-heading font-semibold">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            C
          </span>
          Continual App
        </Link>
        <nav className="mt-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex h-9 items-center gap-2 rounded-lg px-2 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                )
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
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
          <Button variant="outline" size="icon" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
