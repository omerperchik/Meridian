/**
 * UAOP version badge (e.g., "UAOP v1.0.0").
 * Any version string is accepted — we don't 404 on unknown versions because
 * operators often pin to pre-release tags in their README.
 */
import { flatBadge, svgResponse, COLORS } from "@/lib/badge";

export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams() {
  return [{ version: "1.0.0" }, { version: "1.0.1" }, { version: "1.0.0.svg" }, { version: "1.0.1.svg" }];
}

export async function GET(_req: Request, { params }: { params: Promise<{ version: string }> }) {
  const { version } = await params;
  const clean = version.replace(/\.svg$/i, "");
  return svgResponse(
    flatBadge({
      label: "UAOP",
      value: `v${clean}`,
      color: COLORS.accent,
    }),
  );
}
