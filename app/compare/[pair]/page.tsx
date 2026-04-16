import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ScoreRing, DimensionBar } from "@/components/ui/ScoreRing";
import { REGISTRY, getEntity } from "@/data/registry";
import { SITE } from "@/lib/site";
import { cn, scoreColor } from "@/lib/utils";

/**
 * Programmatic comparison pages. Spec §15.3 targets 50,000+ of these.
 * At N = {REGISTRY.length} entities we generate N*(N-1)/2 deduped pairs.
 */
export async function generateStaticParams() {
  const pairs: Array<{ pair: string }> = [];
  for (let i = 0; i < REGISTRY.length; i++) {
    for (let j = i + 1; j < REGISTRY.length; j++) {
      pairs.push({ pair: `${REGISTRY[i].slug}-vs-${REGISTRY[j].slug}` });
    }
  }
  return pairs;
}

function splitPair(pair: string): [string, string] | null {
  const idx = pair.indexOf("-vs-");
  if (idx < 0) return null;
  return [pair.slice(0, idx), pair.slice(idx + 4)];
}

export async function generateMetadata({ params }: { params: Promise<{ pair: string }> }): Promise<Metadata> {
  const { pair } = await params;
  const split = splitPair(pair);
  if (!split) return { title: "Not found" };
  const [a, b] = split.map(getEntity);
  if (!a || !b) return { title: "Not found" };
  return {
    title: `${a.name} vs ${b.name} — Meridian trust score comparison`,
    description: `Head-to-head ATP comparison: ${a.name} (score ${Math.round(a.trust.composite)}) vs ${b.name} (score ${Math.round(b.trust.composite)}). Benchmark overlap, pricing delta, security breakdown.`,
    alternates: { canonical: `${SITE.url}/compare/${pair}` },
  };
}

export default async function Page({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const split = splitPair(pair);
  if (!split) notFound();
  const [a, b] = split.map(getEntity);
  if (!a || !b) notFound();

  const ldItems = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [a, b].map((e, i) => ({
      "@type": "SoftwareApplication",
      position: i + 1,
      name: e!.name,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: Math.round(e!.trust.composite),
        bestRating: "100",
      },
    })),
  };

  const winner = a!.trust.composite >= b!.trust.composite ? a! : b!;

  return (
    <div className="container-page py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldItems) }} />
      <PageHeader
        eyebrow="Comparison"
        title={`${a!.name} vs ${b!.name}`}
        description="Head-to-head comparison across ATP trust dimensions, certifications, pricing, and latency."
        breadcrumbs={[{ label: "Directory", href: "/directory" }, { label: `${a!.name} vs ${b!.name}` }]}
      />

      <DirectAnswer>
        {winner.name} has the higher composite ATP trust score at {Math.round(winner.trust.composite)} versus{" "}
        {(winner.id === a!.id ? b : a)!.name}'s {Math.round((winner.id === a!.id ? b : a)!.trust.composite)}. Both
        operate under UAOP v{a!.constitutionVersion}. Pick the one whose dimension profile best matches your deployment's
        priority — security for regulated, affordability for high-volume, performance for latency-critical.
      </DirectAnswer>

      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        {[a, b].map((e) => (
          <Card key={e!.id}>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-3">
                <Badge tone={e!.trust.tier === 3 ? "success" : e!.trust.tier === 2 ? "accent" : "neutral"}>
                  Tier {e!.trust.tier}
                </Badge>
                <Badge>v{e!.version}</Badge>
              </div>
              <h2 className="text-2xl font-semibold mb-1">{e!.name}</h2>
              <div className="text-sm text-text-tertiary mb-4">{e!.provider}</div>
              <div className="flex items-center gap-4 mb-5">
                <ScoreRing score={e!.trust.composite} size={80} strokeWidth={6} />
                <div>
                  <div className="eyebrow mb-1">Composite</div>
                  <div className={cn("text-4xl font-semibold tabular-nums", scoreColor(e!.trust.composite))}>
                    {e!.trust.composite.toFixed(1)}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {e!.trust.dimensions.map((d) => (
                  <DimensionBar key={d.name} label={d.label} value={d.value} weight={`${d.weight}%`} />
                ))}
              </div>
              <Button href={`/directory/${e!.slug}`} variant="secondary" size="sm" className="mt-5">
                Full profile
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Dimension-by-dimension</h2>
        <Card>
          <div className="divide-y divide-border">
            {a!.trust.dimensions.map((da, i) => {
              const db = b!.trust.dimensions[i];
              const lead = da.value > db.value ? a : b;
              const gap = Math.abs(da.value - db.value);
              return (
                <div key={da.name} className="p-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-text-tertiary">{a!.name}</div>
                    <div className={cn("font-mono text-lg font-semibold tabular-nums", scoreColor(da.value))}>
                      {da.value.toFixed(1)}
                    </div>
                  </div>
                  <div className="text-center min-w-32">
                    <div className="eyebrow mb-1">{da.label}</div>
                    <div className="text-2xs text-text-quaternary">
                      {lead === a ? "← " : ""}Δ {gap.toFixed(1)}{lead === b ? " →" : ""}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-tertiary">{b!.name}</div>
                    <div className={cn("font-mono text-lg font-semibold tabular-nums", scoreColor(db.value))}>
                      {db.value.toFixed(1)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Specs</h2>
        <Card>
          <div className="divide-y divide-border">
            {[
              ["Pricing model", a!.pricing.model, b!.pricing.model],
              ["Per-call (USD)", a!.pricing.perCall?.toFixed(3) ?? "—", b!.pricing.perCall?.toFixed(3) ?? "—"],
              ["Latency p50", `${a!.latency.p50}ms`, `${b!.latency.p50}ms`],
              ["Latency p95", `${a!.latency.p95}ms`, `${b!.latency.p95}ms`],
              ["Protocols", a!.protocols.join(", "), b!.protocols.join(", ")],
              ["Domains", a!.domains.join(", "), b!.domains.join(", ")],
            ].map(([label, va, vb]) => (
              <div key={label} className="p-4 grid grid-cols-3 gap-4 items-center text-sm">
                <div className="text-text-tertiary">{label}</div>
                <div className="text-text-primary text-right font-mono">{va}</div>
                <div className="text-text-primary text-right font-mono">{vb}</div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
