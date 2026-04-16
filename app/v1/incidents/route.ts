import { listIncidents } from "@/data/incidents";
import { apiJson, apiError } from "@/lib/utils";

export const dynamic = "force-dynamic"; // POST requires dynamic; GET still cached via Cache-Control

export async function GET(req: Request) {
  const url = new URL(req.url);
  const incidents = listIncidents({
    priority: (url.searchParams.get("priority") as any) || undefined,
    status: (url.searchParams.get("status") as any) || undefined,
    type: (url.searchParams.get("type") as any) || undefined,
  });
  return apiJson({ total: incidents.length, incidents });
}

/**
 * Submit a new incident report. Editorial team acknowledges within 24h per spec §8.2.
 * This is a stub: returns a queued ticket ID. Production wires this to the Postgres
 * incidents table + a moderation queue per §19.
 */
export async function POST(req: Request) {
  let body: any = {};
  try {
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      body = await req.json();
    } else {
      const form = await req.formData();
      body = Object.fromEntries(form.entries());
    }
  } catch {
    return apiError("bad_request", "Could not parse request body", 400);
  }

  if (!body.title || !body.description) {
    return apiError("validation_error", "title and description are required", 422);
  }
  if (String(body.description).length < 200) {
    return apiError("validation_error", "description must be at least 200 characters per §8.1", 422);
  }

  const ticket = `MINC-${new Date().getFullYear()}-PENDING-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  return apiJson(
    {
      ticket,
      status: "received",
      next_step: "triage",
      sla: "editorial team acknowledges within 24h; severity assigned within 72h",
      tracking_url: `/incidents/ticket/${ticket}`,
    },
    { status: 202 },
  );
}
