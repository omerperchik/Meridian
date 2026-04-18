/**
 * Conduct code badge (e.g., "Finance Conduct Code v1.1.0").
 */
import { CONDUCT_CODES, getConductCode } from "@/data/conduct-codes";
import { flatBadge, svgResponse, COLORS } from "@/lib/badge";

export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams() {
  return CONDUCT_CODES.map((c) => ({ domain: c.domain }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const clean = domain.replace(/\.svg$/i, "");
  const c = getConductCode(clean);
  if (!c)
    return svgResponse(
      flatBadge({ label: "meridian", value: `${clean} (unknown)`, color: COLORS.tier0 }),
    );
  const color =
    c.status === "launched" ? COLORS.score.excellent : c.status === "draft" ? COLORS.score.okay : COLORS.tier0;
  return svgResponse(
    flatBadge({
      label: `${clean} code`,
      value: c.version,
      color,
    }),
  );
}
