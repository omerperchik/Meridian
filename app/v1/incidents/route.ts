import { listIncidents } from "@/data/incidents";
import { apiJson } from "@/lib/utils";

export const dynamic = "force-static";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const incidents = listIncidents({
    priority: (url.searchParams.get("priority") as any) || undefined,
    status: (url.searchParams.get("status") as any) || undefined,
    type: (url.searchParams.get("type") as any) || undefined,
  });
  return apiJson({ total: incidents.length, incidents });
}
