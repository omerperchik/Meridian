import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { CATEGORIES } from "@/lib/categories";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Best of — Live rankings for the agentic economy",
  description: "Live-ranked categories: best AI agents for finance, coding, research; best MCP servers for filesystem, browser, database; best frameworks.",
  alternates: { canonical: `${SITE.url}/best-of` },
};

export default function Page() {
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Programmatic · Best of"
        title="Best of"
        description="Category rankings. Live scores. Spec §15.3 targets 10,000+ such pages once the full registry is populated; this seed surfaces the primary axes."
        breadcrumbs={[{ label: "Best of" }]}
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {CATEGORIES.map((c) => (
          <Card key={c.slug} href={`/best-of/${c.slug}`}>
            <CardBody>
              <h3 className="text-base font-medium text-text-primary mb-1">{c.label}</h3>
              <p className="text-sm text-text-tertiary">{c.useCase}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
