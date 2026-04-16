import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Standards Changelog",
  description: "Full version history of UAOP and the Domain Conduct Codes.",
  alternates: { canonical: `${SITE.url}/standards/changelog` },
};

const VERSIONS = [
  {
    version: "UAOP v1.0.1",
    kind: "PATCH",
    tone: "success" as const,
    date: "2026-04-10",
    summary: "Editorial corrections to Articles 3 and 4 commentary; no substantive change.",
  },
  {
    version: "Finance Conduct Code v1.1.0",
    kind: "MINOR",
    tone: "warning" as const,
    date: "2026-03-28",
    summary:
      "Elevate operator-declared position caps to the irreversibility list. Triggered by incident MINC-2026-0027.",
  },
  {
    version: "Medical Conduct Code v0.10.0",
    kind: "MINOR",
    tone: "warning" as const,
    date: "2026-03-15",
    summary:
      "Added encounter-scoped memory requirement. Triggered by incident MINC-2026-0025.",
  },
  {
    version: "Finance Conduct Code v1.0.0",
    kind: "MAJOR",
    tone: "danger" as const,
    date: "2026-01-30",
    summary:
      "First domain code launched under UAOP v1.0. Fiduciary duty, conflict-of-interest handling, transaction reversibility, audit trail.",
  },
  {
    version: "UAOP v1.0.0",
    kind: "MAJOR",
    tone: "danger" as const,
    date: "2026-01-15",
    summary:
      "Inaugural publication with seven articles. Co-signed by three AI safety researchers. Founding board confirmed 9/9.",
  },
];

export default function Page() {
  return (
    <div className="container-narrow py-12 md:py-16">
      <PageHeader
        eyebrow="Standards"
        title="Changelog"
        description="Every change to UAOP and the conduct codes — audit-trailed, version-tagged, publicly timestamped."
        breadcrumbs={[{ label: "Standards", href: "/standards" }, { label: "Changelog" }]}
      />

      <div className="relative pl-8">
        <div className="absolute left-2 top-2 bottom-2 w-px bg-border" aria-hidden />
        {VERSIONS.map((v) => (
          <div key={v.version} className="relative mb-8">
            <div className="absolute -left-[1.6rem] top-3 h-3 w-3 rounded-full border-2 border-accent bg-background" aria-hidden />
            <Card>
              <CardBody>
                <div className="flex items-center gap-3 mb-2">
                  <Badge tone={v.tone}>{v.kind}</Badge>
                  <span className="text-sm text-text-tertiary">{v.date}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{v.version}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{v.summary}</p>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
