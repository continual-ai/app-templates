import type { APIRoute } from "astro";

const robots = (siteUrl: string) => `User-agent: *
Allow: /

Sitemap: ${new URL("sitemap-index.xml", siteUrl).href}
`;

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    return new Response("site URL is not configured", { status: 500 });
  }

  return new Response(robots(site.toString()), {
    headers: { "content-type": "text/plain" },
  });
};
