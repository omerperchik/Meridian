import { RULINGS } from "@/data/rulings";
import { apiJson } from "@/lib/utils";

export const dynamic = "force-static";

export async function GET() {
  const latest = [...RULINGS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0];
  return apiJson(latest);
}
