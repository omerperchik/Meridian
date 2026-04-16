import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { CONDUCT_CODES, getConductCode } from "@/data/conduct-codes";
import { SITE } from "@/lib/site";

export async function generateStaticParams() {
  return CONDUCT_CODES.map((c) => ({ domain: c.domain }));
}

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain } = await params;
  const c = getConductCode(domain);
  if (!c) return { title: "Not found" };
  return {
    title: c.title,
    description: c.summary,
    alternates: { canonical: `${SITE.url}/standards/conduct-codes/${c.domain}` },
  };
}

export default async function Page({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const c = getConductCode(domain);
  if (!c) notFound();

  return (
    <div className="container-narrow py-12 md:py-16">
      <PageHeader
        eyebrow={`${c.phase} · ${c.version}`}
        title={c.title}
        breadcrumbs={[
          { label: "Standards", href: "/standards" },
          { label: "Conduct Codes", href: "/standards/conduct-codes" },
          { label: c.domain },
        ]}
        meta={
          <>
            <Badge tone={c.status === "launched" ? "success" : c.status === "draft" ? "warning" : "neutral"} dot>
              {c.status}
            </Badge>
            <Badge tone="neutral">last updated {c.lastUpdated}</Badge>
          </>
        }
        actions={
          <Button href={`/v1/standards/conduct-codes/${c.domain}`} variant="secondary" size="sm">
            <Icon name="code" size={12} /> JSON
          </Button>
        }
      />

      <DirectAnswer>{c.summary}</DirectAnswer>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Obligations</h2>
        <ul className="space-y-3">
          {c.obligations.map((o, i) => (
            <li key={i} className="flex gap-3 text-text-secondary">
              <span className="shrink-0 font-mono text-accent-hover text-sm mt-0.5">{String(i + 1).padStart(2, "0")}</span>
              <span className="leading-relaxed">{o}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
