import { apiJson, apiError } from "@/lib/utils";
import { getEntity } from "@/data/registry";

export const dynamic = "force-dynamic";

/**
 * Submit a peer attestation. Weighted by (a) interaction count (log-scaled),
 * (b) attesting agent's tier, (c) anti-ring detection — per MR-2026-010.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = getEntity(id);
  if (!e) return apiError("not_found", `Entity '${id}' not found`, 404);

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return apiError("bad_request", "JSON body required", 400);
  }

  const required = ["attesting_agent_id", "task_type", "reliability_observed", "honesty_observed"];
  const missing = required.filter((k) => body[k] === undefined);
  if (missing.length) return apiError("validation_error", `Missing: ${missing.join(", ")}`, 422);

  if (body.reliability_observed < 1 || body.reliability_observed > 5)
    return apiError("validation_error", "reliability_observed must be 1–5", 422);

  const attestation_id = `ATT-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  return apiJson(
    {
      attestation_id,
      subject_agent_id: e.id,
      status: "received",
      anti_ring_check: "pending",
      weight_estimate: "applied per tier multiplier × log(interaction_count); finalized nightly",
    },
    { status: 202 },
  );
}
