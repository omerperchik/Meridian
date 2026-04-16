import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Prose } from "@/components/ui/Prose";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { UAOP, getArticle } from "@/data/uaop";
import { SITE } from "@/lib/site";
import { listIncidents } from "@/data/incidents";

export async function generateStaticParams() {
  return UAOP.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: "Not found" };
  return {
    title: `UAOP Article ${a.number}: ${a.title}`,
    description: a.requires,
    alternates: { canonical: `${SITE.url}/standards/uaop/${a.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const relatedIncidents = listIncidents({}).filter((i) => i.violatedArticles.includes(a.number)).slice(0, 3);
  const prev = UAOP.find((x) => x.number === a.number - 1);
  const next = UAOP.find((x) => x.number === a.number + 1);

  const ldArticle = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `UAOP Article ${a.number}: ${a.title}`,
    description: a.requires,
    datePublished: "2026-01-15",
    dateModified: "2026-04-10",
    author: { "@type": "Organization", name: SITE.author },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    license: "https://creativecommons.org/licenses/by/4.0/",
  };

  return (
    <div className="container-narrow py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldArticle) }} />
      <PageHeader
        eyebrow={`UAOP v${SITE.constitutionVersion} · Article ${a.number}`}
        title={a.title}
        description={a.requires}
        breadcrumbs={[
          { label: "Standards", href: "/standards" },
          { label: "UAOP", href: "/standards/uaop" },
          { label: `Article ${a.number}` },
        ]}
        meta={
          <>
            <Badge tone="accent">Article {a.number}</Badge>
            <Badge tone="success" dot>Active</Badge>
          </>
        }
      />

      <DirectAnswer>
        UAOP Article {a.number} ({a.title}) requires that {a.requires.toLowerCase().replace(/\.$/, "")}. The common
        failure mode is: {a.commonFailureMode.toLowerCase()}. Implemented as runtime middleware, not prompt text.
      </DirectAnswer>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Commentary</h2>
        <p className="text-text-secondary leading-relaxed">{a.commentary}</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Examples</h2>
        <ul className="space-y-3">
          {a.examples.map((e, i) => (
            <li key={i} className="flex gap-3 text-text-secondary">
              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
              <span className="leading-relaxed">{e}</span>
            </li>
          ))}
        </ul>
      </section>

      {relatedIncidents.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Incidents that invoked this article</h2>
          <div className="space-y-2">
            {relatedIncidents.map((i) => (
              <Link
                key={i.id}
                href={`/incidents/${i.slug}`}
                className="block rounded-md border border-border p-4 hover:bg-surface-hover transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-2xs text-text-tertiary">{i.id}</span>
                  <Badge tone={i.priority === "P0" ? "danger" : i.priority === "P1" ? "warning" : "neutral"}>
                    {i.priority}
                  </Badge>
                </div>
                <div className="text-sm font-medium text-text-primary">{i.title}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <nav className="flex items-center justify-between gap-4 mt-12 pt-8 border-t border-border">
        {prev ? (
          <Button href={`/standards/uaop/${prev.slug}`} variant="ghost">
            ← Article {prev.number}: {prev.title}
          </Button>
        ) : (
          <span />
        )}
        {next ? (
          <Button href={`/standards/uaop/${next.slug}`} variant="ghost">
            Article {next.number}: {next.title} →
          </Button>
        ) : (
          <span />
        )}
      </nav>

      <div className="mt-8 flex items-center gap-2">
        <Button href={`/v1/standards/constitution`} variant="secondary" size="sm">
          <Icon name="code" size={12} /> JSON
        </Button>
        <span className="text-xs text-text-tertiary">License: CC BY 4.0 · Training use invited</span>
      </div>
    </div>
  );
}
