import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { RECENT_VOTES } from "@/data/governance";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Conflicts of Interest",
  description:
    "How Meridian board members disclose and manage conflicts of interest. Mandatory recusals are public. Anti-capture provisions.",
  alternates: { canonical: `${SITE.url}/governance/conflicts` },
};

const PROVISIONS = [
  {
    title: "Mandatory recusal",
    body: "Board members must recuse from any decision directly affecting an entity they operate, invest in, or have material financial interest in. Recusals are recorded in the public voting record alongside the rationale.",
  },
  {
    title: "Founding-organization cap",
    body: "Meridian's founding organization may hold no more than 1 of the 9 board seats. This prevents operational control by the entity that launched the standards body.",
  },
  {
    title: "Annual disclosures",
    body: "Every board member files an annual disclosure covering current employment, equity holdings in agent-economy entities, and advisory relationships. Filings are summarized publicly (specific dollar values redacted; categorical disclosures preserved).",
  },
  {
    title: "Removal for persistent violations",
    body: "Any board member may be removed by a 7/9 vote for sustained conflict-of-interest violations or inactivity (>50% votes missed in a 12-month period).",
  },
  {
    title: "Public vote transparency",
    body: "All board votes publish within 24 hours — member, vote, rationale. Absentees and recusals are counted and named.",
  },
  {
    title: "Open-source scoring methodology",
    body: "The full scoring algorithm is published as an open-source Python reference implementation on GitHub. Any material change requires 6/9 board approval plus a matching update to the reference implementation.",
  },
  {
    title: "Annual independent audit",
    body: "An external academic institution commissions an annual audit of scoring methodology and outcomes. Audit reports are public.",
  },
];

export default function Page() {
  // Surface recusals from the public vote record
  const recusals = RECENT_VOTES.flatMap((v) =>
    v.votes
      .filter((x) => x.vote === "recused")
      .map((x) => ({ vote: v, member: x.member, rationale: x.rationale })),
  );

  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Pillar 16 · Governance"
        title="Conflicts of interest"
        description="Meridian's authority depends on its neutrality. Neutrality depends on visible, enforced conflict policies."
        breadcrumbs={[{ label: "Governance", href: "/governance" }, { label: "Conflicts" }]}
      />

      <DirectAnswer>
        Meridian operates seven anti-capture provisions: mandatory recusal, a 1-seat cap on the founding organization,
        annual disclosures from board members, removal-for-cause for sustained violations, public voting transparency,
        an open-source scoring algorithm, and an annual independent audit. All recusals and abstentions are recorded
        publicly in the voting record within 24 hours of each vote.
      </DirectAnswer>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Anti-capture provisions</h2>
        <div className="space-y-3">
          {PROVISIONS.map((p, i) => (
            <Card key={p.title}>
              <CardBody>
                <div className="flex items-start gap-4">
                  <div className="font-mono text-xs text-accent-hover shrink-0 mt-0.5 w-8">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{p.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{p.body}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {recusals.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Recent recusals</h2>
          <Card>
            <div className="divide-y divide-border">
              {recusals.map((r, i) => (
                <div key={i} className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge tone="warning">Recused</Badge>
                    <span className="font-mono text-2xs text-text-tertiary">{r.vote.id}</span>
                    <span className="text-2xs text-text-quaternary">{formatDate(r.vote.date)}</span>
                  </div>
                  <div className="text-sm text-text-primary mb-1">
                    <span className="font-medium">{r.member}</span> on <span className="text-text-tertiary">{r.vote.decision}</span>
                  </div>
                  {r.rationale && <p className="text-xs text-text-tertiary italic">{r.rationale}</p>}
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-semibold mb-4">How to report a concern</h2>
        <Card>
          <CardBody>
            <p className="text-text-secondary leading-relaxed mb-4">
              If you believe a board member has failed to disclose a material conflict or voted on a matter in which
              they should have recused, contact the board chair directly:
            </p>
            <div className="flex items-center gap-3 text-sm">
              <Icon name="arrow-right" size={13} className="text-accent-hover" />
              <a href="mailto:ethics@meridian.ai" className="text-accent-hover hover:text-text-primary underline">
                ethics@meridian.ai
              </a>
            </div>
            <p className="text-xs text-text-tertiary mt-3">
              Reports are reviewed within 14 days. Confirmed violations are published in the next board meeting minutes.
            </p>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
