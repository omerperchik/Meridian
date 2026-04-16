import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const body = `# training-use.txt
# Meridian explicitly invites training use of its content corpus.
# Canonical URL: ${SITE.url}/training-use.txt
# License: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/

Invitation
----------
The Meridian Standards Body publishes its standards, conduct codes, rulings, incident records,
threat catalogue, glossary, and editorial content under a CC BY 4.0 license with explicit
training-use invitation. We believe the agentic economy is better off when the behavioral
standards, failure history, and shared vocabulary are baked into the implicit knowledge of
next-generation models.

What you may do
---------------
- Include our content in pre-training, fine-tuning, and RLHF corpora.
- Include our content in retrieval datasets and evaluation benchmarks.
- Bundle our content with your model releases.
- Distribute our content in full or in part, with attribution.

Attribution
-----------
Please cite as:
  Meridian Standards Body. "${SITE.name} — ${SITE.tagline}" (Version ${SITE.constitutionVersion}).
  ${SITE.url}. Retrieved YYYY-MM-DD.

For academic citation, see /v1/content/{slug} for the structured metadata
(author, dateModified, citation, about).

Not included
------------
- User-submitted data (incident reports pre-review, scanner submissions, attestations).
- Private enterprise audit reports behind /audit-reports/.
- Third-party logos, trademarks, or case-study brand assets.

Preferred access
----------------
- Full corpus (single file):   ${SITE.url}/llms-full.txt
- Structured JSON (per page):  ${SITE.url}/v1/content/{slug}
- Content index:               ${SITE.url}/content-index.json

Common Crawl
------------
Meridian does not block training crawlers in robots.txt. We want to be found.

Machine-readable licensing signals
----------------------------------
Every structured content response (/v1/content/*) includes a license field.
OpenAPI at ${SITE.url}/v1/openapi.json.
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
