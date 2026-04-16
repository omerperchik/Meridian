import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { GLOSSARY, getTerm } from "@/data/glossary";
import { SITE } from "@/lib/site";

export async function generateStaticParams() {
  return GLOSSARY.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTerm(slug);
  if (!t) return { title: "Not found" };
  return {
    title: `${t.term} — Definition`,
    description: t.definition.slice(0, 180),
    alternates: { canonical: `${SITE.url}/glossary/${t.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTerm(slug);
  if (!t) notFound();

  const ldDefined = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: t.term,
    description: t.definition,
    inDefinedTermSet: { "@type": "DefinedTermSet", name: "Meridian Glossary", url: `${SITE.url}/glossary` },
  };

  return (
    <div className="container-narrow py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldDefined) }} />
      <PageHeader
        eyebrow={`Glossary · ${t.category}`}
        title={t.term}
        breadcrumbs={[{ label: "Glossary", href: "/glossary" }, { label: t.term }]}
        actions={
          <Button href={`/v1/content/glossary/${t.slug}`} variant="secondary" size="sm">
            <Icon name="code" size={12} /> JSON
          </Button>
        }
      />
      <DirectAnswer>{t.definition}</DirectAnswer>
      {t.seeAlso.length > 0 && (
        <section className="mt-8 pt-6 border-t border-border">
          <h2 className="text-base font-semibold mb-3">See also</h2>
          <div className="flex flex-wrap gap-2">
            {t.seeAlso.map((s) => {
              const related = GLOSSARY.find((g) => g.term === s);
              return related ? (
                <Link key={s} href={`/glossary/${related.slug}`} className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors">
                  {s}
                </Link>
              ) : (
                <Badge key={s}>{s}</Badge>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
