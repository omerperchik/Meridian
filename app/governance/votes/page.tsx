import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RECENT_VOTES } from "@/data/governance";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Board Voting Record",
  description: "Every board vote — member, vote, rationale. Published within 24 hours of the vote.",
  alternates: { canonical: `${SITE.url}/governance/votes` },
};

export default function Page() {
  return (
    <div className="container-narrow py-12 md:py-16">
      <PageHeader
        eyebrow="Governance"
        title="Voting record"
        description="Every vote. Every member. Every rationale. Published within 24 hours."
        breadcrumbs={[{ label: "Governance", href: "/governance" }, { label: "Votes" }]}
      />
      {RECENT_VOTES.map((v) => (
        <Card key={v.id} className="mb-4">
          <CardBody>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-mono text-2xs text-text-tertiary">{v.id}</span>
              <Badge tone={v.outcome === "passed" ? "success" : "neutral"}>{v.outcome}</Badge>
              <Badge>{v.type}</Badge>
              <span className="text-2xs text-text-quaternary">{formatDate(v.date)}</span>
            </div>
            <p className="text-text-primary mb-4 font-medium">{v.decision}</p>
            <div className="grid md:grid-cols-3 gap-2">
              {v.votes.map((row, i) => (
                <div key={i} className="rounded-md border border-border bg-surface-raised p-3">
                  <div className="text-xs text-text-secondary font-medium">{row.member}</div>
                  <Badge
                    tone={row.vote === "yea" ? "success" : row.vote === "nay" ? "danger" : "neutral"}
                    className="mt-1"
                  >
                    {row.vote}
                  </Badge>
                  {row.rationale && <p className="text-2xs text-text-tertiary mt-2 leading-relaxed">{row.rationale}</p>}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
