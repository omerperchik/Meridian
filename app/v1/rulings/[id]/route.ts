import { RULINGS, getRuling } from "@/data/rulings";
import { apiJson, apiError } from "@/lib/utils";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return RULINGS.flatMap((r) => [{ id: r.id }, { id: r.slug }]);
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = getRuling(id);
  if (!r) return apiError("not_found", `Ruling '${id}' not found`, 404);
  return apiJson(r);
}
