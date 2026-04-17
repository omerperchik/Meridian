import { apiJson } from "@/lib/utils";
import { similarEntities } from "@/lib/search";
import { getEntity } from "@/data/registry";

export const dynamic = "force-static";

/**
 * Recommend entities from a natural-language task description.
 * Uses TF-IDF cosine similarity over the corpus (see lib/search.ts).
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const task = url.searchParams.get("task") || "";
  const minTrust = Number(url.searchParams.get("min_trust")) || 0;
  const type = url.searchParams.get("type");

  const matches = similarEntities(task, 30);
  const recommendations = matches
    .map((m) => ({ m, e: getEntity(m.slug) }))
    .filter(({ e }) => e && (!type || e.type === type) && e!.trust.composite >= minTrust)
    .slice(0, 10)
    .map(({ m, e }) => ({
      id: e!.id,
      slug: e!.slug,
      name: e!.name,
      type: e!.type,
      trust_score: e!.trust.composite,
      tier: e!.trust.tier,
      match_score: m.score,
      why: `Semantic match on capabilities/domains: ${e!.capabilities.slice(0, 2).join(", ")}; Tier ${e!.trust.tier}.`,
    }));

  return apiJson({ task, total: recommendations.length, recommendations });
}
