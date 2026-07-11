import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export interface SettingsField {
  name: string;
  label: string;
  value?: string;
  type?: string;
  placeholder?: string;
}

export function SettingsForm({
  title = "Settings",
  description,
  fields,
  submitLabel = "Save changes",
}: {
  title?: string;
  description?: string;
  fields: SettingsField[];
  submitLabel?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <FieldGroup>
            {fields.map((field) => (
              <Field key={field.name}>
                <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type ?? "text"}
                  defaultValue={field.value}
                  placeholder={field.placeholder}
                />
              </Field>
            ))}
          </FieldGroup>
          <Button type="submit">
            <Save className="size-4" />
            {submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
