import { NextResponse } from "next/server";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

/**
 * OpenAPI 3.1 specification for the Meridian REST API v1.
 * Source: Meridian Full Spec v2.0 §13.1
 */
export async function GET() {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: "Meridian API",
      version: "v1",
      description:
        "The canonical programmatic surface for the Meridian standards body. Standards, registry, trust scores, threat intelligence, incidents, rulings, benchmarks, scanner, and content.",
      contact: { name: SITE.author, url: SITE.url, email: SITE.email },
      license: { name: "CC BY 4.0", url: `${SITE.url}/training-use.txt` },
    },
    servers: [{ url: `${SITE.url}/v1`, description: "Production" }],
    security: [{ apiKey: [] }],
    components: {
      securitySchemes: {
        apiKey: { type: "apiKey", in: "header", name: "Authorization" },
      },
    },
    paths: {
      "/standards/constitution": {
        get: {
          summary: "Get the current UAOP Constitution",
          tags: ["Standards"],
          responses: { "200": { description: "Full UAOP in structured JSON with per-article objects" } },
        },
      },
      "/standards/conduct-codes/{domain}": {
        get: {
          summary: "Get a domain conduct code",
          tags: ["Standards"],
          parameters: [{ name: "domain", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Domain conduct code" } },
        },
      },
      "/standards/changelog": {
        get: { summary: "Standards version history", tags: ["Standards"], responses: { "200": { description: "Full version history" } } },
      },
      "/agents/{id}/trust": {
        get: {
          summary: "Get live ATP trust score",
          tags: ["Trust"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "ATP score with dimension breakdown" } },
        },
      },
      "/agents/{id}/trust/history": {
        get: {
          summary: "Get score history",
          tags: ["Trust"],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
            { name: "days", in: "query", schema: { type: "integer", default: 90, maximum: 365 } },
          ],
          responses: { "200": { description: "Score time series" } },
        },
      },
      "/trust/feed": {
        get: { summary: "Real-time feed of score changes", tags: ["Trust"], responses: { "200": { description: "Feed" } } },
      },
      "/threats": {
        get: {
          summary: "Active threat feed",
          tags: ["Threats"],
          parameters: [
            { name: "severity", in: "query", schema: { type: "string", enum: ["critical", "high", "medium", "low"] } },
            { name: "category", in: "query", schema: { type: "string" } },
            { name: "status", in: "query", schema: { type: "string" } },
          ],
          responses: { "200": { description: "Threat feed" } },
        },
      },
      "/threats/{id}": {
        get: {
          summary: "Full threat record",
          tags: ["Threats"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Threat record" } },
        },
      },
      "/incidents": {
        get: {
          summary: "Incident docket — filter by type, status, severity, date",
          tags: ["Incidents"],
          responses: { "200": { description: "Incident list" } },
        },
        post: { summary: "Submit a new incident report", tags: ["Incidents"], responses: { "201": { description: "Submitted" } } },
      },
      "/incidents/{id}": {
        get: {
          summary: "Full incident record",
          tags: ["Incidents"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Incident record" } },
        },
      },
      "/rulings/latest": {
        get: { summary: "Most recent Weekly Ruling", tags: ["Rulings"], responses: { "200": { description: "Ruling" } } },
      },
      "/rulings": {
        get: {
          summary: "Rulings archive — semantic search via ?search=",
          tags: ["Rulings"],
          responses: { "200": { description: "Ruling list" } },
        },
      },
      "/rulings/{id}": {
        get: {
          summary: "Full ruling record",
          tags: ["Rulings"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Ruling" } },
        },
      },
      "/registry/search": {
        get: {
          summary: "Agent discovery — filter by capability, domain, protocol, trust floor",
          tags: ["Registry"],
          parameters: [
            { name: "capabilities", in: "query", schema: { type: "string" } },
            { name: "domain", in: "query", schema: { type: "string" } },
            { name: "protocol", in: "query", schema: { type: "string" } },
            { name: "min_trust", in: "query", schema: { type: "integer" } },
            { name: "type", in: "query", schema: { type: "string", enum: ["agent", "mcp", "tool", "framework"] } },
          ],
          responses: { "200": { description: "Registry search results" } },
        },
      },
      "/registry/{id}": {
        get: {
          summary: "Full agent card with live trust score",
          tags: ["Registry"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Agent card" } },
        },
      },
      "/registry/leaderboard": {
        get: {
          summary: "Category leaderboard",
          tags: ["Registry"],
          parameters: [
            { name: "category", in: "query", schema: { type: "string" } },
            { name: "entity_type", in: "query", schema: { type: "string" } },
          ],
          responses: { "200": { description: "Leaderboard" } },
        },
      },
      "/arena/leaderboards": {
        get: { summary: "Benchmark leaderboards by suite and domain", tags: ["Arena"], responses: { "200": { description: "Leaderboards" } } },
      },
      "/arena/submit": {
        post: { summary: "Submit an entity for benchmark evaluation", tags: ["Arena"], responses: { "202": { description: "Accepted for async run" } } },
      },
      "/scanner/lite": {
        post: { summary: "Submit content for a lite scan", tags: ["Scanner"], responses: { "202": { description: "Scan queued" } } },
      },
      "/scanner/results/{scan_id}": {
        get: {
          summary: "Scanner results",
          tags: ["Scanner"],
          parameters: [{ name: "scan_id", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Scan results" } },
        },
      },
      "/content/search": {
        get: { summary: "Semantic search across all editorial content", tags: ["Content"], responses: { "200": { description: "Results" } } },
      },
      "/content/{slug}": {
        get: {
          summary: "Full article in structured JSON with Direct Answer block",
          tags: ["Content"],
          parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Article" } },
        },
      },
      "/content/{slug}/answer": {
        get: {
          summary: "Direct Answer block only (<200 tokens)",
          tags: ["Content"],
          parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Direct Answer" } },
        },
      },
      "/content/glossary/{term}": {
        get: {
          summary: "Canonical definition for a glossary term",
          tags: ["Content"],
          parameters: [{ name: "term", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Glossary term" } },
        },
      },
      "/briefing/today": {
        get: { summary: "Today's daily briefing", tags: ["Briefing"], responses: { "200": { description: "Briefing" } } },
      },
    },
  };

  return NextResponse.json(spec, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
