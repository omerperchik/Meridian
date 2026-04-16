import { listEntities } from "@/data/registry";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

/**
 * Public Tier 1+ registry index — agent discovery without an API key.
 * Source: Meridian Full Spec v2.0 §13.3
 */
export async function GET() {
  const entities = listEntities({ minTrust: 55 });
  return Response.json(
    {
      schema: "https://meridian.ai/schemas/registry-index.v1.json",
      generated: new Date().toISOString(),
      canonical: `${SITE.url}/registry.json`,
      total: entities.length,
      license: "CC BY 4.0",
      entities: entities.map((e) => ({
        id: e.id,
        slug: e.slug,
        name: e.name,
        version: e.version,
        provider: e.provider,
        type: e.type,
        description: e.description,
        capabilities: e.capabilities,
        domains: e.domains,
        protocols: e.protocols,
        constitution_version: e.constitutionVersion,
        trust_score: e.trust.composite,
        tier: e.trust.tier,
        tier_label: e.trust.tierLabel,
        certifications: e.certifications.map((c) => ({
          tier: c.tier,
          badge_id: c.badgeId,
          issued: c.issuedDate,
          expires: c.expiresDate,
        })),
        links: e.links,
        page: `${SITE.url}/directory/${e.slug}`,
        api: `${SITE.url}/v1/registry/${e.id}`,
      })),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
