import { THREATS, getThreat } from "@/data/threats";
import { apiJson, apiError } from "@/lib/utils";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return THREATS.map((t) => ({ id: t.id }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = getThreat(id);
  if (!t) return apiError("not_found", `Threat '${id}' not found`, 404);
  return apiJson(t);
}
