import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { StatGrid } from "@/components/ui/StatGrid";
import { Badge } from "@/components/ui/Badge";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Trust Report Q1 2026",
  description: "The quarterly state of agent trust: score distributions, failure patterns, threat trends, benchmark shifts.",
  alternates: { canonical: `${SITE.url}/trust-report` },
};

export default function Page() {
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Quarterly research"
        title="The Trust Report — Q1 2026"
        description="Score distributions, failure patterns, threat trends, benchmark shifts. Designed to be cited by press, investors, and academics."
        breadcrumbs={[{ label: "Trust Report" }]}
        meta={<Badge tone="accent">Q1 2026 · Published April 15</Badge>}
      />
      <DirectAnswer>
        In Q1 2026 the Meridian-registered agent economy grew to 2,847 entities. Median composite ATP score across all
        tiers was 68; median at Tier 3 (SDK-integrated) was 87. Prompt injection remains the most common threat category
        (42% of active Critical/High threats). Coordination-failure incidents increased 18% quarter-over-quarter as
        multi-agent deployments scaled.
      </DirectAnswer>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Key numbers</h2>
        <StatGrid
          cols={4}
          stats={[
            { label: "Registered entities", value: "2,847", sublabel: "+18% QoQ", trend: "up", trendValue: "18%" },
            { label: "Median ATP score (all tiers)", value: "68", sublabel: "+3 pts QoQ", trend: "up", trendValue: "4%" },
            { label: "Tier 3 entities", value: "42", sublabel: "SDK-integrated", trend: "up", trendValue: "12" },
            { label: "Incidents ruled", value: "27", sublabel: "Q1 2026", trend: "up", trendValue: "8%" },
          ]}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Threat trends</h2>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { cat: "Prompt injection", pct: "42%", trend: "→ stable" },
            { cat: "Coordination attacks", pct: "18%", trend: "↑ +6% QoQ" },
            { cat: "Supply chain", pct: "12%", trend: "↑ +3% QoQ" },
            { cat: "Agent impersonation", pct: "9%", trend: "↓ -2% QoQ" },
            { cat: "Data exfiltration", pct: "8%", trend: "→ stable" },
            { cat: "Jailbreak / other", pct: "11%", trend: "↓ -2% QoQ" },
          ].map((t) => (
            <Card key={t.cat}>
              <CardBody>
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="font-semibold">{t.cat}</h3>
                  <span className="font-mono text-sm text-text-primary tabular-nums">{t.pct}</span>
                </div>
                <div className="text-xs text-text-tertiary">{t.trend}</div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Research notes</h2>
        <ul className="list-disc list-inside text-text-secondary space-y-2">
          <li>Tier 3 SDK-integrated agents showed 23% fewer UAOP Article 2 (scope) violations than Tier 1 peers.</li>
          <li>MCP servers in the top decile for security score all implement principle-of-least-privilege by default.</li>
          <li>Multi-agent coordination remains the highest-variance benchmark suite.</li>
          <li>Citation rate in LLM answer engines (sampled queries) reached 24% — above Year 1 target.</li>
        </ul>
      </section>
    </div>
  );
}
