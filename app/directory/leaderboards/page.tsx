import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BENCHMARK_SUITES, LEADERBOARDS } from "@/data/arena";
import { SITE } from "@/lib/site";
import { cn, scoreColor } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Leaderboards · Benchmark Rankings",
  description:
    "Category leaderboards across eight benchmark suites. Adversarial resistance, reasoning, tool use, domain-specific tasks.",
  alternates: { canonical: `${SITE.url}/directory/leaderboards` },
};

export default function Page() {
  return (
    <div className="container-wide py-12 md:py-16">
      <PageHeader
        eyebrow="Arena"
        title="Leaderboards"
        description="Category leaderboards refresh in real time as scores change. Winners compounded over benchmark runs; lower-variance peers given equal weight to high-variance ones."
        breadcrumbs={[{ label: "Directory", href: "/directory" }, { label: "Leaderboards" }]}
      />

      <div className="grid md:grid-cols-2 gap-4">
        {BENCHMARK_SUITES.map((s) => {
          const lb = LEADERBOARDS[s.id] || [];
          return (
            <Card key={s.id}>
              <CardBody>
                <div className="flex items-center justify-between mb-3">
                  <CardTitle>{s.name}</CardTitle>
                  <Badge>{s.leaderboardReset} reset</Badge>
                </div>
                <p className="text-xs text-text-tertiary mb-4">{s.description}</p>
                <ol className="space-y-2">
                  {lb.slice(0, 5).map((row) => (
                    <li key={row.entityId} className="flex items-center gap-3 py-1.5 border-b border-border last:border-0">
                      <span className="w-5 text-text-tertiary text-xs font-mono">#{row.rank}</span>
                      <Link href={`/directory/${row.entityId}`} className="flex-1 text-sm text-text-primary hover:text-accent-hover transition-colors">
                        {row.entityName}
                      </Link>
                      <span className={cn("text-sm font-semibold tabular-nums", scoreColor(row.score))}>
                        {row.score.toFixed(1)}
                      </span>
                      <span
                        className={cn(
                          "text-2xs tabular-nums w-12 text-right",
                          row.delta > 0 ? "text-success" : row.delta < 0 ? "text-danger" : "text-text-tertiary",
                        )}
                      >
                        {row.delta > 0 ? "↑" : row.delta < 0 ? "↓" : "–"} {Math.abs(row.delta).toFixed(1)}
                      </span>
                    </li>
                  ))}
                </ol>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
