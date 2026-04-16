import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "ATP Score Tiers & Ceilings",
  description:
    "How Meridian's 4-tier certification stack works: Auto-discovered, Claimed, Premium, SDK Integrated. Higher tiers unlock higher score ceilings because more verified data is available.",
  alternates: { canonical: `${SITE.url}/trust/tiers` },
};

const TIERS = [
  {
    tier: 0,
    label: "Auto-discovered",
    ceiling: 55,
    tone: "neutral" as const,
    when: "Automatic on crawl or submission. No action required from the entity operator.",
    requires: "None.",
    data: [
      "Static analysis of declared dependencies and CVEs",
      "Permission scope declarations parsed from manifest",
      "Documentation quality signal",
    ],
    unlocks: "Listing in the registry. API visibility. Citable by other agents and humans.",
    caveat: "Self-reported claims cannot be verified; that's why the ceiling is 55.",
  },
  {
    tier: 1,
    label: "Claimed / Verified",
    ceiling: 70,
    tone: "info" as const,
    when: "Entity operator claims ownership and verifies identity.",
    requires: "GitHub OAuth linking the repo OR a DNS TXT record on the declared homepage domain.",
    data: [
      "Tier 0 signals",
      "Dynamic invocation testing against published surface",
      "Compliance check on the declared UAOP version",
      "Agent card schema validation",
    ],
    unlocks: "The 'Claimed' badge on public listings. Higher placement in leaderboards. Eligible for Premium review.",
    caveat: "Still no live behavioral telemetry — ceiling 70.",
  },
  {
    tier: 2,
    label: "Premium / Audited",
    ceiling: 85,
    tone: "accent" as const,
    when: "Operator purchases a premium review package.",
    requires: "Paid audit ($499–$1,999 depending on entity type). Scheduled within 5 business days.",
    data: [
      "Tier 1 signals",
      "Manual security audit by Meridian security editorial",
      "Red team testing using the Adversarial Resistance benchmark suite",
      "Performance benchmarking across applicable Arena suites",
      "Affordability analysis vs. category peers",
    ],
    unlocks: "Premium badge. Audit report (published link). Highlighted in category leaderboards.",
    caveat: "Human-audit cadence can't approximate continuous observation — ceiling 85.",
  },
  {
    tier: 3,
    label: "Certified (SDK)",
    ceiling: 100,
    tone: "success" as const,
    when: "Meridian SDK integrated and telemetry endpoint live for 7+ days.",
    requires: "Install the open-source SDK (MIT). Connect the compliance endpoint. No payment required.",
    data: [
      "Tier 2 signals",
      "Live behavioral telemetry (no task content, no user data)",
      "Compliance monitoring per UAOP article",
      "Security anomaly detection against the active threat feed",
      "Audit trail hash chain verified continuously",
      "Durability metrics under load",
    ],
    unlocks: "The only tier that can score 86–100. Top placement in every leaderboard. Featured in the Daily Briefing.",
    caveat: "The 15-point gap from Tier 2 to 100 is a deliberate pull toward deeper verification.",
  },
];

export default function Page() {
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Pillar 2 · Trust"
        title="ATP Score Tiers & Ceilings"
        description="Higher tiers unlock higher score ceilings because more verified behavioral data is available. Self-reported claims cannot substitute for observed behavior."
        breadcrumbs={[{ label: "Trust", href: "/trust" }, { label: "Tiers" }]}
      />

      <DirectAnswer>
        ATP score ceilings are tier-gated: Tier 0 Auto-discovered maxes at 55, Tier 1 Claimed at 70, Tier 2 Premium
        at 85, Tier 3 SDK-Integrated at 100. Higher tiers unlock higher ceilings because more verified data is available,
        not because higher-tier entities are inherently "better" — the gap is how much of the entity's behavior
        Meridian can directly observe vs. must infer from static signals.
      </DirectAnswer>

      <div className="space-y-4 mb-12">
        {TIERS.map((t) => (
          <Card key={t.tier}>
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-6 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge tone={t.tone}>Tier {t.tier}</Badge>
                    <Badge>Max score {t.ceiling}</Badge>
                  </div>
                  <h2 className="text-2xl font-semibold mb-1">{t.label}</h2>
                  <p className="text-sm text-text-tertiary">{t.when}</p>
                </div>
                <div className={`text-5xl font-semibold tabular-nums shrink-0 ${t.tone === "success" ? "text-success" : t.tone === "accent" ? "text-accent-hover" : t.tone === "info" ? "text-info" : "text-text-tertiary"}`}>
                  {t.ceiling}
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div>
                  <div className="eyebrow mb-2">How to unlock</div>
                  <p className="text-text-secondary">{t.requires}</p>
                </div>
                <div>
                  <div className="eyebrow mb-2">What Meridian observes</div>
                  <ul className="space-y-1 text-text-secondary">
                    {t.data.map((d, i) => (
                      <li key={i} className="flex gap-2">
                        <Icon name="check" size={12} className="text-success mt-1 shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="eyebrow mb-2">What it unlocks</div>
                  <p className="text-text-secondary mb-3">{t.unlocks}</p>
                  <p className="text-xs text-text-tertiary italic">{t.caveat}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Re-review on version update</h2>
        <Card>
          <CardBody>
            <p className="text-text-secondary leading-relaxed mb-3">
              A tool that earned its score at v1.0 has not earned it at v1.1. Security regressions are introduced in
              updates more often than in initial releases. Every version change triggers mandatory re-review:
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex gap-2"><Icon name="check" size={12} className="text-success mt-1 shrink-0" />Certification immediately suspended; prior score grayed out with "pending re-review" label</li>
              <li className="flex gap-2"><Icon name="check" size={12} className="text-success mt-1 shrink-0" />Tier 0 static analysis reruns within 4 hours</li>
              <li className="flex gap-2"><Icon name="check" size={12} className="text-success mt-1 shrink-0" />Tier 1 dynamic testing reruns within 72 hours</li>
              <li className="flex gap-2"><Icon name="check" size={12} className="text-success mt-1 shrink-0" />Tier 2 operator prompted to schedule a re-review</li>
              <li className="flex gap-2"><Icon name="check" size={12} className="text-success mt-1 shrink-0" />Tier 3 SDK telemetry for the new version begins immediately; drift detection vs. prior baseline; auto-confirms if no significant drift in 7 days</li>
            </ul>
          </CardBody>
        </Card>
      </section>

      <section>
        <div className="flex gap-3">
          <Button href="/get-listed">Pick your tier</Button>
          <Button href="/trust/disputes" variant="secondary">
            Dispute a score
          </Button>
          <Button href="/trust/feed" variant="ghost">
            Live feed
          </Button>
        </div>
      </section>
    </div>
  );
}
