import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { listIncidents } from "@/data/incidents";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Incident Docket — Public record of agent failures",
  description:
    "A public, permanent, canonical record of notable AI agent failures — investigated with the rigor of aviation accident reports. Every incident makes the ecosystem smarter.",
  alternates: { canonical: `${SITE.url}/incidents` },
};

const prioTone = { P0: "danger", P1: "warning", P2: "info", P3: "neutral" } as const;

export default function Page() {
  const incidents = listIncidents({});
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Pillar 4"
        title="The Incident Docket"
        description="Every notable agent failure — investigated, ruled on, made public. NTSB-style transparency for the agentic economy."
        breadcrumbs={[{ label: "Incidents" }]}
        meta={
          <>
            <Badge tone="danger">{incidents.filter((i) => i.priority === "P0").length} P0</Badge>
            <Badge tone="warning">{incidents.filter((i) => i.priority === "P1").length} P1</Badge>
          </>
        }
        actions={<Button href="/incidents/submit">Submit incident</Button>}
      />

      <DirectAnswer>
        The Incident Docket is a public, permanent, canonical record of notable AI agent failures. Each incident carries
        a permanent MINC-YYYY-NNNN identifier citable in papers and regulatory filings. Investigation follows a 21-day
        workflow (Reported → Triage → Under Investigation → Board Review → Ruling Published → Standard Update).
      </DirectAnswer>

      <Card>
        <div className="divide-y divide-border">
          {incidents.map((i) => (
            <Link
              key={i.id}
              href={`/incidents/${i.slug}`}
              className="block p-5 hover:bg-surface-hover transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-mono text-2xs text-text-tertiary">{i.id}</span>
                    <Badge tone={prioTone[i.priority]}>{i.priority}</Badge>
                    <Badge>{i.type.replace("-", " ")}</Badge>
                    <Badge tone={i.status === "closed" ? "neutral" : i.status === "standard-updated" ? "success" : "warning"}>
                      {i.status.replace(/-/g, " ")}
                    </Badge>
                  </div>
                  <h3 className="text-base font-medium text-text-primary group-hover:text-accent-hover transition-colors line-clamp-2 mb-1">
                    {i.title}
                  </h3>
                  <p className="text-xs text-text-tertiary line-clamp-2">{i.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-2xs text-text-quaternary">
                    <span>Reported {formatDate(i.reportedAt)}</span>
                    <span>Articles: {i.violatedArticles.map((a) => `UAOP-${a}`).join(", ")}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
