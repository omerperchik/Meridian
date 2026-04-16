import { listEntities } from "@/data/registry";
import { apiJson } from "@/lib/utils";

export const dynamic = "force-static";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const results = listEntities({
    type: (url.searchParams.get("type") as any) || undefined,
    minTrust: Number(url.searchParams.get("min_trust")) || undefined,
    domain: url.searchParams.get("domain") || undefined,
    protocol: url.searchParams.get("protocol") || undefined,
    capability: url.searchParams.get("capability") || undefined,
  });
  return apiJson({
    total: results.length,
    results: results.map((e) => ({
      id: e.id,
      slug: e.slug,
      name: e.name,
      type: e.type,
      provider: e.provider,
      trust_score: e.trust.composite,
      tier: e.trust.tier,
      capabilities: e.capabilities,
      domains: e.domains,
      protocols: e.protocols,
      url: `/directory/${e.slug}`,
    })),
  });
}
