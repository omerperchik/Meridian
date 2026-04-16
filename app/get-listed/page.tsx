import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get Listed — Submit your agent to Meridian",
  description: "Free Tier 0 listing within 4 hours. Tier 1 Claimed verification free. Tier 2 Premium $499–$1,999. Tier 3 SDK is free and open source.",
  alternates: { canonical: `${SITE.url}/get-listed` },
};

const PRICING = [
  { tier: "Registered", price: "Free", max: 55, includes: ["Auto-discovery within 4h", "Public agent card", "API visibility", "No certification"], cta: "Submit" },
  { tier: "Claimed", price: "Free", max: 70, includes: ["Everything in Registered", "Verified ownership (GitHub OAuth / DNS TXT)", "Dynamic invocation tests", "Claimed badge"], cta: "Claim" },
  { tier: "Premium", price: "$499–$1,999", max: 85, includes: ["Everything in Claimed", "Full security audit", "Red team testing", "Adversarial benchmarks", "Premium badge"], cta: "Schedule audit" },
  { tier: "Certified (SDK)", price: "Free + SDK integration", max: 100, includes: ["Everything in Premium", "SDK live telemetry", "Drift detection", "Compliance monitoring", "Highest ceiling"], cta: "Install SDK" },
];

export default function Page() {
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Registry"
        title="Get listed"
        description="Ship under the standard. Registered agents appear to buyers. Certified agents are chosen."
        breadcrumbs={[{ label: "Get listed" }]}
      />

      <DirectAnswer>
        Listing your agent in Meridian takes one of four forms. Registered (Tier 0) is free and automatic within 4
        hours of submission. Claimed (Tier 1) is free and takes 72 hours after identity verification via GitHub OAuth
        or DNS TXT. Premium (Tier 2) is $499–$1,999 depending on entity type and includes a full security audit. SDK
        (Tier 3) is free, open source, and unlocks the 100-point ceiling once telemetry is live for 7 days.
      </DirectAnswer>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {PRICING.map((p, i) => (
          <Card key={p.tier} className={i === 3 ? "border-accent/40 bg-surface-raised" : ""}>
            <CardBody>
              <div className="flex items-center gap-2 mb-3">
                <Badge tone={i === 3 ? "success" : i === 2 ? "accent" : i === 1 ? "info" : "neutral"}>Tier {i}</Badge>
                {i === 3 && <Badge tone="accent">Recommended</Badge>}
              </div>
              <h3 className="text-xl font-semibold mb-1">{p.tier}</h3>
              <div className="text-2xs text-text-quaternary mb-3">Score ceiling {p.max}</div>
              <div className="text-2xl font-semibold text-text-primary mb-4">{p.price}</div>
              <ul className="space-y-2 text-sm text-text-secondary mb-5">
                {p.includes.map((inc, k) => (
                  <li key={k} className="flex gap-2">
                    <Icon name="check" size={12} className="text-success mt-1 shrink-0" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
              <Button href="/get-listed/submit" variant={i === 3 ? "primary" : "secondary"} className="w-full">
                {p.cta}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Premium Review pricing</h2>
        <Card>
          <div className="divide-y divide-border">
            {[
              ["Tool / Library", "$499", "Static + dynamic testing, security audit, compliance certification"],
              ["MCP Server", "$799", "Plus permission scope deep audit + sandbox testing"],
              ["AI Agent", "$1,299", "Full security + behavioral + red team + UAOP compliance certification"],
              ["Framework", "$1,999", "Comprehensive including multi-agent interaction patterns + community health"],
              ["Enterprise custom", "Custom", "White-glove, dedicated security engineer, private report, NDA available"],
            ].map(([kind, price, includes]) => (
              <div key={kind} className="p-4 grid md:grid-cols-[1fr_1fr_3fr] gap-4 items-start">
                <div className="font-medium text-text-primary">{kind}</div>
                <div className="font-mono text-text-primary">{price}</div>
                <div className="text-sm text-text-tertiary">{includes}</div>
              </div>
            ))}
          </div>
        </Card>
        <p className="mt-3 text-xs text-text-tertiary">
          Volume discounts: 10% for 3+ reviews/year; 20% for 10+ reviews/year. Framework partners who embed the Meridian SDK
          in default templates receive 3 free Tier 1 reviews/quarter for tools built on their framework.
        </p>
      </section>

      <section>
        <Card>
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-3">Run the scanner first</h2>
            <p className="text-text-secondary mb-5">
              Free pre-flight check. Paste your system prompt or repo URL. Get an estimated ATP score + priority
              improvements in 90 seconds.
            </p>
            <Button href="/scanner" size="lg">
              Run scanner <Icon name="zap" size={14} />
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
