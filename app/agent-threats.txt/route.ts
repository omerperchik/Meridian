import { listThreats } from "@/data/threats";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const active = listThreats({ status: "active" }).concat(listThreats({ status: "partial" }));
  const severe = active.filter((t) => t.severity === "critical" || t.severity === "high");
  const body = `# agent-threats.txt
# Daily snapshot of active Critical/High threats · ${new Date().toISOString().slice(0, 10)}
# Parseable without API key
# Full feed: ${SITE.url}/v1/threats
# Pattern updates: subscribe via ${SITE.url}/developers/api#webhooks

${severe
  .map(
    (t) => `THREAT ${t.id}
severity: ${t.severity}
cvss: ${t.cvss}
category: ${t.category}
title: ${t.title}
summary: ${t.summary}
pattern: ${t.pattern.replace(/\s+/g, " ").slice(0, 280)}
mitigations:
${t.mitigations.map((m) => `  - ${m}`).join("\n")}
status: ${t.status}
updated: ${t.lastUpdated}
ref: ${SITE.url}/threats/${t.id}
`,
  )
  .join("\n---\n\n")}

# End of agent-threats.txt
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
