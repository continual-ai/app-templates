interface Env {
  ASSETS: Fetcher;
  DATABASE?: { connectionString: string };
  DATABASE_URL?: string;
  DATABASE_SCHEMA?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/health") {
      return Response.json({
        ok: true,
        runtime: "cloudflare-worker",
        databaseConfigured: Boolean(env.DATABASE?.connectionString ?? env.DATABASE_URL),
      });
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
