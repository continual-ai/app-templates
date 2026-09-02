declare namespace Cloudflare {
  interface Env {
    readonly DATABASE_SCHEMA?: string;
    readonly DATABASE_URL?: string;
  }
}

declare module "cloudflare:workers" {
  export const env: Cloudflare.Env;
}
