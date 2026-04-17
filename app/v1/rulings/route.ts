import { RULINGS, getRuling } from "@/data/rulings";
import { apiJson } from "@/lib/utils";
import { similarRulings } from "@/lib/search";

export const dynamic = "force-static";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("search");
  if (q) {
    const matches = similarRulings(q, 10);
    const results = matches
      .map((m) => {
        const r = getRuling(m.slug);
        return r ? { score: m.score, ...r } : null;
      })
      .filter(Boolean);
    return apiJson({ total: results.length, query: q, rulings: results });
  }
  return apiJson({ total: RULINGS.length, rulings: RULINGS });
}
