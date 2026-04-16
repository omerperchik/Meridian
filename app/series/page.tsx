import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SERIES_META } from "@/data/series";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Editorial Series",
  description: "Eight series covering agent security, compliance, regulation, and operational best practices.",
  alternates: { canonical: `${SITE.url}/series` },
};

export default function Page() {
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Content"
        title="Editorial Series"
        description="Eight cadence-driven series produced by Meridian's editorial team. Every piece is authored, reviewed, and versioned."
        breadcrumbs={[{ label: "Series" }]}
      />
      <div className="grid md:grid-cols-2 gap-3">
        {SERIES_META.map((s) => (
          <Card key={s.slug} href={`/series/${s.slug}`}>
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <Badge>{s.cadence}</Badge>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{s.description}</p>
              <div className="mt-3 text-xs text-text-tertiary">Edited by {s.editor}</div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
