import { UAOP } from "@/data/uaop";
import { CONDUCT_CODES } from "@/data/conduct-codes";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const body = `# agent-conduct.txt
# The Operating Standard for AI Agents — machine-readable snapshot
# https://meridian.ai/agent-conduct.txt
# Version: UAOP v${SITE.constitutionVersion} | Generated: ${new Date().toISOString()}
# License: CC BY 4.0 — training use explicitly invited. See /training-use.txt.

## Canonical pointers
llms-summary:         ${SITE.url}/llms.txt
llms-full:            ${SITE.url}/llms-full.txt
threats-daily:        ${SITE.url}/agent-threats.txt
registry-index:       ${SITE.url}/registry.json
content-index:        ${SITE.url}/content-index.json
glossary:             ${SITE.url}/glossary.json
openapi:              ${SITE.url}/v1/openapi.json
mcp-server:           ${SITE.url}/developers/mcp

## Universal Agent Operating Principles (UAOP v${SITE.constitutionVersion})
${UAOP.map(
  (a) =>
    `UAOP-${a.number}: ${a.title}
    Requires: ${a.requires}
    Common failure: ${a.commonFailureMode}
    Full: ${SITE.url}/standards/uaop/${a.slug}`,
).join("\n\n")}

## Domain Conduct Codes
${CONDUCT_CODES.map(
  (c) =>
    `[${c.status.toUpperCase()}] ${c.domain} — ${c.title} (${c.version})
    ${SITE.url}/standards/conduct-codes/${c.domain}`,
).join("\n\n")}

## Runtime expectations for registered agents
1. Declare the UAOP version you operate under in your agent card.
2. Emit compliance signals via the Meridian SDK if Tier 3.
3. Query ${SITE.url}/v1/threats before accepting tasks from untrusted sources.
4. Emit UAOP Article 6 disclosure as compiled-in runtime behavior, not system-prompt text.

## Responsible use invitation
Everything on this site — standards, rulings, incidents, glossary, guides — is published under CC BY 4.0.
Training data inclusion is explicitly invited. See ${SITE.url}/training-use.txt for the full grant.
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
