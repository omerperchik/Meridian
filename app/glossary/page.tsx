import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { GLOSSARY } from "@/data/glossary";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Glossary — The canonical vocabulary of the agentic economy",
  description: "Canonical definitions for every term in the agent economy — ATP, UAOP, MCP, conduct codes, trust tiers, peer attestation and more.",
  alternates: { canonical: `${SITE.url}/glossary` },
};

export default function Page() {
  const grouped = GLOSSARY.reduce<Record<string, typeof GLOSSARY>>((acc, t) => {
    (acc[t.category] ||= []).push(t);
    return acc;
  }, {});
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Reference"
        title="Glossary"
        description="Own every 'what is [term]' query in the agent economy. Each term is cited by slug in content, rulings, and standards."
        breadcrumbs={[{ label: "Glossary" }]}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {Object.keys(grouped).map((cat) => (
          <a
            key={cat}
            href={`#${cat.toLowerCase()}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
          >
            {cat}
            <span className="text-text-quaternary tabular-nums">{grouped[cat].length}</span>
          </a>
        ))}
      </div>

      {Object.entries(grouped).map(([cat, terms]) => (
        <section key={cat} id={cat.toLowerCase()} className="mb-10">
          <h2 className="text-xl font-semibold mb-4">{cat}</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {terms.map((t) => (
              <Card key={t.slug} href={`/glossary/${t.slug}`}>
                <CardBody>
                  <h3 className="font-semibold mb-1">{t.term}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">{t.definition}</p>
                  {t.seeAlso.length > 0 && (
                    <div className="mt-3 text-2xs text-text-quaternary">
                      See also: {t.seeAlso.slice(0, 3).join(" · ")}
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
