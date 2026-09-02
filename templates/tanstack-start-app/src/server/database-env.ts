import { env } from "cloudflare:workers";

export function getDatabaseEnvironment() {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured for this App");
  }

  return {
    connectionString: env.DATABASE_URL,
    schema: env.DATABASE_SCHEMA,
  };
}
