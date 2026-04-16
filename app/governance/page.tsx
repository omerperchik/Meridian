import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BOARD, RECENT_VOTES } from "@/data/governance";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Governance — The Meridian Board",
  description:
    "The 9-seat multi-stakeholder body that governs Meridian. IETF/W3C-style decision thresholds. Public votes. Transparent recusals.",
  alternates: { canonical: `${SITE.url}/governance` },
};

export default function Page() {
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Pillar 16 · Governance"
        title="The Meridian Board"
        description="Meridian's authority derives from its neutrality — and neutrality requires that no single actor can control its standards, scores, or editorial decisions. Governance follows the IETF/W3C institutional pattern."
        breadcrumbs={[{ label: "Governance" }]}
      />

      <DirectAnswer>
        The Meridian Board is a 9-seat multi-stakeholder body: 3 Model Providers, 3 Enterprise Deployers, 2 Independent
        Researchers, 1 Public Interest seat. Decisions follow supermajority thresholds — 7/9 for new/removed UAOP
        principles, 5/9 for new domain codes, 6/9 for scoring methodology. All votes public. All recusals public.
      </DirectAnswer>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Current members</h2>
        <div className="grid md:grid-cols-3 gap-3">
          {BOARD.map((m) => (
            <Card key={m.id}>
              <CardBody>
                <Badge
                  tone={
                    m.constituency === "researcher"
                      ? "accent"
                      : m.constituency === "public-interest"
                      ? "info"
                      : m.constituency === "enterprise"
                      ? "warning"
                      : "success"
                  }
                  className="mb-2"
                >
                  {m.constituency.replace("-", " ")}
                </Badge>
                <h3 className="font-semibold">{m.name}</h3>
                <div className="text-xs text-text-tertiary mb-2">{m.affiliation}</div>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">{m.bio}</p>
                <div className="mt-3 text-2xs text-text-quaternary">
                  Term: {formatDate(m.termStart)} – {formatDate(m.termEnd)}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Decision thresholds</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { kind: "MAJOR standards change", req: "7 / 9", tone: "danger" as const, note: "90-day notice + 60-day comment" },
            { kind: "MINOR standards change", req: "5 / 9", tone: "warning" as const, note: "30-day comment period" },
            { kind: "Scoring methodology", req: "6 / 9", tone: "info" as const, note: "60-day public comment + OSS update" },
            { kind: "Board membership", req: "7 / 9", tone: "accent" as const, note: "30-day notice · same constituency" },
            { kind: "Entity naming in incident", req: "6 / 9", tone: "warning" as const, note: "Evidence of negligence required" },
            { kind: "PATCH (editorial)", req: "editorial", tone: "success" as const, note: "Same-day publication" },
          ].map((d) => (
            <Card key={d.kind}>
              <CardBody>
                <Badge tone={d.tone} className="mb-2">
                  {d.req}
                </Badge>
                <h3 className="font-semibold mb-1">{d.kind}</h3>
                <p className="text-xs text-text-tertiary">{d.note}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl font-semibold">Recent votes</h2>
          <Button href="/governance/votes" variant="secondary" size="sm">
            Full record
          </Button>
        </div>
        <div className="space-y-3">
          {RECENT_VOTES.slice(0, 4).map((v) => (
            <Card key={v.id}>
              <CardBody>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-mono text-2xs text-text-tertiary">{v.id}</span>
                  <Badge tone={v.outcome === "passed" ? "success" : "neutral"}>{v.outcome}</Badge>
                  <Badge>{v.type}</Badge>
                  <span className="text-2xs text-text-quaternary">{formatDate(v.date)}</span>
                </div>
                <p className="text-sm text-text-primary">{v.decision}</p>
                <div className="mt-3 text-2xs text-text-tertiary">
                  {v.votes.filter((x) => x.vote === "yea").length} yea ·{" "}
                  {v.votes.filter((x) => x.vote === "nay").length} nay ·{" "}
                  {v.votes.filter((x) => x.vote === "abstain").length} abstain ·{" "}
                  {v.votes.filter((x) => x.vote === "recused").length} recused · threshold {v.requiredMajority}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
