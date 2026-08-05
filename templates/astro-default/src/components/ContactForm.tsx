import * as React from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";
type Field = "name" | "email" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

interface ContactFormProps {
  /** The id of a project Action that accepts { name, email, message }. */
  actionId: string;
  successMessage?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) errors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(values.email)) errors.email = "Please enter a valid email.";
  if (!values.message.trim()) errors.message = "Please enter a message.";
  return errors;
}

/**
 * Accessible contact form backed by a Continual project Action. Use it as a
 * hydrated island: <ContactForm actionId="captureLead" client:load />.
 */
export function ContactForm({ actionId, successMessage }: ContactFormProps) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [errors, setErrors] = React.useState<Errors>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  function readValues(form: HTMLFormElement): Values {
    const data = new FormData(form);
    return {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };
  }

  function validateField(field: Field) {
    if (!formRef.current) return;
    const fieldErrors = validate(readValues(formRef.current));
    setErrors((previous) => ({ ...previous, [field]: fieldErrors[field] }));
  }

  async function onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = readValues(form);
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const first = (["name", "email", "message"] as Field[]).find((field) => nextErrors[field]);
      (form.elements.namedItem(first ?? "name") as HTMLElement | null)?.focus();
      return;
    }

    setStatus("submitting");
    setFormError(null);
    try {
      const response = await fetch(`/api/actions/${encodeURIComponent(actionId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: values }),
      });
      if (!response.ok) throw new Error(`Request failed (${response.status})`);

      setStatus("success");
      form.reset();
      setErrors({});
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="bg-card flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-sm">
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

  function fieldError(field: Field, label: string, control: React.ReactNode) {
    return (
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
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="flex w-full max-w-sm flex-col gap-3">
      {fieldError(
        "name",
        "Name",
        <Input
          name="name"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
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
          aria-invalid={Boolean(errors.email)}
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
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          onBlur={() => validateField("message")}
          className={cn(
            "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-lg border bg-transparent px-2.5 py-1.5 text-base outline-none focus-visible:ring-3 md:text-sm",
            errors.message && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
          )}
        />
      )}
      {formError && <p role="alert" className="text-destructive text-sm">{formError}</p>}
      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

export default ContactForm;
