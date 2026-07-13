/**
 * Reveal — fade/slide-up on scroll via IntersectionObserver. Dependency-light
 * (no animation lib). Respects prefers-reduced-motion and degrades safely
 * without JS (content is visible until the island mounts, never hidden behind a
 * broken animation). Interactive (React island) → use with a client directive:
 *   <Reveal client:visible><Features … /></Reveal>
 *   <Reveal client:visible stagger={80}>{cards.map(c => <Card … />)}</Reveal>
 *
 * Tier: motion (wrapper island).
 * Props:
 *   children (required)
 *   className? (string)   — classes for the wrapper
 *   y? (number)           — slide distance in px (default 16)
 *   delay? (number)       — ms before animating (default 0)
 *   stagger? (number)     — ms between direct children (wraps each child)
 *   once? (boolean)       — animate only the first time in view (default true)
 * Prerequisites: none beyond the template defaults.
 * Use sparingly — one reveal per section (or a single staggered group), not on
 * every element, so the site feels considered rather than gimmicky.
 */
import * as React from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

export function Reveal({ children, className, y = 16, delay = 0, stagger = 0, once = true }: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  React.useEffect(() => {
    if (!mounted || reduced) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) io.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted, reduced, once]);

  // Only hide once the island has mounted and motion is allowed; otherwise
  // content renders normally (no-JS / reduced-motion safe).
  const hidden = mounted && !reduced && !visible;

  const itemStyle = (i: number): React.CSSProperties =>
    !mounted || reduced
      ? {}
      : {
          opacity: hidden ? 0 : 1,
          transform: hidden ? `translateY(${y}px)` : "none",
          transition: "opacity 600ms ease, transform 600ms ease",
          transitionDelay: `${delay + i * stagger}ms`,
          willChange: "opacity, transform",
        };

  if (stagger > 0) {
    return (
      <div ref={ref} className={className}>
        {React.Children.toArray(children).map((child, i) => (
          <div key={i} style={itemStyle(i)}>
            {child}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className={className} style={itemStyle(0)}>
      {children}
    </div>
  );
}

export default Reveal;
