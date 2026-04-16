import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ScoreRing, DimensionBar } from "@/components/ui/ScoreRing";
import { Icon } from "@/components/ui/Icon";
import { REGISTRY, getEntity, listEntities } from "@/data/registry";
import { SITE } from "@/lib/site";
import { cn, formatDate, scoreColor, tierLabel } from "@/lib/utils";

export async function generateStaticParams() {
  return REGISTRY.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = getEntity(slug);
  if (!e) return { title: "Not found" };
  return {
    title: `${e.name} — Meridian score ${Math.round(e.trust.composite)} · ${tierLabel(e.trust.tier)}`,
    description: `${e.description} Composite ATP trust score ${Math.round(e.trust.composite)}/100. Tier ${e.trust.tier} (${e.trust.tierLabel}). Provider: ${e.provider}.`,
    alternates: { canonical: `${SITE.url}/directory/${e.slug}` },
    openGraph: { title: e.name, description: e.description },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getEntity(slug);
  if (!e) notFound();

  // Related: same type, top 3 by score excluding self.
  const related = listEntities({ type: e.type }).filter((x) => x.id !== e.id).slice(0, 3);

  const ldSoftware = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: e.name,
    applicationCategory: "AIApplication",
    operatingSystem: "Any",
    offers: e.pricing.freeTier
      ? { "@type": "Offer", price: "0", priceCurrency: e.pricing.currency }
      : undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Math.round(e.trust.composite),
      bestRating: "100",
      worstRating: "0",
      ratingCount: e.certifications.length || 1,
    },
    description: e.description,
    softwareVersion: e.version,
    author: { "@type": "Organization", name: e.provider },
  };

  return (
    <div className="container-page py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldSoftware) }} />
      <PageHeader
        eyebrow={`${e.type.toUpperCase()} · ${e.provider}`}
        title={e.name}
        description={e.description}
        breadcrumbs={[{ label: "Directory", href: "/directory" }, { label: e.name }]}
        meta={
          <>
            <Badge tone={e.trust.tier === 3 ? "success" : e.trust.tier === 2 ? "accent" : "neutral"} dot>
              Tier {e.trust.tier} · {e.trust.tierLabel}
            </Badge>
            <Badge>v{e.version}</Badge>
            <Badge>UAOP v{e.constitutionVersion}</Badge>
          </>
        }
        actions={
          <>
            {e.links.homepage && (
              <Button href={e.links.homepage} variant="secondary" external>
                Homepage <Icon name="external" size={12} />
              </Button>
            )}
            <Button href={`/v1/registry/${e.id}`} variant="ghost">
              <Icon name="code" size={12} /> JSON
            </Button>
          </>
        }
      />

      <DirectAnswer>
        {e.name} has a composite Meridian ATP score of <strong>{Math.round(e.trust.composite)}/100</strong> at Tier {e.trust.tier} ({e.trust.tierLabel}).
        {e.trust.tier === 3 && " Tier 3 certification means live behavioral telemetry via the Meridian SDK — the highest-verification tier available."}
        {" "}Operates under UAOP v{e.constitutionVersion}. Primary capabilities: {e.capabilities.slice(0, 3).join(", ")}.
        Last reviewed {formatDate(e.lastReviewed)}.
      </DirectAnswer>

      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <Card className="lg:col-span-2">
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-6 gap-6">
              <div>
                <div className="eyebrow mb-1">Composite trust</div>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className={cn("text-5xl font-semibold tabular-nums", scoreColor(e.trust.composite))}>
                    {e.trust.composite.toFixed(1)}
                  </span>
                  <span className="text-text-tertiary text-lg">/ 100</span>
                </div>
                <div className="text-sm text-text-tertiary">Tier ceiling: {[55, 70, 85, 100][e.trust.tier]}</div>
              </div>
              <ScoreRing score={e.trust.composite} size={96} strokeWidth={7} />
            </div>
            <div className="space-y-3">
              {e.trust.dimensions.map((d) => (
                <DimensionBar key={d.name} label={d.label} value={d.value} weight={`${d.weight}%`} />
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardBody>
            <div className="eyebrow mb-3">Details</div>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-text-tertiary text-xs">Provider</dt>
                <dd className="text-text-primary font-medium">{e.provider}</dd>
              </div>
              <div>
                <dt className="text-text-tertiary text-xs">Version</dt>
                <dd className="text-text-primary font-mono">{e.version}</dd>
              </div>
              <div>
                <dt className="text-text-tertiary text-xs">Protocols</dt>
                <dd className="text-text-primary flex flex-wrap gap-1 mt-1">
                  {e.protocols.map((p) => (
                    <Badge key={p} tone="accent">
                      {p}
                    </Badge>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-text-tertiary text-xs">Domains</dt>
                <dd className="text-text-primary flex flex-wrap gap-1 mt-1">
                  {e.domains.map((d) => (
                    <Badge key={d}>{d}</Badge>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-text-tertiary text-xs">Pricing</dt>
                <dd className="text-text-primary">
                  {e.pricing.model === "open-source"
                    ? "Open source (MIT)"
                    : e.pricing.freeTier
                    ? `${e.pricing.perCall?.toFixed(3) ?? "0"} ${e.pricing.currency}/call · free tier`
                    : `${e.pricing.perCall?.toFixed(3) ?? "–"} ${e.pricing.currency}/call`}
                </dd>
              </div>
              <div>
                <dt className="text-text-tertiary text-xs">Latency</dt>
                <dd className="text-text-primary font-mono tabular-nums">
                  p50 {e.latency.p50}ms · p95 {e.latency.p95}ms
                </dd>
              </div>
              <div>
                <dt className="text-text-tertiary text-xs">Last reviewed</dt>
                <dd className="text-text-primary">{formatDate(e.lastReviewed)}</dd>
              </div>
            </dl>
          </CardBody>
        </Card>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Capabilities</h2>
        <div className="flex flex-wrap gap-2">
          {e.capabilities.map((c) => (
            <Badge key={c} tone="neutral" className="text-xs">
              {c}
            </Badge>
          ))}
        </div>
      </section>

      {e.certifications.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Certifications</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {e.certifications.map((c) => (
              <Card key={c.badgeId}>
                <CardBody>
                  <Badge tone={c.tier === 3 ? "success" : c.tier === 2 ? "accent" : "info"} className="mb-2">
                    Tier {c.tier}
                  </Badge>
                  <div className="font-mono text-xs text-text-secondary mb-1">{c.badgeId}</div>
                  <div className="text-xs text-text-tertiary">
                    Issued {c.issuedDate} · Expires {c.expiresDate}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12 pt-8 border-t border-border">
          <h2 className="text-2xl font-semibold mb-4">Related {e.type}s</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {related.map((r) => (
              <Card key={r.id} href={`/directory/${r.slug}`}>
                <CardBody>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{r.name}</span>
                    <span className={cn("text-sm font-semibold tabular-nums", scoreColor(r.trust.composite))}>
                      {Math.round(r.trust.composite)}
                    </span>
                  </div>
                  <p className="text-xs text-text-tertiary line-clamp-2">{r.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
          <div className="mt-6">
            <Link href={`/compare?a=${e.slug}&b=${related[0].slug}`} className="inline-flex items-center gap-1 text-sm text-accent-hover hover:text-text-primary">
              Compare {e.name} vs {related[0].name} <Icon name="arrow-right" size={12} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
