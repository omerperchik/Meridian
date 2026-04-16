import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Card, CardBody } from "@/components/ui/Card";
import { INCIDENTS, getIncident } from "@/data/incidents";
import { getArticle } from "@/data/uaop";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/utils";

const prioTone = { P0: "danger", P1: "warning", P2: "info", P3: "neutral" } as const;

export async function generateStaticParams() {
  return INCIDENTS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const i = getIncident(slug);
  if (!i) return { title: "Not found" };
  return {
    title: `${i.id}: ${i.title}`,
    description: i.description.slice(0, 200),
    alternates: { canonical: `${SITE.url}/incidents/${i.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = getIncident(slug);
  if (!i) notFound();

  return (
    <div className="container-narrow py-12 md:py-16">
      <PageHeader
        eyebrow={i.id}
        title={i.title}
        breadcrumbs={[{ label: "Incidents", href: "/incidents" }, { label: i.id }]}
        meta={
          <>
            <Badge tone={prioTone[i.priority]} dot>{i.priority}</Badge>
            <Badge>{i.type.replace("-", " ")}</Badge>
            <Badge tone={i.status === "closed" ? "neutral" : i.status === "standard-updated" ? "success" : "warning"}>
              {i.status.replace(/-/g, " ")}
            </Badge>
          </>
        }
        actions={
          <Button href={`/v1/incidents/${i.id}`} variant="secondary" size="sm">
            <Icon name="code" size={12} /> JSON
          </Button>
        }
      />

      <DirectAnswer>{i.description}</DirectAnswer>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Technical analysis</h2>
        <p className="text-text-secondary leading-relaxed whitespace-pre-line">{i.technicalAnalysis}</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Ruling</h2>
        <Card>
          <CardBody>
            <p className="text-text-secondary leading-relaxed">{i.ruling}</p>
          </CardBody>
        </Card>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Violated articles</h2>
        <div className="flex flex-wrap gap-2">
          {i.violatedArticles.map((n) => {
            const a = getArticle(n);
            return a ? (
              <Link
                key={n}
                href={`/standards/uaop/${a.slug}`}
                className="inline-flex items-center gap-2 rounded-md border border-accent/30 bg-accent-muted px-3 py-1.5 text-xs font-medium text-accent-hover hover:bg-accent-muted hover:text-text-primary transition-colors"
              >
                UAOP {n} · {a.title}
                <Icon name="arrow-up-right" size={12} />
              </Link>
            ) : null;
          })}
        </div>
      </section>

      {i.standardUpdate && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Standard update</h2>
          <Card>
            <CardBody>
              <Badge tone="success" className="mb-2">
                {i.standardUpdate.version}
              </Badge>
              <p className="text-text-secondary">{i.standardUpdate.note}</p>
            </CardBody>
          </Card>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Lessons learned</h2>
        <ul className="space-y-2.5">
          {i.lessonsLearned.map((l, k) => (
            <li key={k} className="flex gap-3 text-text-secondary">
              <Icon name="check" size={14} className="text-accent-hover mt-1 shrink-0" />
              <span className="leading-relaxed">{l}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex items-center justify-between gap-4 pt-6 border-t border-border text-xs text-text-tertiary">
        <span>Reported {formatDate(i.reportedAt)} · Occurred {formatDate(i.occurredAt)}</span>
        <span>Entity: {i.entityAnonymized ? "anonymized" : i.entity}</span>
      </div>
    </div>
  );
}
