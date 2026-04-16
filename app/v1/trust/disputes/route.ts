import { apiJson, apiError } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: any = {};
  try {
    const ct = req.headers.get("content-type") || "";
    body = ct.includes("application/json") ? await req.json() : Object.fromEntries((await req.formData()).entries());
  } catch {
    return apiError("bad_request", "Could not parse request body", 400);
  }
  if (!body.entity || !body.evidence) return apiError("validation_error", "entity and evidence are required", 422);
  if (String(body.evidence).length < 200)
    return apiError("validation_error", "evidence must be at least 200 characters", 422);
  const id = `DISP-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  return apiJson(
    {
      dispute_id: id,
      status: "received",
      panel_draw: "pending",
      sla: "A 3-member arbitration panel reviews within 14 days. Decision published on the entity record.",
    },
    { status: 202 },
  );
}
