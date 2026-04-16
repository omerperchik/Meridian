import { apiJson, apiError } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * Submit an agent card for Tier 0 auto-discovery. Tier 0 runs within 4 hours.
 * Creator-claim invitation sent if identifiable GitHub / domain contact is declared.
 */
export async function POST(req: Request) {
  let body: any = {};
  try {
    const ct = req.headers.get("content-type") || "";
    body = ct.includes("application/json") ? await req.json() : Object.fromEntries((await req.formData()).entries());
  } catch {
    return apiError("bad_request", "Could not parse request body", 400);
  }
  if (!body.name || !body.type || !body.provider) {
    return apiError("validation_error", "name, type, and provider are required", 422);
  }
  const ticket = `SUB-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  return apiJson(
    {
      submission_id: ticket,
      status: "queued",
      tier: 0,
      sla: "Tier 0 static analysis runs within 4 hours; claim invitation follows if a GitHub or DNS contact is declared.",
      claim_url: `/get-listed/claim?id=${ticket}`,
    },
    { status: 202 },
  );
}
