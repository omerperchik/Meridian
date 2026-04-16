import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { REGISTRY } from "@/data/registry";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Compare AI agents, MCP servers, tools, frameworks",
  description: "Head-to-head ATP trust score comparisons between registered entities.",
  alternates: { canonical: `${SITE.url}/compare` },
};

export default function Page() {
  // Surface the top pairwise comparisons (first 20 pairs of the top entities).
  const byScore = [...REGISTRY].sort((a, b) => b.trust.composite - a.trust.composite);
  const featured: Array<[typeof byScore[0], typeof byScore[0]]> = [];
  for (let i = 0; i < byScore.length && featured.length < 24; i++) {
    for (let j = i + 1; j < byScore.length && featured.length < 24; j++) {
      if (byScore[i].type === byScore[j].type) featured.push([byScore[i], byScore[j]]);
    }
  }

  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Programmatic"
        title="Compare"
        description="Head-to-head ATP comparisons. Every same-type pair generates a dedicated page."
        breadcrumbs={[{ label: "Compare" }]}
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {featured.map(([a, b]) => (
          <Link
            key={`${a.slug}-${b.slug}`}
            href={`/compare/${a.slug}-vs-${b.slug}`}
            className="rounded-lg border border-border bg-surface p-4 hover:bg-surface-hover hover:border-border-strong transition-all"
          >
            <div className="text-xs text-text-tertiary mb-1 uppercase">{a.type}s</div>
            <div className="font-medium text-text-primary">
              {a.name} <span className="text-text-quaternary">vs</span> {b.name}
            </div>
            <div className="text-xs text-text-tertiary mt-1 tabular-nums">
              {Math.round(a.trust.composite)} vs {Math.round(b.trust.composite)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
