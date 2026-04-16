import { GLOSSARY, getTerm } from "@/data/glossary";
import { apiJson, apiError } from "@/lib/utils";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return GLOSSARY.map((t) => ({ term: t.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ term: string }> }) {
  const { term } = await params;
  const t = getTerm(term);
  if (!t) return apiError("not_found", `Term '${term}' not found`, 404);
  return apiJson(t);
}
