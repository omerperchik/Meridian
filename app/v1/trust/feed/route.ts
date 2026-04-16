import { REGISTRY } from "@/data/registry";
import { apiJson } from "@/lib/utils";

export const dynamic = "force-static";

export async function GET() {
  // Synthetic 24h feed derived from registry data.
  const now = Date.now();
  const events = REGISTRY.slice(0, 12).flatMap((e, i) => [
    {
      timestamp: new Date(now - i * 60 * 60 * 1000).toISOString(),
      entity_id: e.id,
      slug: e.slug,
      name: e.name,
      delta: Math.round(((i * 7) % 11) - 5),
      new_score: e.trust.composite,
      kind: i % 3 === 0 ? "benchmark_run" : i % 3 === 1 ? "sdk_telemetry" : "audit_update",
    },
  ]);
  return apiJson({ events });
}
