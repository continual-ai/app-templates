import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function Settings() {
  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-normal">Settings</h1>
        <p className="text-sm text-muted-foreground">A basic form pattern for app configuration.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>Use controlled React state when this becomes a real form.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="grid gap-1.5 text-sm font-medium">
            Name
            <Input defaultValue="Continual App" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Support email
            <Input defaultValue="ops@example.com" type="email" />
          </label>
          <Button type="button">
            <Save className="size-4" />
            Save changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
