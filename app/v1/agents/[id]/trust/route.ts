import { REGISTRY, getEntity } from "@/data/registry";
import { apiJson, apiError } from "@/lib/utils";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return REGISTRY.flatMap((e) => [{ id: e.slug }, { id: e.id }]);
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = getEntity(id);
  if (!e) return apiError("not_found", `Entity '${id}' not found`, 404);
  return apiJson({
    agent_id: e.id,
    slug: e.slug,
    composite: e.trust.composite,
    tier: e.trust.tier,
    tier_label: e.trust.tierLabel,
    dimensions: e.trust.dimensions,
    last_updated: e.trust.lastUpdated,
  });
}
