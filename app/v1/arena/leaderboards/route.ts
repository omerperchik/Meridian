import { BENCHMARK_SUITES, LEADERBOARDS } from "@/data/arena";
import { apiJson } from "@/lib/utils";

export const dynamic = "force-static";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const suite = url.searchParams.get("suite");
  if (suite) {
    const s = BENCHMARK_SUITES.find((b) => b.id === suite);
    return apiJson({ suite: s, leaderboard: LEADERBOARDS[suite] || [] });
  }
  return apiJson({
    suites: BENCHMARK_SUITES,
    leaderboards: LEADERBOARDS,
  });
}
