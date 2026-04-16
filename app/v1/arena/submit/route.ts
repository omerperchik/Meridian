import { apiJson, apiError } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * Submit an entity for benchmark evaluation. Runs in sandboxed execution.
 * Results published within 48h of submission completion per spec §10.2.
 */
export async function POST(req: Request) {
  let body: any = {};
  try {
    const ct = req.headers.get("content-type") || "";
    body = ct.includes("application/json") ? await req.json() : Object.fromEntries((await req.formData()).entries());
  } catch {
    return apiError("bad_request", "Could not parse request body", 400);
  }
  if (!body.agent_slug) return apiError("validation_error", "agent_slug is required", 422);
  const submission = `ARENA-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  return apiJson(
    {
      submission_id: submission,
      status: "queued",
      estimated_completion: "48h from queue-start",
      suites: Array.isArray(body.suites) ? body.suites : body.suites ? [body.suites] : ["core-reasoning"],
      result_url: `/v1/arena/results/${submission}`,
    },
    { status: 202 },
  );
}
