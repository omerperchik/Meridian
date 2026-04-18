/**
 * Full Meridian composite badge — 380x92, signature card with logo, name, score
 * ring, UAOP version, and tier chip. Meant for "About" pages, footers, pitch
 * decks, LinkedIn, not inline README.
 */
import { REGISTRY, getEntity } from "@/data/registry";
import { fullBadge, svgResponse } from "@/lib/badge";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams() {
  return REGISTRY.map((e) => ({ slug: e.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getEntity(slug.replace(/\.svg$/i, ""));
  if (!e) return new Response("Not Found", { status: 404 });
  return svgResponse(
    fullBadge({
      name: e.name,
      score: e.trust.composite,
      tier: e.trust.tier,
      tierLabel: e.trust.tierLabel,
      version: e.version,
      uaopVersion: e.constitutionVersion || SITE.constitutionVersion,
    }),
  );
}
