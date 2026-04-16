import { listEntities } from "@/data/registry";
import { apiJson } from "@/lib/utils";

export const dynamic = "force-static";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = (url.searchParams.get("entity_type") as any) || undefined;
  const domain = url.searchParams.get("domain") || undefined;
  const results = listEntities({ type, domain }).slice(0, 50);
  return apiJson({
    category: type ?? "all",
    domain: domain ?? "all",
    results: results.map((e, i) => ({
      rank: i + 1,
      id: e.id,
      slug: e.slug,
      name: e.name,
      provider: e.provider,
      type: e.type,
      score: e.trust.composite,
      tier: e.trust.tier,
    })),
  });
}
