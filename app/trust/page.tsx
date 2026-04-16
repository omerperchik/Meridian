import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ScoreRing, DimensionBar } from "@/components/ui/ScoreRing";
import { Icon } from "@/components/ui/Icon";
import { REGISTRY } from "@/data/registry";
import { SITE } from "@/lib/site";
import { cn, scoreColor } from "@/lib/utils";

export const metadata: Metadata = {
  title: "ATP — Agent Trust Protocol",
  description:
    "The Agent Trust Protocol (ATP) is a 0–100 composite trust score for every registered AI agent. Five weighted dimensions. Tier-gated score ceilings. Updated continuously from verified behavioral data.",
  alternates: { canonical: `${SITE.url}/trust` },
};

const DIMENSIONS = [
  {
    name: "Security",
    weight: 30,
    description: "CVE exposure, injection resistance, permission scope compliance, sandboxing, audit results.",
  },
  {
    name: "Compliance",
    weight: 25,
    description: "UAOP coverage, conduct code adherence, disclosure practices, data minimization, SDK signals.",
  },
  {
    name: "Performance",
    weight: 20,
    description: "Arena benchmark results, latency p50/p95, task completion rate, accuracy.",
  },
  {
    name: "Reliability",
    weight: 15,
    description: "Uptime, error rate, graceful degradation, incident history, response consistency under load.",
  },
  {
    name: "Affordability",
    weight: 10,
    description: "Cost per standardized task vs. category peers, pricing transparency, efficiency index.",
  },
];

const TIERS = [
  { tier: 0, label: "Auto-discovered", max: 55, req: "None — automatic on crawl or submission", data: "Static analysis only" },
  { tier: 1, label: "Claimed / Verified", max: 70, req: "Identity via GitHub OAuth or DNS TXT", data: "Tier 0 + dynamic invocation tests" },
  { tier: 2, label: "Premium / Audited", max: 85, req: "Paid premium review", data: "Tier 1 + red team + benchmarks" },
  { tier: 3, label: "SDK Integrated", max: 100, req: "Meridian SDK + telemetry endpoint", data: "Tier 2 + live telemetry + drift detection" },
];

export default function TrustPage() {
  const sample = REGISTRY[0];
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Pillar 2"
        title="Agent Trust Protocol"
        description="Live, multi-dimensional trust scores for every registered entity — updated continuously from verified behavioral data, not self-reported claims."
        breadcrumbs={[{ label: "Trust" }]}
        meta={
          <>
            <Badge tone="accent" dot>v{SITE.atpVersion}</Badge>
            <Badge tone="success">Open source scoring</Badge>
          </>
        }
        actions={
          <Button href="/trust/feed" variant="secondary">
            <Icon name="activity" size={13} /> Live feed
          </Button>
        }
      />

      <DirectAnswer>
        ATP is a 0–100 composite score for every registered AI agent, MCP server, tool, and framework. Five weighted dimensions:
        Security (30%), Compliance (25%), Performance (20%), Reliability (15%), Affordability (10%). Score ceilings are
        determined by certification tier — self-reported data cannot substitute for observed behavior.
      </DirectAnswer>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">The five dimensions</h2>
        <div className="grid md:grid-cols-5 gap-3">
          {DIMENSIONS.map((d) => (
            <Card key={d.name}>
              <CardBody>
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-semibold">{d.name}</h3>
                  <span className="font-mono text-xs text-accent-hover">{d.weight}%</span>
                </div>
                <p className="text-xs text-text-tertiary leading-relaxed">{d.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Tier ceilings</h2>
        <div className="grid md:grid-cols-4 gap-3">
          {TIERS.map((t) => (
            <Card key={t.tier}>
              <CardBody>
                <div className="flex items-baseline justify-between mb-3">
                  <Badge tone={t.tier >= 3 ? "success" : t.tier === 2 ? "accent" : t.tier === 1 ? "info" : "neutral"}>
                    Tier {t.tier}
                  </Badge>
                  <span className={cn("font-semibold tabular-nums", scoreColor(t.max))}>max {t.max}</span>
                </div>
                <h3 className="font-semibold mb-1">{t.label}</h3>
                <p className="text-xs text-text-tertiary mb-3">{t.req}</p>
                <p className="text-xs text-text-secondary leading-relaxed">{t.data}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Example: live score</h2>
        <Card>
          <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
            <div>
              <div className="eyebrow mb-2">{sample.name}</div>
              <div className="text-sm text-text-tertiary mb-4">{sample.provider} · Tier {sample.trust.tier} · v{sample.version}</div>
              <div className="flex items-center gap-6 mb-4">
                <ScoreRing score={sample.trust.composite} size={96} strokeWidth={7} label="ATP" />
                <div>
                  <div className="eyebrow mb-1">Composite</div>
                  <div className={cn("text-4xl font-semibold tabular-nums", scoreColor(sample.trust.composite))}>
                    {sample.trust.composite.toFixed(1)}
                  </div>
                </div>
              </div>
              <Button href={`/directory/${sample.slug}`} variant="secondary" size="sm">
                View full profile <Icon name="arrow-right" size={12} />
              </Button>
            </div>
            <div className="space-y-3">
              {sample.trust.dimensions.map((d) => (
                <DimensionBar key={d.name} label={d.label} value={d.value} weight={`${d.weight}%`} />
              ))}
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
