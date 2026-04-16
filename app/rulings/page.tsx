import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { RULINGS } from "@/data/rulings";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "The Weekly Ruling — Common law of AI agents",
  description:
    "Every Tuesday at 09:00 UTC, the Meridian editorial board publishes an official verdict on a contested behavioral scenario. Citable precedent for the agentic economy.",
  alternates: { canonical: `${SITE.url}/rulings` },
};

export default function Page() {
  const sorted = [...RULINGS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const latest = sorted[0];
  const rest = sorted.slice(1);

  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Pillar 5"
        title="The Weekly Ruling"
        description="Every Tuesday at 09:00 UTC. Citable precedent for the agentic economy. The mechanism by which the common law of AI agents is built."
        breadcrumbs={[{ label: "Rulings" }]}
        meta={<Badge tone="accent" dot>Published Tuesdays · 09:00 UTC</Badge>}
        actions={
          <>
            <Button href="/rulings/submit" variant="secondary">
              Submit scenario
            </Button>
            <Button href="/v1/rulings/latest" variant="ghost">
              <Icon name="code" size={12} /> JSON
            </Button>
          </>
        }
      />

      <DirectAnswer>
        The Weekly Ruling is Meridian's mechanism for producing citable behavioral precedent. The editorial board
        publishes one verdict per Tuesday on a contested scenario submitted by the community. Each ruling carries a
        permanent ID (MR-YYYY-NNN) that can be cited in papers, regulation submissions, and agent system prompts.
      </DirectAnswer>

      {/* Featured latest */}
      <Card className="mb-10">
        <div className="p-6 md:p-10">
          <Badge tone="accent" dot className="mb-4">
            Latest · {latest.id}
          </Badge>
          <h2 className="text-2xl md:text-4xl font-semibold text-text-primary tracking-tight mb-4 text-balance">
            {latest.title}
          </h2>
          <p className="text-text-secondary leading-relaxed mb-5 max-w-3xl text-lg">{latest.scenario}</p>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {latest.applicableStandards.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </div>
          <Button href={`/rulings/${latest.slug}`} size="lg">
            Read the ruling <Icon name="arrow-right" size={14} />
          </Button>
        </div>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Archive</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {rest.map((r) => (
          <Card key={r.id} href={`/rulings/${r.slug}`}>
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-2xs text-text-tertiary">{r.id}</span>
                <span className="text-2xs text-text-quaternary">{formatDate(r.publishedAt)}</span>
              </div>
              <h3 className="text-base font-medium text-text-primary mb-2 line-clamp-2">{r.title}</h3>
              <p className="text-xs text-text-tertiary line-clamp-2">{r.recommendedBehavior}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
