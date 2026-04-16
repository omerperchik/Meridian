import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ARTICLES } from "@/data/series";
import { SERIES_META } from "@/data/series";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Learn — Editorial content for agent builders",
  description:
    "Eight editorial series covering security, compliance, regulation, and operational best practices. Plus always-on reference: glossary, UAOP commentary, framework profiles, regulation matrix.",
  alternates: { canonical: `${SITE.url}/learn` },
};

export default function Page() {
  const recent = [...ARTICLES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Pillars 11–16"
        title="Learn"
        description="Editorial depth and always-on reference. Written for agent builders. Authored with credentials visible. Reviewed on cadence."
        breadcrumbs={[{ label: "Learn" }]}
      />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Series</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {SERIES_META.map((s) => (
            <Card key={s.slug} href={`/series/${s.slug}`}>
              <CardBody>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{s.title}</h3>
                  <Badge>{s.cadence}</Badge>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{s.description}</p>
                <div className="mt-3 text-xs text-text-tertiary">Edited by {s.editor}</div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent posts</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {recent.map((a) => (
            <Card key={a.slug} href={`/learn/${a.slug}`}>
              <CardBody>
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{a.series.replace("-", " ")}</Badge>
                  <span className="text-2xs text-text-quaternary">{formatDate(a.publishedAt)}</span>
                </div>
                <h3 className="text-base font-medium mb-2 text-text-primary">{a.title}</h3>
                <p className="text-xs text-text-tertiary leading-relaxed line-clamp-3">{a.directAnswer}</p>
                <div className="mt-3 text-2xs text-text-quaternary">
                  {a.author.name} · Last reviewed {formatDate(a.lastReviewed)}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
