import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ScoreRing, DimensionBar } from "@/components/ui/ScoreRing";
import { Icon } from "@/components/ui/Icon";
import { REGISTRY, getEntity } from "@/data/registry";
import { listThreats } from "@/data/threats";
import { SITE } from "@/lib/site";
import { cn, scoreColor, formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  return REGISTRY.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = getEntity(slug);
  if (!e) return { title: "Not found" };
  return {
    title: `${e.name} security assessment — Meridian audit`,
    description: `${e.name} security score ${Math.round(e.trust.dimensions[0].value)}/100. Active CVEs, last audit date, risk summary, remediation guidance.`,
    alternates: { canonical: `${SITE.url}/security-assessment/${e.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getEntity(slug);
  if (!e) notFound();

  const sec = e.trust.dimensions.find((d) => d.name === "security")!;
  const relevantThreats = listThreats({}).filter((t) => t.affectedEntities.includes(e.slug));
  const lastCert = e.certifications[0];

  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow={`${e.type.toUpperCase()} · Security assessment`}
        title={`${e.name} security assessment`}
        description="Automatically updated when the underlying entity or threat landscape changes."
        breadcrumbs={[{ label: e.name, href: `/directory/${e.slug}` }, { label: "Security assessment" }]}
        actions={
          <Button href={`/directory/${e.slug}`} variant="secondary" size="sm">
            Full profile
          </Button>
        }
      />

      <DirectAnswer>
        {e.name} has a Meridian security score of <strong>{Math.round(sec.value)}/100</strong> at Tier {e.trust.tier}. {relevantThreats.length === 0
          ? "No currently-active Critical/High threats reference this entity."
          : `${relevantThreats.length} currently-active Critical/High threat${relevantThreats.length === 1 ? "" : "s"} reference this entity.`}{" "}
        Last reviewed {formatDate(e.lastReviewed)}. Recommended for {e.trust.tier >= 2 ? "regulated deployments" : "non-production or exploratory use"}.
      </DirectAnswer>

      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        <Card>
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-5 mb-5">
              <ScoreRing score={sec.value} size={88} strokeWidth={7} label="Security" />
              <div>
                <div className="eyebrow mb-1">Security dimension</div>
                <div className={cn("text-4xl font-semibold tabular-nums", scoreColor(sec.value))}>{sec.value.toFixed(1)}</div>
                <div className="text-xs text-text-tertiary">Weight 30% of ATP composite</div>
              </div>
            </div>
            <ul className="space-y-1.5 text-sm text-text-secondary">
              {sec.inputs.map((inp) => (
                <li key={inp} className="flex gap-2">
                  <Icon name="check" size={12} className="text-success mt-1 shrink-0" />
                  <span>{inp}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
        <Card>
          <CardBody>
            <div className="eyebrow mb-2">Last certification</div>
            {lastCert ? (
              <>
                <Badge tone={lastCert.tier === 3 ? "success" : lastCert.tier === 2 ? "accent" : "info"} className="mb-2">
                  Tier {lastCert.tier}
                </Badge>
                <div className="font-mono text-sm text-text-primary mb-1">{lastCert.badgeId}</div>
                <div className="text-xs text-text-tertiary">Issued {formatDate(lastCert.issuedDate)} · Expires {formatDate(lastCert.expiresDate)}</div>
              </>
            ) : (
              <div className="text-sm text-text-tertiary">No certification on record. Auto-discovered at Tier 0.</div>
            )}

            <div className="mt-5 eyebrow mb-2">Pricing / Latency</div>
            <div className="text-sm text-text-secondary">{e.pricing.model} · p50 {e.latency.p50}ms · p95 {e.latency.p95}ms</div>
          </CardBody>
        </Card>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Active threat exposure</h2>
        {relevantThreats.length === 0 ? (
          <Card>
            <CardBody>
              <div className="flex items-center gap-3 text-text-secondary">
                <Icon name="shield" size={18} className="text-success" />
                <span>No currently-active Critical or High-severity threats reference this entity.</span>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {relevantThreats.map((t) => (
              <Card key={t.id} href={`/threats/${t.id}`}>
                <CardBody>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge tone={t.severity === "critical" ? "danger" : "warning"} dot>
                      {t.severity.toUpperCase()}
                    </Badge>
                    <span className="font-mono text-2xs text-text-tertiary">{t.id}</span>
                  </div>
                  <h3 className="text-base font-medium line-clamp-2 mb-1">{t.title}</h3>
                  <p className="text-xs text-text-tertiary line-clamp-2">{t.summary}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Remediation guidance</h2>
        <ul className="space-y-2.5">
          {[
            "Subscribe to webhooks for score changes on this entity.",
            "Pin the exact version you audited; version updates trigger mandatory re-review.",
            "If deploying in a regulated domain, require Tier 2+ or Tier 3 certification.",
            "Consider adding the Meridian SDK compliance-monitor middleware if you operate this entity yourself.",
          ].map((r, i) => (
            <li key={i} className="flex gap-3 text-text-secondary">
              <Icon name="check" size={14} className="text-accent-hover mt-1 shrink-0" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
