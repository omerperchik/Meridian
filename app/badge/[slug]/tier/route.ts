/**
 * Tier badge (e.g., "Meridian Tier 3 · SDK Integrated").
 * Colors match the certification tier.
 */
import { REGISTRY, getEntity } from "@/data/registry";
import { flatBadge, svgResponse, tierColor, COLORS } from "@/lib/badge";

export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams() {
  return REGISTRY.map((e) => ({ slug: e.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getEntity(slug.replace(/\.svg$/i, ""));
  if (!e)
    return svgResponse(flatBadge({ label: "meridian", value: "unlisted", color: COLORS.tier0 }));
  const label = e.trust.tierLabel.toLowerCase();
  return svgResponse(
    flatBadge({
      label: "meridian tier",
      value: `${e.trust.tier} · ${label}`,
      color: tierColor(e.trust.tier),
    }),
  );
}
