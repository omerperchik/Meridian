import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Independent Audit",
  description:
    "Annual independent audit of Meridian's scoring methodology and outcomes, commissioned from an external academic institution.",
  alternates: { canonical: `${SITE.url}/governance/audit` },
};

const AUDITS = [
  {
    year: "2026",
    status: "scheduled",
    auditor: "MIT Center for Algorithmic Auditing (scheduled)",
    start: "2026-Q4",
    scope: "First full annual audit — scoring methodology, dimension-level consistency, inter-tier calibration, and the live telemetry pipeline.",
  },
];

const SCOPE = [
  "Scoring methodology: weightings, dimension inputs, aggregation logic, tier ceilings.",
  "Sample-based reproduction: auditor re-computes scores on a 5% sample; variance reported.",
  "Inter-tier calibration: do Tier 3 scores correlate with externally-observed reliability as claimed.",
  "Attestation weighting: inspection of anti-ring detection and log-scaled interaction weighting.",
  "SDK telemetry pipeline: privacy-by-design verification, data handling review.",
  "Dispute outcomes: whether panel decisions are consistent with stated principles.",
  "Conflict-of-interest adherence: recusals, disclosures, board composition.",
];

export default function Page() {
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Pillar 16 · Governance"
        title="Independent audit"
        description="Commissioned annually from an external academic institution. Reports are public."
        breadcrumbs={[{ label: "Governance", href: "/governance" }, { label: "Audit" }]}
      />

      <DirectAnswer>
        Meridian commissions an annual independent audit of its scoring methodology and outcomes from an external
        academic institution. The audit covers the scoring algorithm, a sample-based score reproduction, inter-tier
        calibration, SDK telemetry privacy, attestation anti-gaming, and conflict-of-interest adherence. Reports are
        public. The first full audit is scheduled for Q4 2026.
      </DirectAnswer>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Scope of each audit</h2>
        <Card>
          <CardBody>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              {SCOPE.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <Icon name="check" size={13} className="text-success mt-1 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Audit cadence</h2>
        <div className="space-y-3">
          {AUDITS.map((a) => (
            <Card key={a.year}>
              <CardBody>
                <div className="flex items-center gap-2 mb-2">
                  <Badge tone={a.status === "complete" ? "success" : "warning"}>{a.status}</Badge>
                  <Badge>{a.year}</Badge>
                  <span className="text-2xs text-text-quaternary">Start: {a.start}</span>
                </div>
                <h3 className="font-semibold mb-1">{a.auditor}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{a.scope}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Auditor independence requirements</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <Card>
            <CardBody>
              <h3 className="font-semibold mb-2">Institutional separation</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Auditors are from accredited academic institutions with no operational commercial relationship with
                Meridian. Consulting arrangements are disclosed.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h3 className="font-semibold mb-2">Rotation</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                No auditor serves more than three consecutive annual engagements. A 2-year cooling-off applies before
                re-engagement.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h3 className="font-semibold mb-2">Publication without redaction</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Audit reports are published in full. Meridian may file a response, but may not redact or delay
                publication of the audit itself beyond 30 days for factual verification.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h3 className="font-semibold mb-2">Access</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Auditors receive production-grade access to scoring code, anonymized telemetry samples, and minutes
                of board proceedings. Access is sandboxed for safety but not gated on content.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap gap-3">
          <Button href="/governance/votes" variant="secondary">Voting record</Button>
          <Button href="/governance/conflicts" variant="secondary">Conflicts of interest</Button>
          <Button href="mailto:audit@meridian.ai">Contact auditor liaison</Button>
        </div>
      </section>
    </div>
  );
}
