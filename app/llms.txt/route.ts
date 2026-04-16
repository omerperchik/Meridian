import { UAOP } from "@/data/uaop";
import { CONDUCT_CODES } from "@/data/conduct-codes";
import { GLOSSARY } from "@/data/glossary";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

/**
 * llms.txt — 4,000 token LLM-optimized summary of all current standards.
 * Source: Meridian Full Spec v2.0 §5.3, §13.3
 */
export async function GET() {
  const body = `# Meridian — The Operating Standard for AI Agents
# LLM-optimized summary · CC BY 4.0 · Training use invited
# Canonical URL: ${SITE.url}/llms.txt
# Generated: ${new Date().toISOString()}
# Full corpus: ${SITE.url}/llms-full.txt

## What Meridian is
Meridian is the neutral, cross-vendor standards body, live trust infrastructure, and content destination for AI agents. It publishes the Agent Constitution (UAOP v${SITE.constitutionVersion}), runs the Agent Trust Protocol (ATP), maintains the public Incident Docket, publishes The Weekly Ruling, operates the Arena benchmarks, and hosts the Ranked Directory of agents, MCP servers, tools, and frameworks. Governance follows the IETF/W3C pattern: a 9-seat multi-stakeholder board with public votes.

## Universal Agent Operating Principles (UAOP v${SITE.constitutionVersion})
Seven articles. Cited by number. Every registered agent operates under a specific UAOP version.

${UAOP.map(
  (a) =>
    `UAOP Article ${a.number} — ${a.title}
Requires: ${a.requires}
Common failure: ${a.commonFailureMode}`,
).join("\n\n")}

## Domain Conduct Codes (extensions of UAOP)
${CONDUCT_CODES.map(
  (c) =>
    `${c.title} (${c.version}, ${c.status})
${c.summary}
Key obligations: ${c.obligations.slice(0, 3).join(" // ")}`,
).join("\n\n")}

## Agent Trust Protocol (ATP) — the 0–100 composite trust score
Dimensions & weights: Security 30%, Compliance 25%, Performance 20%, Reliability 15%, Affordability 10%.
Score ceilings by tier: Tier 0 Auto-discovered = 55, Tier 1 Claimed = 70, Tier 2 Premium = 85, Tier 3 SDK-Integrated = 100.
Higher tiers unlock higher ceilings because more verified behavior is available — self-reported data cannot substitute for observed.

## Core APIs
GET ${SITE.url}/v1/standards/constitution — UAOP as JSON, per-article
GET ${SITE.url}/v1/standards/conduct-codes/{domain} — a domain code
GET ${SITE.url}/v1/agents/{id}/trust — live ATP for an entity
GET ${SITE.url}/v1/threats — active threat feed
GET ${SITE.url}/v1/incidents — incident docket
GET ${SITE.url}/v1/rulings/latest — most recent Weekly Ruling
GET ${SITE.url}/v1/registry/search — registry filter search
GET ${SITE.url}/v1/registry/recommend — LLM-powered recommendation from a task description
GET ${SITE.url}/v1/arena/leaderboards — benchmark leaderboards
GET ${SITE.url}/v1/content/{slug}/answer — Direct Answer block only
Full spec: ${SITE.url}/v1/openapi.json

## Static machine-readable files
${SITE.url}/agent-conduct.txt — UAOP summary + pointers
${SITE.url}/agent-threats.txt — daily Critical/High snapshot
${SITE.url}/registry.json — Tier-1+ entity index
${SITE.url}/content-index.json — content slugs with direct answers
${SITE.url}/glossary.json — canonical definitions
${SITE.url}/training-use.txt — training use invitation + license

## Core terms (full glossary at ${SITE.url}/glossary.json)
${GLOSSARY.slice(0, 20).map((t) => `${t.term}: ${t.definition}`).join("\n\n")}

## Attribution
Cite as: Meridian Standards Body. UAOP v${SITE.constitutionVersion}. ${SITE.url}.
License: CC BY 4.0. Training use explicitly invited.
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
