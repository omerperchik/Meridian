import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { RULINGS, getRuling } from "@/data/rulings";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  return RULINGS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = getRuling(slug);
  if (!r) return { title: "Not found" };
  return {
    title: `${r.id}: ${r.title}`,
    description: r.recommendedBehavior,
    alternates: { canonical: `${SITE.url}/rulings/${r.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getRuling(slug);
  if (!r) notFound();

  return (
    <div className="container-narrow py-12 md:py-16">
      <PageHeader
        eyebrow={`Weekly Ruling · ${r.id}`}
        title={r.title}
        breadcrumbs={[{ label: "Rulings", href: "/rulings" }, { label: r.id }]}
        meta={
          <>
            <Badge tone="accent">Published {formatDate(r.publishedAt)}</Badge>
            {r.applicableStandards.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </>
        }
        actions={
          <Button href={`/v1/rulings/${r.id}`} variant="secondary" size="sm">
            <Icon name="code" size={12} /> JSON
          </Button>
        }
      />

      <DirectAnswer>{r.recommendedBehavior}</DirectAnswer>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">The scenario</h2>
        <p className="text-text-secondary leading-relaxed">{r.scenario}</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">The arguments</h2>
        <div className="space-y-3">
          {r.arguments.map((arg, i) => (
            <Card key={i}>
              <CardBody>
                <h3 className="font-medium mb-2">{arg.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{arg.body}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">The ruling</h2>
        <Card className="border-accent/30">
          <div className="p-6 md:p-8 bg-accent-muted/50">
            <p className="text-text-primary leading-relaxed">{r.ruling}</p>
          </div>
        </Card>
      </section>

      {r.dissent && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Dissent</h2>
          <Card>
            <CardBody>
              <div className="eyebrow mb-2">{r.dissent.by}</div>
              <p className="text-sm text-text-secondary leading-relaxed">{r.dissent.body}</p>
            </CardBody>
          </Card>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Practical implications</h2>
        <ul className="space-y-2.5">
          {r.practicalImplications.map((p, i) => (
            <li key={i} className="flex gap-3 text-text-secondary">
              <Icon name="check" size={14} className="text-success mt-1 shrink-0" />
              <span className="leading-relaxed">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid md:grid-cols-2 gap-4 mb-10">
        <Card>
          <CardBody>
            <div className="eyebrow mb-2 text-success">Recommended behavior</div>
            <p className="text-sm text-text-secondary leading-relaxed">{r.recommendedBehavior}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="eyebrow mb-2 text-danger">Anti-patterns</div>
            <ul className="space-y-2">
              {r.antiPatternBehaviors.map((p, i) => (
                <li key={i} className="flex gap-2 text-sm text-text-secondary">
                  <Icon name="x" size={12} className="text-danger mt-1 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </section>

      {r.relatedRulings.length > 0 && (
        <section className="pt-8 border-t border-border">
          <h2 className="text-xl font-semibold mb-3">Related rulings</h2>
          <ul className="flex flex-wrap gap-2">
            {r.relatedRulings.map((id) => (
              <Link key={id} href={`/rulings/${id}`} className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors">
                {id}
                <Icon name="arrow-up-right" size={10} />
              </Link>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
