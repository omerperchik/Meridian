import { apiJson, apiError } from "@/lib/utils";
import { getEntity } from "@/data/registry";

export const dynamic = "force-dynamic";

/**
 * Compare 2–5 entities across all dimensions.
 * Body: { entities: ["slug-a", "slug-b", ...] }
 */
export async function POST(req: Request) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return apiError("bad_request", "JSON body required", 400);
  }
  const slugs: string[] = Array.isArray(body.entities) ? body.entities : [];
  if (slugs.length < 2 || slugs.length > 5)
    return apiError("validation_error", "entities: 2–5 required", 422);

  const resolved = slugs.map((s) => getEntity(s)).filter(Boolean);
  if (resolved.length !== slugs.length) return apiError("not_found", "One or more entities not found", 404);

  const dims = resolved[0]!.trust.dimensions.map((d) => d.name);
  const matrix = dims.map((name) => ({
    dimension: name,
    values: resolved.map((e) => ({
      entity: e!.slug,
      value: e!.trust.dimensions.find((d) => d.name === name)!.value,
    })),
  }));

  return apiJson({
    entities: resolved.map((e) => ({
      id: e!.id,
      slug: e!.slug,
      name: e!.name,
      type: e!.type,
      composite: e!.trust.composite,
      tier: e!.trust.tier,
    })),
    dimensions: matrix,
    winner_composite: resolved.reduce((a, b) => (a!.trust.composite >= b!.trust.composite ? a : b))!.slug,
  });
}
