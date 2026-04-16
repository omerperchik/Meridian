import { REGISTRY, getEntity } from "@/data/registry";
import { apiJson, apiError } from "@/lib/utils";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return REGISTRY.flatMap((e) => [{ id: e.slug }, { id: e.id }]);
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = getEntity(id);
  if (!e) return apiError("not_found", `Entity '${id}' not found`, 404);
  return apiJson(e);
}
