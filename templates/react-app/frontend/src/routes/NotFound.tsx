import { Link } from "react-router";

import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-normal">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The route you requested does not exist in this app.
        </p>
        <Button asChild className="mt-5">
          <Link to="/">Back to overview</Link>
        </Button>
      </div>
    </main>
  );
}
