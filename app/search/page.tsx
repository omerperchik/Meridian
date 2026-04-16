import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ARTICLES } from "@/data/series";
import { GLOSSARY } from "@/data/glossary";
import { REGISTRY } from "@/data/registry";
import { RULINGS } from "@/data/rulings";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Search",
  description: "Search across standards, rulings, incidents, threats, registry, and editorial content.",
  alternates: { canonical: `${SITE.url}/search` },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const needle = (q || "").toLowerCase();

  let articles: typeof ARTICLES = [];
  let terms: typeof GLOSSARY = [];
  let entities: typeof REGISTRY = [];
  let rulings: typeof RULINGS = [];

  if (needle) {
    articles = ARTICLES.filter((a) => [a.title, a.summary, a.directAnswer, ...a.tags].some((v) => v.toLowerCase().includes(needle))).slice(0, 8);
    terms = GLOSSARY.filter((t) => [t.term, t.definition].some((v) => v.toLowerCase().includes(needle))).slice(0, 8);
    entities = REGISTRY.filter((e) => [e.name, e.description, ...e.capabilities].some((v) => v.toLowerCase().includes(needle))).slice(0, 8);
    rulings = RULINGS.filter((r) => [r.title, r.scenario, r.ruling].some((v) => v.toLowerCase().includes(needle))).slice(0, 8);
  }

  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Search"
        title={needle ? `Results for "${q}"` : "Search"}
        description="Full-text across standards, rulings, incidents, threats, registry, and editorial content."
        breadcrumbs={[{ label: "Search" }]}
      />

      <form className="mb-10" method="get" action="/search">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search…"
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-text-primary placeholder:text-text-quaternary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
        />
      </form>

      {needle && (
        <div className="space-y-10">
          {articles.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Editorial</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {articles.map((a) => (
                  <Card key={a.slug} href={`/learn/${a.slug}`}>
                    <CardBody>
                      <h3 className="font-medium mb-1">{a.title}</h3>
                      <p className="text-xs text-text-tertiary line-clamp-2">{a.directAnswer}</p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </section>
          )}
          {terms.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Glossary</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {terms.map((t) => (
                  <Card key={t.slug} href={`/glossary/${t.slug}`}>
                    <CardBody>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium">{t.term}</h3>
                        <Badge>{t.category}</Badge>
                      </div>
                      <p className="text-xs text-text-tertiary line-clamp-2">{t.definition}</p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </section>
          )}
          {entities.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Registry</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {entities.map((e) => (
                  <Card key={e.id} href={`/directory/${e.slug}`}>
                    <CardBody>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium">{e.name}</h3>
                        <span className="font-mono text-sm text-text-primary">{Math.round(e.trust.composite)}</span>
                      </div>
                      <p className="text-xs text-text-tertiary line-clamp-2">{e.description}</p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </section>
          )}
          {rulings.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Rulings</h2>
              <div className="space-y-2">
                {rulings.map((r) => (
                  <Link key={r.id} href={`/rulings/${r.slug}`} className="block rounded-md border border-border p-4 hover:bg-surface-hover transition-colors">
                    <div className="font-mono text-2xs text-text-tertiary">{r.id}</div>
                    <div className="text-sm font-medium">{r.title}</div>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {!articles.length && !terms.length && !entities.length && !rulings.length && (
            <p className="text-text-tertiary">No results. Try a broader term.</p>
          )}
        </div>
      )}
    </div>
  );
}
