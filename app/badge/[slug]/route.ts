/**
 * Default badge: Meridian ATP score (e.g., "Meridian ATP: 92").
 *
 * Example:   ![Meridian](https://meridian.ai/badge/atlas-finance.svg)
 * Variant:   ?style=flat (default)
 *
 * Unknown slugs get a neutral "unlisted" badge rather than a 404 — avoids
 * broken image icons in READMEs when a slug is retired.
 */
import { REGISTRY, getEntity } from "@/data/registry";
import { flatBadge, svgResponse, scoreColor, COLORS } from "@/lib/badge";

export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams() {
  return REGISTRY.map((e) => ({ slug: `${e.slug}.svg` }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const clean = slug.replace(/\.svg$/i, "");
  const e = getEntity(clean);
  if (!e) {
    return svgResponse(flatBadge({ label: "meridian", value: "unlisted", color: COLORS.tier0 }));
  }
  const score = Math.round(e.trust.composite);
  return svgResponse(
    flatBadge({
      label: "meridian atp",
      value: String(score),
      color: scoreColor(score),
    }),
  );
}
