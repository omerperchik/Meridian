import { RULINGS } from "@/data/rulings";
import { apiJson } from "@/lib/utils";

export const dynamic = "force-static";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("search")?.toLowerCase();
  const filtered = q
    ? RULINGS.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.scenario.toLowerCase().includes(q) ||
          r.ruling.toLowerCase().includes(q),
      )
    : RULINGS;
  return apiJson({ total: filtered.length, rulings: filtered });
}
