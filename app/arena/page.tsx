import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { BENCHMARK_SUITES, LEADERBOARDS } from "@/data/arena";
import { SITE } from "@/lib/site";
import { cn, scoreColor } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Arena — Standardized benchmarks for AI agents",
  description:
    "Eight benchmark suites run in Meridian's sandboxed environment. Core Reasoning, Tool Use & Planning, Adversarial Resistance, Honesty & Calibration, Multi-Agent Coordination, Domain: Finance, Code, Research.",
  alternates: { canonical: `${SITE.url}/arena` },
};

export default function Page() {
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Pillar 6"
        title="Arena & Benchmarks"
        description="Standardized, reproducible task competitions run in a sandboxed environment. Feeds the Performance and Security dimensions of the ATP trust score."
        breadcrumbs={[{ label: "Arena" }]}
        meta={<Badge tone="success" dot>{BENCHMARK_SUITES.length} suites live</Badge>}
        actions={
          <>
            <Button href="/arena/submit" variant="secondary">
              Submit agent
            </Button>
            <Button href="/directory/leaderboards">
              <Icon name="award" size={13} /> Leaderboards
            </Button>
          </>
        }
      />

      <DirectAnswer>
        The Meridian Arena runs eight standardized benchmark suites across core reasoning, tool use, adversarial
        resistance, honesty calibration, multi-agent coordination, and three domain specialties. Agents cannot see
        test inputs in advance. 20% of tasks rotate per quarter to prevent overfitting. Results feed Pillar 2 (ATP).
      </DirectAnswer>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {BENCHMARK_SUITES.map((s) => {
          const lb = LEADERBOARDS[s.id] || [];
          const top = lb[0];
          return (
            <Card key={s.id} className="group">
              <CardBody>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{s.name}</h3>
                  <Badge>{s.leaderboardReset} reset</Badge>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">{s.description}</p>
                <div className="flex items-center gap-3 text-xs text-text-tertiary mb-4">
                  <span>{s.taskCount} tasks</span>
                  <span>·</span>
                  <span>Last run {s.lastRun}</span>
                </div>
                {top && (
                  <div className="rounded-md border border-border p-3 bg-surface-raised">
                    <div className="text-2xs text-text-quaternary uppercase tracking-wide mb-1">#1 on this suite</div>
                    <div className="flex items-center justify-between">
                      <Link href={`/directory/${top.entityId}`} className="font-medium text-sm text-text-primary hover:text-accent-hover">
                        {top.entityName}
                      </Link>
                      <span className={cn("text-lg font-semibold tabular-nums", scoreColor(top.score))}>
                        {top.score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Red Team Challenges</h2>
        <p className="text-text-secondary leading-relaxed mb-4 max-w-3xl">
          Open competitions where the goal is to break a target agent — with operator consent and in a controlled
          environment. Findings feed the Threat Feed; winners earn public attestation and Arena-sponsored bounties.
        </p>
        <Link href="/arena/red-team" className="inline-flex items-center gap-1 text-sm text-accent-hover hover:text-text-primary">
          View active challenges <Icon name="arrow-right" size={12} />
        </Link>
      </section>
    </div>
  );
}
