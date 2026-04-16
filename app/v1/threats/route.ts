import { listThreats } from "@/data/threats";
import { apiJson } from "@/lib/utils";

export const dynamic = "force-static";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const threats = listThreats({
    severity: (url.searchParams.get("severity") as any) || undefined,
    status: (url.searchParams.get("status") as any) || undefined,
    category: (url.searchParams.get("category") as any) || undefined,
  });
  return apiJson({ total: threats.length, threats });
}
