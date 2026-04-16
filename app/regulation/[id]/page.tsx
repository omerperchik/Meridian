import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { REGULATIONS, getRegulation } from "@/data/regulations";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  return REGULATIONS.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const r = getRegulation(id);
  if (!r) return { title: "Not found" };
  return {
    title: `${r.title} — AI Agent Compliance`,
    description: r.summary,
    alternates: { canonical: `${SITE.url}/regulation/${r.id}` },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = getRegulation(id);
  if (!r) notFound();

  return (
    <div className="container-narrow py-12 md:py-16">
      <PageHeader
        eyebrow={`${r.jurisdiction} · Effective ${formatDate(r.effectiveDate)}`}
        title={r.title}
        breadcrumbs={[{ label: "Regulation", href: "/regulation" }, { label: r.title }]}
        meta={
          <>
            <Badge tone="accent">{r.jurisdiction}</Badge>
            <Badge>Updated {formatDate(r.lastUpdated)}</Badge>
          </>
        }
      />
      <DirectAnswer>{r.summary}</DirectAnswer>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
        <ol className="space-y-3">
          {r.requirements.map((req, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 text-sm font-mono text-text-tertiary w-8 mt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge tone={req.severity === "must" ? "danger" : req.severity === "should" ? "warning" : "neutral"}>
                    {req.severity.toUpperCase()}
                  </Badge>
                  {req.deadline && <span className="text-2xs text-text-quaternary">Deadline {req.deadline}</span>}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{req.requirement}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-10 pt-8 border-t border-border">
        <h2 className="text-xl font-semibold mb-3">Affected entity types</h2>
        <div className="flex flex-wrap gap-2">
          {r.entityTypesAffected.map((t) => (
            <Badge key={t} tone="info">{t}</Badge>
          ))}
        </div>
      </section>
    </div>
  );
}
