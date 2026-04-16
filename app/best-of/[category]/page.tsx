import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { EntityList } from "@/components/layout/EntityList";
import { listEntities } from "@/data/registry";
import { CATEGORIES } from "@/lib/categories";
import { SITE } from "@/lib/site";

/**
 * Programmatic "best [category] [for use case]" pages.
 * Categories live in lib/categories.ts (imported also by /best-of index and sitemap).
 * Spec §15.3 targets 10,000+ such pages at full registry scale.
 */

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const c = CATEGORIES.find((x) => x.slug === category);
  if (!c) return { title: "Not found" };
  return {
    title: `Best ${c.label.toLowerCase()} — 2026`,
    description: `Live ranking of top-scoring ${c.label.toLowerCase()} for ${c.useCase}. ATP trust scores, capability match, benchmark results.`,
    alternates: { canonical: `${SITE.url}/best-of/${c.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = CATEGORIES.find((x) => x.slug === category);
  if (!c) notFound();
  const filter: any = { type: c.type };
  if ("domain" in c && c.domain) filter.domain = c.domain;
  if ("capability" in c && (c as any).capability) filter.capability = (c as any).capability;
  const entities = listEntities(filter);

  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Best of · 2026"
        title={`Best ${c.label}`}
        description={`Live ranking for ${c.useCase}. Updated automatically as scores change.`}
        breadcrumbs={[{ label: "Best of", href: "/best-of" }, { label: c.label }]}
      />
      <DirectAnswer>
        Top-scoring {c.label.toLowerCase()} as of today, ranked by ATP composite and filtered to the declared
        capability/domain.{" "}
        {entities[0] && `${entities[0].name} leads at ${Math.round(entities[0].trust.composite)} (Tier ${entities[0].trust.tier}).`}{" "}
        Rankings update in real time as scores change.
      </DirectAnswer>
      <EntityList entities={entities} />
    </div>
  );
}
