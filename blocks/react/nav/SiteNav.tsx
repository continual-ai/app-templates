/**
 * SiteNav — header nav bar: brand on the left, inline links on desktop, and a
 * hamburger menu that expands on mobile. Interactive (React state) → use with a
 * client directive and place it in a layout's "header" slot:
 *   <SiteNav slot="header" client:load brand="Acme" links={[{ label, href }]} />
 *
 * Tier: block / nav.
 * Props: brand (required), links? ({ label, href }[]).
 * Prerequisites: @/components/ui/button, lucide-react (both ship with the template).
 */
import * as React from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface NavLink {
  label: string;
  href: string;
}

export function SiteNav({ brand, links = [] }: { brand: string; links?: NavLink[] }) {
  const [open, setOpen] = React.useState(false);

  return (
    <nav className="relative flex h-14 w-full items-center justify-between">
      <a href="/" className="text-foreground font-semibold tracking-tight">
        {brand}
      </a>

      <div className="hidden items-center gap-1 sm:flex">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-sm"
          >
            {link.label}
          </a>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="sm:hidden"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X /> : <Menu />}
      </Button>

      {open && (
        <div className="bg-background absolute inset-x-0 top-14 z-50 border-b shadow-sm sm:hidden">
          <div className="flex flex-col p-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground hover:bg-muted rounded-md px-3 py-2 text-sm"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default SiteNav;
