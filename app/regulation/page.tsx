import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { REGULATIONS } from "@/data/regulations";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Regulation Matrix",
  description:
    "Every piece of AI agent regulation globally, indexed by jurisdiction. EU AI Act, California SB 1001, FCA AI Guidance, MAS FEAT, NIST AI RMF, HIPAA AI Guidance.",
  alternates: { canonical: `${SITE.url}/regulation` },
};

export default function Page() {
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Reference"
        title="Regulation Matrix"
        description="Global AI agent regulation indexed by jurisdiction, entity type, compliance deadline, and required action."
        breadcrumbs={[{ label: "Regulation" }]}
      />

      <DirectAnswer>
        Meridian maintains a live-updated matrix of AI agent regulation across jurisdictions: EU AI Act, US executive
        orders, California SB 1001, Colorado AI Act, UK FCA guidance, Singapore MAS FEAT, HIPAA, GDPR Article 22, and
        more. Each regulation is mapped to UAOP and conduct code coverage; many obligations are satisfied by operating
        under Meridian-certified standards.
      </DirectAnswer>

      <div className="grid gap-3">
        {REGULATIONS.map((r) => (
          <Card key={r.id} href={`/regulation/${r.id}`}>
            <CardBody>
              <div className="flex items-center gap-2 mb-2">
                <Badge tone="accent">{r.jurisdiction}</Badge>
                <span className="text-2xs text-text-quaternary">Effective {formatDate(r.effectiveDate)}</span>
                <span className="text-2xs text-text-quaternary">· Updated {formatDate(r.lastUpdated)}</span>
              </div>
              <h3 className="text-lg font-semibold mb-1">{r.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">{r.summary}</p>
              <div className="mt-3 text-xs text-text-tertiary">{r.requirements.length} requirements · affects {r.entityTypesAffected.join(", ")}</div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
