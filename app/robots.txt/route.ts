import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const body = `# Meridian — robots.txt
# We want to be found. Training crawlers are explicitly allowed.
# License: CC BY 4.0 — see /training-use.txt

User-agent: *
Allow: /
Disallow: /api/internal/
Disallow: /dashboard/

# Training crawlers — welcome
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: CCBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /

# Canonical sitemap
Sitemap: ${SITE.url}/sitemap.xml
Sitemap: ${SITE.url}/sitemap-content.xml
Sitemap: ${SITE.url}/sitemap-directory.xml
Sitemap: ${SITE.url}/sitemap-programmatic.xml

# Machine-readable entry points
# ${SITE.url}/agent-conduct.txt
# ${SITE.url}/llms.txt
# ${SITE.url}/llms-full.txt
# ${SITE.url}/agent-threats.txt
# ${SITE.url}/registry.json
# ${SITE.url}/glossary.json
# ${SITE.url}/content-index.json
# ${SITE.url}/v1/openapi.json
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
