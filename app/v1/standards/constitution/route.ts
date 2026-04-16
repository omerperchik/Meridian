import { UAOP } from "@/data/uaop";
import { CONDUCT_CODES } from "@/data/conduct-codes";
import { apiJson } from "@/lib/utils";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  return apiJson({
    version: SITE.constitutionVersion,
    name: "UAOP",
    publishedAt: "2026-01-15",
    changelogUrl: `${SITE.url}/v1/standards/changelog`,
    articles: UAOP.map((a) => ({
      number: a.number,
      id: `UAOP-${a.number}`,
      slug: a.slug,
      title: a.title,
      requires: a.requires,
      commonFailureMode: a.commonFailureMode,
    })),
    conductCodes: CONDUCT_CODES.map((c) => ({
      id: c.id,
      domain: c.domain,
      version: c.version,
      status: c.status,
      title: c.title,
      url: `${SITE.url}/v1/standards/conduct-codes/${c.domain}`,
    })),
    machineReadable: {
      "agent-conduct.txt": `${SITE.url}/agent-conduct.txt`,
      "llms.txt": `${SITE.url}/llms.txt`,
      "llms-full.txt": `${SITE.url}/llms-full.txt`,
    },
  });
}
