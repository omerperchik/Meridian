import { INCIDENTS, getIncident } from "@/data/incidents";
import { apiJson, apiError } from "@/lib/utils";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return INCIDENTS.flatMap((i) => [{ id: i.id }, { id: i.slug }]);
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const i = getIncident(id);
  if (!i) return apiError("not_found", `Incident '${id}' not found`, 404);
  return apiJson(i);
}
