import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Editorial Team",
  description:
    "The editorial team responsible for Meridian's content, rulings, standards commentary, and investigation of incidents.",
  alternates: { canonical: `${SITE.url}/governance/editorial` },
};

const ROLES = [
  {
    role: "Editor-in-Chief",
    fte: 1,
    responsibilities:
      "Editorial voice, Weekly Ruling selection, Trust Report authorship, board-level relationships, content strategy.",
  },
  {
    role: "Security Editor",
    fte: 1,
    responsibilities:
      "Security Assessment series, Framework Security Profiles, CVE page reviews, threat analysis, red-team post-mortems.",
  },
  {
    role: "Standards Editor",
    fte: 1,
    responsibilities:
      "UAOP commentary, conduct code docs, ruling analysis, Regulation Watch, compliance guides.",
  },
  {
    role: "Technical Writers",
    fte: 2,
    responsibilities:
      "Builder's Handbook, Stack Deep Dives, integration guides, incident analyses, programmatic page templates.",
  },
  {
    role: "Content Ops Engineer",
    fte: 1,
    responsibilities:
      "Programmatic pipeline, schema markup, internal linking automation, freshness monitoring, AEO tracking, content API.",
  },
  {
    role: "Community Editor",
    fte: 1,
    responsibilities: "Voices from the Field, practitioner interviews, community submissions, guest post review.",
    phase: "Phase 2",
  },
];

const STANDARDS = [
  "Direct Answer Block: present on every major page and under 200 tokens.",
  "Named author with verifiable credentials on every piece.",
  "All data claims link to a primary source or a Meridian data page.",
  "Review cadence stated explicitly ('Updated quarterly' / 'Updated on regulation changes').",
  "FAQ section with FAQPage schema markup where applicable.",
  "Published simultaneously to the /v1/content/{slug} API and the web.",
  "Version incremented and changelog entry added on any substantive change.",
];

export default function Page() {
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Pillar 16 · Editorial Operations"
        title="Editorial team"
        description="Seven seats in the editorial team. Every piece of content has a named author and a review cadence. Board decisions are separate from editorial decisions."
        breadcrumbs={[{ label: "Governance", href: "/governance" }, { label: "Editorial" }]}
      />

      <DirectAnswer>
        Meridian's editorial team operates independently from the 9-seat governance board. Editorial decisions
        (publication, corrections, draft selection) are editorial team authority; standards changes and score
        methodology remain board authority. Every article carries a named author with verifiable credentials and
        a stated review cadence.
      </DirectAnswer>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Team</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {ROLES.map((r) => (
            <Card key={r.role}>
              <CardBody>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{r.role}</h3>
                  <div className="flex items-center gap-2">
                    {r.phase && <Badge tone="warning">{r.phase}</Badge>}
                    <Badge>{r.fte} FTE</Badge>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{r.responsibilities}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Quality standards</h2>
        <Card>
          <CardBody>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              {STANDARDS.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 font-mono text-xs text-accent-hover mt-0.5 w-8">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Separation from the governance board</h2>
        <Card>
          <CardBody>
            <p className="text-text-secondary leading-relaxed">
              The editorial team publishes rulings, analyses, and guides. The governance board ratifies standards and
              approves scoring methodology. This separation is deliberate — it lets the editorial team move at the
              speed of journalism (weekly rulings, incident response in hours) while the board maintains the measured
              cadence required for standards stewardship (30–90 day comment periods, supermajority thresholds).
            </p>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
