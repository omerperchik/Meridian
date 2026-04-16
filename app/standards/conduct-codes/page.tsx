import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CONDUCT_CODES } from "@/data/conduct-codes";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Domain Conduct Codes",
  description:
    "Domain-specific extensions of UAOP for high-stakes verticals: finance, medical, legal, security research, customer service, government.",
  alternates: { canonical: `${SITE.url}/standards/conduct-codes` },
};

export default function Page() {
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Standards"
        title="Domain Conduct Codes"
        description="Vertical-specific extensions of UAOP. Binding on agents declaring that domain."
        breadcrumbs={[{ label: "Standards", href: "/standards" }, { label: "Conduct Codes" }]}
      />
      <div className="grid md:grid-cols-2 gap-4">
        {CONDUCT_CODES.map((c) => (
          <Card key={c.id} href={`/standards/conduct-codes/${c.domain}`}>
            <CardBody>
              <div className="flex items-center justify-between mb-3">
                <Badge tone={c.status === "launched" ? "success" : c.status === "draft" ? "warning" : "neutral"} dot>
                  {c.status}
                </Badge>
                <span className="text-xs text-text-quaternary font-mono">{c.version}</span>
              </div>
              <h3 className="text-xl font-semibold mb-1">{c.title}</h3>
              <p className="text-xs text-text-tertiary mb-3">{c.phase}</p>
              <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">{c.summary}</p>
              <div className="mt-4 text-xs text-text-tertiary">
                {c.obligations.length} obligations · updated {c.lastUpdated}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
