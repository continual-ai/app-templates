/**
 * VariantChooser — proposal-time floating control for letting the user pick a
 * direction. Renders as a small bubble in the corner (like a dev-tools button)
 * that expands into a panel listing each option with its agent-written
 * description. This is NOT site content: drop it in while proposing options,
 * then bake the chosen variant and delete this control + the alternatives.
 *
 * Two modes (one component):
 *  - Style/token (default): each option flips an HTML attribute (data-theme by
 *    default), so the SAME page restyles instantly via scoped token overrides.
 *    Give the base/neutral option the id matching `base` to clear the attribute.
 *  - Structure/feature: give each option an `href` and it becomes a link to a
 *    throwaway preview route, so the user flips between separately-rendered
 *    versions.
 *
 * Each variant takes a `blurb` — a short, human description of that direction;
 * it's shown in the expanded panel, so write it for the user, not for yourself.
 *
 * Use with a client directive:
 *   import VariantChooser from "@/components/VariantChooser";
 *   <VariantChooser title="Aesthetic" client:load
 *     variants={[{ id: "base", label: "Minimal", blurb: "Neutral, flat, tight" },
 *                { id: "editorial", label: "Editorial", blurb: "Warm paper, serif headings" }]} />
 *
 * Prerequisites: @/components/ui/button, @/lib/utils, lucide-react.
 */
import * as React from "react";
import { Check, Sparkles, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Variant {
  id: string;
  label: string;
  blurb?: string;
  /** Present → route mode: this option links to a preview route. */
  href?: string;
}

export function VariantChooser({
  variants,
  title = "Direction",
  attribute = "data-theme",
  base = "base",
}: {
  variants: Variant[];
  title?: string;
  attribute?: string;
  base?: string;
}) {
  const isRoute = variants.some((v) => v.href);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<string>(base);
  const current = isRoute && typeof window !== "undefined" ? window.location.pathname : null;

  function pick(v: Variant) {
    if (v.href) return; // the <a> handles navigation
    if (v.id === base) document.documentElement.removeAttribute(attribute);
    else document.documentElement.setAttribute(attribute, v.id);
    setActive(v.id);
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="bg-popover text-popover-foreground w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border shadow-xl">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="text-sm font-medium">{title}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
          <ul className="max-h-[60vh] overflow-y-auto p-1">
            {variants.map((v) => {
              const selected = isRoute ? current === v.href : active === v.id;
              const cls = cn(
                "flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left transition-colors",
                selected ? "bg-muted" : "hover:bg-muted"
              );
              const inner = (
                <>
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center">
                    {selected && <Check className="size-4" />}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-sm font-medium">{v.label}</span>
                    {v.blurb && <span className="text-muted-foreground text-xs">{v.blurb}</span>}
                  </span>
                </>
              );
              return (
                <li key={v.id}>
                  {v.href ? (
                    <a href={v.href} className={cls}>
                      {inner}
                    </a>
                  ) : (
                    <button type="button" className={cls} onClick={() => pick(v)}>
                      {inner}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <Button
        size="icon"
        className="size-11 rounded-full shadow-lg"
        aria-label={title}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X /> : <Sparkles />}
      </Button>
    </div>
  );
}

export default VariantChooser;
