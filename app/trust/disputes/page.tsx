import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Score Disputes & Appeals",
  description:
    "How to dispute a Meridian ATP score change. 30-day window. 3-member arbitration panel. Decisions public and permanently appended.",
  alternates: { canonical: `${SITE.url}/trust/disputes` },
};

const STEPS = [
  {
    n: "01",
    title: "Check eligibility",
    body: "Disputes are accepted for any score change of more than 5 points within the last 30 days. Smaller changes and older changes are out of window.",
  },
  {
    n: "02",
    title: "File the dispute",
    body: "Submit entity ID, disputed dimension, your evidence, and the correction you're requesting. Use the structured form below or POST to /v1/trust/disputes.",
  },
  {
    n: "03",
    title: "Panel review",
    body: "A 3-member arbitration panel drawn from the governance board (rotating) reviews within 14 days. Panel members recuse if they have material interest.",
  },
  {
    n: "04",
    title: "Public decision",
    body: "The decision is published and permanently appended to the entity's record — both the original score movement and the ruling. Neither can be deleted later.",
  },
  {
    n: "05",
    title: "Cooling-off for frivolous filings",
    body: "A third dispute with no supporting evidence triggers a 90-day cooling-off period for that entity. Disputes must be grounded in verifiable claims.",
  },
];

export default function Page() {
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Pillar 2 · Trust"
        title="Score disputes & appeals"
        description="The formal mechanism to challenge a score change. Transparent process, public record, fixed timelines."
        breadcrumbs={[{ label: "Trust", href: "/trust" }, { label: "Disputes" }]}
      />

      <DirectAnswer>
        Score changes of more than 5 points may be disputed within 30 days. A rotating 3-member arbitration panel
        drawn from the 9-seat governance board reviews within 14 days. Decisions are public and permanently appended
        to the entity's record. Frivolous filings (3rd with no evidence) trigger a 90-day cooling-off window.
      </DirectAnswer>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">How it works</h2>
        <div className="space-y-3">
          {STEPS.map((s) => (
            <Card key={s.n}>
              <div className="p-5 flex gap-5">
                <div className="font-mono text-2xl text-accent-hover shrink-0 w-12">{s.n}</div>
                <div>
                  <h3 className="font-semibold mb-1">{s.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{s.body}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">File a dispute</h2>
        <Card>
          <CardBody>
            <form method="post" action="/v1/trust/disputes" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Entity ID or slug</label>
                  <input
                    required
                    name="entity"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none font-mono"
                    placeholder="atlas-finance"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Dimension disputed</label>
                  <select
                    name="dimension"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
                  >
                    <option>composite</option>
                    <option>security</option>
                    <option>compliance</option>
                    <option>performance</option>
                    <option>reliability</option>
                    <option>affordability</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Approximate date of the disputed change</label>
                <input type="date" name="date" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Evidence & reasoning (required)</label>
                <textarea
                  required
                  minLength={200}
                  rows={6}
                  name="evidence"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
                  placeholder="Describe the change you believe is incorrect, what you believe the correct score should be, and attach or reference supporting evidence. At least 200 words."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Filer contact (required, kept confidential)</label>
                <input required type="email" name="filer" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-text-tertiary inline-flex items-center gap-2">
                  <Badge tone="info">14-day review</Badge>
                  Decision public and permanent.
                </div>
                <Button type="submit">Submit dispute</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Panel selection</h2>
        <Card>
          <CardBody>
            <p className="text-text-secondary leading-relaxed mb-3">
              Each dispute is reviewed by a 3-member panel drawn from the 9-seat governance board. Panel composition:
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex gap-2">
                <Icon name="check" size={12} className="text-success mt-1 shrink-0" />
                <span>One member from each of the three primary constituencies (Model Providers, Enterprise Deployers, Researchers) where possible.</span>
              </li>
              <li className="flex gap-2">
                <Icon name="check" size={12} className="text-success mt-1 shrink-0" />
                <span>Any member with material interest in the disputing entity (employer, investor, partner) recuses automatically.</span>
              </li>
              <li className="flex gap-2">
                <Icon name="check" size={12} className="text-success mt-1 shrink-0" />
                <span>Panel rotates per dispute; no member serves on more than 3 consecutive disputes.</span>
              </li>
              <li className="flex gap-2">
                <Icon name="check" size={12} className="text-success mt-1 shrink-0" />
                <span>Panel decisions are published alongside individual votes and rationale.</span>
              </li>
            </ul>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
