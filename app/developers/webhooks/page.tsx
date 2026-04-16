import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Webhooks",
  description: "Subscribe to real-time Meridian events: trust score changes, new threats, incident filings, rulings.",
  alternates: { canonical: `${SITE.url}/developers/webhooks` },
};

export default function Page() {
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Developers"
        title="Webhooks"
        description="Pro and Enterprise tiers subscribe to real-time Meridian events. 5 subscriptions on Pro, unlimited on Enterprise."
        breadcrumbs={[{ label: "Developers", href: "/developers" }, { label: "Webhooks" }]}
      />
      <Card>
        <CardBody>
          <h2 className="font-semibold mb-3">Event types</h2>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li><code className="font-mono text-accent-hover">trust.score.changed</code> — fires when any entity's composite score moves by at least 5 points</li>
            <li><code className="font-mono text-accent-hover">threat.published</code> — fires on every Critical/High threat publication within 60 seconds of confirmation</li>
            <li><code className="font-mono text-accent-hover">incident.filed</code> — fires when a new incident is filed</li>
            <li><code className="font-mono text-accent-hover">incident.ruling</code> — fires when an incident ruling is published</li>
            <li><code className="font-mono text-accent-hover">ruling.published</code> — fires every Tuesday on the Weekly Ruling</li>
            <li><code className="font-mono text-accent-hover">standards.updated</code> — fires on any UAOP or conduct code version change</li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
