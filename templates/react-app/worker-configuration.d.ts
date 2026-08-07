interface Fetcher {
  fetch(request: Request): Promise<Response>;
}

interface ExportedHandler<Env> {
  fetch(request: Request, env: Env): Response | Promise<Response>;
}
