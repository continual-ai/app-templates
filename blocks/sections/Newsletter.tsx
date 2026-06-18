/**
 * Newsletter — email-capture section (heading + inline email form). Reuses the
 * ContactForm submission pattern: client-side validation, aria error state, and
 * two submission paths. Interactive (React island) → use with a client directive:
 *   <Newsletter action="https://formspree.io/f/xxx" client:visible heading="Stay in the loop" />
 *
 * Tier: block / section (island).
 * Props:
 *   action? (string)        — POST endpoint for public sites
 *   tool? ({ appInstallationId, name }) — Continual tool for private/preview sites
 *   heading? (string)
 *   blurb? (string)
 *   cta? (string)           — button label (default "Subscribe")
 * Prerequisites: @/components/ui/button, @/components/ui/input, @/lib/utils,
 *   lucide-react, @continual/sites-sdk (all ship with the template).
 */
import * as React from "react";
import { Check } from "lucide-react";
import { callContinualToolJson, ContinualRuntimeError } from "@continual/sites-sdk";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Status = "idle" | "submitting" | "success" | "error";

interface NewsletterProps {
  action?: string;
  tool?: { appInstallationId: string; name: string };
  heading?: string;
  blurb?: string;
  cta?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Newsletter({ action, tool, heading, blurb, cta = "Subscribe" }: NewsletterProps) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");
    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email.");
      (form.elements.namedItem("email") as HTMLElement | null)?.focus();
      return;
    }
    setStatus("submitting");
    setError(null);
    try {
      if (action) {
        const res = await fetch(action, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
      } else if (tool) {
        await callContinualToolJson({
          appInstallationId: tool.appInstallationId,
          name: tool.name,
          arguments: { email },
        });
      } else {
        throw new Error("No submission target: pass an `action` URL or a `tool`.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setError(
        err instanceof ContinualRuntimeError
          ? "We couldn't reach the server. Please try again."
          : err instanceof Error
            ? err.message
            : "Something went wrong."
      );
      setStatus("error");
    }
  }

  return (
    <section className="px-6 py-20">
      <div className="bg-muted mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-2xl border px-6 py-12 text-center shadow-sm">
        {heading && (
          <h2 className="text-foreground font-heading text-3xl font-semibold tracking-tight text-balance">
            {heading}
          </h2>
        )}
        {blurb && <p className="text-muted-foreground max-w-md text-pretty">{blurb}</p>}

        {status === "success" ? (
          <p role="status" className="text-foreground inline-flex items-center gap-2 text-sm font-medium">
            <span className="bg-primary text-primary-foreground inline-flex size-5 items-center justify-center rounded-full">
              <Check className="size-3.5" />
            </span>
            You're subscribed.
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
          >
            <Input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              aria-label="Email address"
              aria-invalid={!!error}
              aria-describedby={error ? "newsletter-error" : undefined}
              className={cn("flex-1", error && "border-destructive focus-visible:ring-destructive/20")}
            />
            <Button type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "…" : cta}
            </Button>
          </form>
        )}
        {error && (
          <p id="newsletter-error" role="alert" className="text-destructive text-sm">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}

export default Newsletter;
