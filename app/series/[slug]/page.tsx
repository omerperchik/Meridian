import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { listArticles, SERIES_META } from "@/data/series";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  return SERIES_META.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = SERIES_META.find((x) => x.slug === slug);
  if (!s) return { title: "Not found" };
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: `${SITE.url}/series/${s.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = SERIES_META.find((s) => s.slug === slug);
  if (!meta) notFound();
  const articles = listArticles(meta.slug);
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow={`Editorial · ${meta.cadence}`}
        title={meta.title}
        description={meta.description}
        breadcrumbs={[
          { label: "Series", href: "/series" },
          { label: meta.title },
        ]}
      />
      {articles.length === 0 ? (
        <div className="text-text-tertiary text-sm">No articles published in this series yet — first issue dropping soon.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {articles.map((a) => (
            <Card key={a.slug} href={`/learn/${a.slug}`}>
              <CardBody>
                <div className="text-2xs text-text-quaternary mb-1">{formatDate(a.publishedAt)}</div>
                <h3 className="text-lg font-semibold mb-2">{a.title}</h3>
                <p className="text-sm text-text-tertiary leading-relaxed line-clamp-3">{a.directAnswer}</p>
                <div className="mt-3 text-2xs text-text-quaternary">{a.author.name}</div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
