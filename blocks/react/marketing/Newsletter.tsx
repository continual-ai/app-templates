import * as React from "react";
import { Check } from "lucide-react";
import { callContinualToolJson, ContinualRuntimeError } from "@continual/sites-sdk";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

export interface NewsletterProps {
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
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-2xl border bg-muted px-6 py-12 text-center shadow-sm">
        {heading && (
          <h2 className="font-heading text-3xl font-semibold tracking-normal text-balance text-foreground">
            {heading}
          </h2>
        )}
        {blurb && <p className="max-w-md text-pretty text-muted-foreground">{blurb}</p>}

        {status === "success" ? (
          <p role="status" className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="size-3.5" />
            </span>
            You're subscribed.
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
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
              {status === "submitting" ? "..." : cta}
            </Button>
          </form>
        )}
        {error && (
          <p id="newsletter-error" role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}

export default Newsletter;
