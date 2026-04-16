import { CONDUCT_CODES, getConductCode } from "@/data/conduct-codes";
import { apiJson, apiError } from "@/lib/utils";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return CONDUCT_CODES.map((c) => ({ domain: c.domain }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const code = getConductCode(domain);
  if (!code) return apiError("not_found", `Conduct code for domain '${domain}' not found`, 404);
  return apiJson(code);
}
