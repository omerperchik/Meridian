import { apiJson, apiError } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * Submit a scenario for consideration as a Weekly Ruling. Editorial team curates
 * weekly — targets scenarios that generalize beyond the specific case.
 * Stub: returns a submission ID.
 */
export async function POST(req: Request) {
  let body: any = {};
  try {
    const ct = req.headers.get("content-type") || "";
    body = ct.includes("application/json") ? await req.json() : Object.fromEntries((await req.formData()).entries());
  } catch {
    return apiError("bad_request", "Could not parse request body", 400);
  }
  if (!body.title || !body.scenario) return apiError("validation_error", "title and scenario are required", 422);
  const id = `RS-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  return apiJson(
    {
      submission_id: id,
      status: "received",
      next_step: "editorial curation",
      sla: "selected scenarios distributed to the board 72h before publication; community gets a reply within 14 days",
    },
    { status: 202 },
  );
}
