import { listEntities } from "@/data/registry";
import { apiJson } from "@/lib/utils";

export const dynamic = "force-static";

/**
 * Recommend entities from a natural-language task description. Ranked by
 * capability-match heuristic + ATP composite.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const task = (url.searchParams.get("task") || "").toLowerCase();
  const minTrust = Number(url.searchParams.get("min_trust")) || 60;
  const type = url.searchParams.get("type") as any;

  const results = listEntities({ minTrust, type })
    .map((e) => {
      let score = e.trust.composite / 100;
      if (task) {
        const hits = e.capabilities.filter((c) => task.includes(c.replace(/-/g, " "))).length;
        const descHit = e.description.toLowerCase().includes(task.split(" ").slice(0, 3).join(" ")) ? 0.15 : 0;
        const domainHit = e.domains.some((d) => task.includes(d)) ? 0.2 : 0;
        score += hits * 0.1 + descHit + domainHit;
      }
      return { entity: e, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return apiJson({
    task,
    recommendations: results.map(({ entity, score }) => ({
      id: entity.id,
      slug: entity.slug,
      name: entity.name,
      type: entity.type,
      trust_score: entity.trust.composite,
      tier: entity.trust.tier,
      match_score: Math.round(score * 100) / 100,
      why: `Matches on ${entity.capabilities.slice(0, 2).join(", ")}; Tier ${entity.trust.tier}`,
    })),
  });
}
