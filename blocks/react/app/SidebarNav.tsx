import type { ComponentType } from "react";

import { cn } from "@/lib/utils";

export interface SidebarNavItem {
  label: string;
  href: string;
  active?: boolean;
  icon?: ComponentType<{ className?: string }>;
}

export function SidebarNav({ items }: { items: SidebarNavItem[] }) {
  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
          className={cn(
            "flex h-9 items-center gap-2 rounded-lg px-2 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            item.active && "bg-sidebar-accent text-sidebar-accent-foreground"
          )}
        >
          {item.icon && <item.icon className="size-4" />}
          {item.label}
        </a>
      ))}
    </nav>
  );
}
