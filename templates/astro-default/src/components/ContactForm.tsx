import * as React from "react";
import { Check } from "lucide-react";
import { callContinualToolJson, ContinualRuntimeError } from "@continual/sites-sdk";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Status = "idle" | "submitting" | "success" | "error";
type Fields = "name" | "email" | "message";
type Errors = Partial<Record<Fields, string>>;

interface ContactFormProps {
  /**
   * PUBLIC sites: a POST endpoint (e.g. a Formspree / Web3Forms URL). Static
   * sites can't run server code, so the form posts cross-origin to a backend.
   */
  action?: string;
  /**
   * PRIVATE / in-thread preview sites: call a Continual tool instead of posting
   * to an endpoint. The form fields are passed as the tool arguments. Only works
   * where the Continual runtime is available (private/preview). See the
   * create-site skill's "Sites that call Continual APIs" section.
   */
  tool?: { appInstallationId: string; name: string };
  successMessage?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Record<Fields, string>): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) errors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(values.email)) errors.email = "Please enter a valid email.";
  if (!values.message.trim()) errors.message = "Please enter a message.";
  return errors;
}

/**
 * ContactForm — accessible contact-form island with client-side validation,
 * inline aria-correct error states, and two submission paths (third-party
 * endpoint for public sites, Continual tool for private/preview). Use with a
 * client directive:
 *   <ContactForm action="https://formspree.io/f/xxx" client:load />
 *   <ContactForm tool={{ appInstallationId: "appi_…", name: "leads__create" }} client:load />
 */
export function ContactForm({ action, tool, successMessage }: ContactFormProps) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [errors, setErrors] = React.useState<Errors>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  function readValues(form: HTMLFormElement): Record<Fields, string> {
    const data = new FormData(form);
    return {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };
  }

  function validateField(field: Fields) {
    if (!formRef.current) return;
    const fieldErrors = validate(readValues(formRef.current));
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
  }

  async function onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const values = readValues(form);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const first = (["name", "email", "message"] as Fields[]).find((f) => nextErrors[f]);
      (form.elements.namedItem(first ?? "name") as HTMLElement | null)?.focus();
      return;
    }

    setStatus("submitting");
    setFormError(null);
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
          arguments: values,
        });
      } else {
        throw new Error("No submission target: pass an `action` URL or a `tool`.");
      }
      setStatus("success");
      form.reset();
      setErrors({});
    } catch (err) {
      setFormError(
        err instanceof ContinualRuntimeError
          ? "We couldn't reach the server. Please try again."
          : err instanceof Error
            ? err.message
            : "Something went wrong."
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="bg-card flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-sm"
      >
        <span className="bg-primary text-primary-foreground mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full">
          <Check className="size-4" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-foreground text-sm font-medium">
            {successMessage ?? "Thanks — your message has been sent."}
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="text-muted-foreground hover:text-foreground self-start text-sm underline-offset-4 hover:underline"
          >
            Send another
          </button>
        </div>
      </div>
    );
  }

  const fieldError = (field: Fields, label: string, control: React.ReactNode) => (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      {control}
      {errors[field] && (
        <span id={`${field}-error`} role="alert" className="text-destructive text-xs">
          {errors[field]}
        </span>
      )}
    </label>
  );

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="flex w-full max-w-sm flex-col gap-3">
      {fieldError(
        "name",
        "Name",
        <Input
          name="name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          onBlur={() => validateField("name")}
        />
      )}
      {fieldError(
        "email",
        "Email",
        <Input
          type="email"
          name="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          onBlur={() => validateField("email")}
        />
      )}
      {fieldError(
        "message",
        "Message",
        <textarea
          name="message"
          rows={4}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          onBlur={() => validateField("message")}
          className={cn(
            "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-lg border bg-transparent px-2.5 py-1.5 text-base outline-none focus-visible:ring-3 md:text-sm",
            errors.message && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
          )}
        />
      )}
      {formError && (
        <p role="alert" className="text-destructive text-sm">
          {formError}
        </p>
      )}
      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

export default ContactForm;
