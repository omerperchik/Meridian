import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { THREATS, getThreat } from "@/data/threats";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/utils";

const sevTone = { critical: "danger", high: "warning", medium: "info", low: "neutral" } as const;

export async function generateStaticParams() {
  return THREATS.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const t = getThreat(id);
  if (!t) return { title: "Not found" };
  return {
    title: `${t.id}: ${t.title}`,
    description: t.summary,
    alternates: { canonical: `${SITE.url}/threats/${t.id}` },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = getThreat(id);
  if (!t) notFound();

  return (
    <div className="container-narrow py-12 md:py-16">
      <PageHeader
        eyebrow={t.id}
        title={t.title}
        breadcrumbs={[{ label: "Threats", href: "/threats" }, { label: t.id }]}
        meta={
          <>
            <Badge tone={sevTone[t.severity]} dot>{t.severity.toUpperCase()}</Badge>
            <Badge>CVSS {t.cvss}</Badge>
            <Badge>{t.category.replace("-", " ")}</Badge>
            <Badge tone={t.status === "active" ? "danger" : t.status === "partial" ? "warning" : "success"}>
              {t.status}
            </Badge>
          </>
        }
        actions={
          <Button href={`/v1/threats/${t.id}`} variant="secondary" size="sm">
            <Icon name="code" size={12} /> JSON
          </Button>
        }
      />

      <DirectAnswer>{t.summary}</DirectAnswer>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Attack pattern</h2>
        <p className="text-text-secondary leading-relaxed">{t.pattern}</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Detection signature</h2>
        <Card>
          <CardBody>
            <div className="eyebrow mb-2">{t.detectionSignature.type}</div>
            <pre className="rounded-md bg-surface-raised p-3 text-xs font-mono text-text-secondary overflow-x-auto whitespace-pre-wrap">
              <code>{t.detectionSignature.signature}</code>
            </pre>
          </CardBody>
        </Card>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Mitigations</h2>
        <ul className="space-y-2.5">
          {t.mitigations.map((m, i) => (
            <li key={i} className="flex gap-3 text-text-secondary">
              <Icon name="check" size={14} className="text-success mt-1 shrink-0" />
              <span className="leading-relaxed">{m}</span>
            </li>
          ))}
        </ul>
      </section>

      {t.affectedEntities.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Affected entities</h2>
          <div className="flex flex-wrap gap-2">
            {t.affectedEntities.map((slug) => (
              <Badge key={slug} tone="warning">
                {slug}
              </Badge>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-4 text-xs text-text-tertiary">
          <span>Reporter: {t.reporter}</span>
          <span>Discovered {formatDate(t.discoveredAt)}</span>
          <span>Updated {formatDate(t.lastUpdated)}</span>
        </div>
      </section>
    </div>
  );
}
