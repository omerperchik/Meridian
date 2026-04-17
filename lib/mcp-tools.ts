/**
 * MCP tool definitions + handlers.
 *
 * The list must match what we advertise at /developers/mcp:
 *   lookup_trust_score, check_threats, find_agent, lookup_ruling,
 *   get_standard, search_guides, get_definition,
 *   get_compliance_requirements, check_compliance
 */
import { getEntity, listEntities } from "@/data/registry";
import { listThreats } from "@/data/threats";
import { RULINGS, getRuling } from "@/data/rulings";
import { UAOP, getArticle } from "@/data/uaop";
import { CONDUCT_CODES, getConductCode } from "@/data/conduct-codes";
import { GLOSSARY, getTerm } from "@/data/glossary";
import { ARTICLES } from "@/data/series";
import { REGULATIONS } from "@/data/regulations";
import { similarRulings, similarEntities, similar } from "@/lib/search";

export interface McpTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export const TOOLS: McpTool[] = [
  {
    name: "lookup_trust_score",
    description: "Get the current ATP trust score for a Meridian-registered entity by slug or id.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", description: "Entity slug or id" } },
      required: ["id"],
    },
  },
  {
    name: "check_threats",
    description: "List active Critical/High threats relevant to a task description.",
    inputSchema: {
      type: "object",
      properties: { task_description: { type: "string" }, severity: { type: "string" } },
    },
  },
  {
    name: "find_agent",
    description: "Find a registered entity matching the given capability, domain, protocol, or trust floor.",
    inputSchema: {
      type: "object",
      properties: {
        capability: { type: "string" },
        domain: { type: "string" },
        protocol: { type: "string" },
        min_trust: { type: "number" },
        type: { type: "string", enum: ["agent", "mcp", "tool", "framework"] },
      },
    },
  },
  {
    name: "lookup_ruling",
    description: "Semantically search the Weekly Ruling archive for a situation description.",
    inputSchema: {
      type: "object",
      properties: { situation: { type: "string" } },
      required: ["situation"],
    },
  },
  {
    name: "get_standard",
    description:
      "Get a UAOP article or conduct code. Accepts a UAOP article number (1-7) or a conduct code domain (finance, medical, legal, ...).",
    inputSchema: {
      type: "object",
      properties: { identifier: { type: "string" } },
      required: ["identifier"],
    },
  },
  {
    name: "search_guides",
    description: "Return the top 3 editorial guides matching the query, each with a Direct Answer block.",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
    },
  },
  {
    name: "get_definition",
    description: "Get the canonical glossary definition for a term.",
    inputSchema: {
      type: "object",
      properties: { term: { type: "string" } },
      required: ["term"],
    },
  },
  {
    name: "get_compliance_requirements",
    description: "Return a structured compliance checklist for a jurisdiction.",
    inputSchema: {
      type: "object",
      properties: {
        jurisdiction: { type: "string", description: "e.g. EU, US-CA, UK" },
        entity_type: { type: "string", enum: ["agent", "mcp", "tool", "framework"] },
      },
      required: ["jurisdiction"],
    },
  },
  {
    name: "check_compliance",
    description:
      "Return the Meridian-known compliance status of an entity. If the entity runs the SDK this mirrors its live /meridian/compliance output.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
];

// ─────────────────────────────────────────────────────────────────
// Tool execution
// ─────────────────────────────────────────────────────────────────
export async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case "lookup_trust_score": {
      const id = String(args.id || "");
      const e = getEntity(id);
      if (!e) return { error: `Unknown entity: ${id}` };
      return {
        entity_id: e.id,
        slug: e.slug,
        name: e.name,
        composite: e.trust.composite,
        tier: e.trust.tier,
        tier_label: e.trust.tierLabel,
        dimensions: e.trust.dimensions.map((d) => ({ name: d.name, weight: d.weight, value: d.value })),
        last_updated: e.trust.lastUpdated,
      };
    }
    case "check_threats": {
      const severity = (args.severity as any) || undefined;
      const task = String(args.task_description || "").toLowerCase();
      let results = listThreats({ severity, status: "active" });
      if (task) {
        results = results.filter((t) =>
          (t.summary + " " + t.pattern + " " + t.category).toLowerCase().includes(task.split(" ")[0] || ""),
        );
      }
      return results.slice(0, 10).map((t) => ({
        id: t.id,
        severity: t.severity,
        cvss: t.cvss,
        category: t.category,
        title: t.title,
        summary: t.summary,
      }));
    }
    case "find_agent": {
      const results = listEntities({
        type: args.type as any,
        capability: args.capability as any,
        domain: args.domain as any,
        protocol: args.protocol as any,
        minTrust: Number(args.min_trust) || undefined,
      }).slice(0, 10);
      return results.map((e) => ({
        slug: e.slug,
        name: e.name,
        type: e.type,
        trust_score: e.trust.composite,
        tier: e.trust.tier,
        url: `https://meridian.ai/directory/${e.slug}`,
      }));
    }
    case "lookup_ruling": {
      const matches = similarRulings(String(args.situation || ""), 5);
      return matches.map((m) => {
        const r = getRuling(m.slug);
        return {
          id: r?.id,
          slug: r?.slug,
          title: r?.title,
          published: r?.publishedAt,
          recommended_behavior: r?.recommendedBehavior,
          applicable_standards: r?.applicableStandards,
          match_score: m.score,
        };
      });
    }
    case "get_standard": {
      const ident = String(args.identifier || "").toLowerCase();
      const asNum = Number(ident);
      if (!Number.isNaN(asNum) && asNum >= 1 && asNum <= 7) {
        const a = getArticle(asNum);
        return a ? { type: "uaop", ...a } : { error: "Not found" };
      }
      const c = getConductCode(ident);
      if (c) return { type: "conduct_code", ...c };
      const a = UAOP.find((x) => x.slug === ident);
      if (a) return { type: "uaop", ...a };
      return { error: "Not found" };
    }
    case "search_guides": {
      const results = similar(String(args.query || ""), "article", 3);
      return results.map((r) => {
        const a = ARTICLES.find((x) => x.slug === r.slug);
        return a
          ? {
              slug: a.slug,
              title: a.title,
              direct_answer: a.directAnswer,
              url: `https://meridian.ai/learn/${a.slug}`,
              match_score: r.score,
            }
          : null;
      });
    }
    case "get_definition": {
      const q = String(args.term || "").toLowerCase();
      const t = GLOSSARY.find((x) => x.slug === q || x.term.toLowerCase() === q);
      return t ? { term: t.term, slug: t.slug, category: t.category, definition: t.definition } : { error: "Not found" };
    }
    case "get_compliance_requirements": {
      const juris = String(args.jurisdiction || "").toUpperCase();
      const type = args.entity_type as any;
      const applicable = REGULATIONS.filter(
        (r) => r.jurisdiction.toUpperCase() === juris || r.jurisdiction.toUpperCase().includes(juris),
      );
      return applicable.map((r) => ({
        id: r.id,
        title: r.title,
        jurisdiction: r.jurisdiction,
        effective: r.effectiveDate,
        affects: r.entityTypesAffected,
        requirements: r.requirements.filter((req) => !type || r.entityTypesAffected.includes(type)),
      }));
    }
    case "check_compliance": {
      const id = String(args.id || "");
      const e = getEntity(id);
      if (!e) return { error: `Unknown entity: ${id}` };
      return {
        entity: e.slug,
        tier: e.trust.tier,
        tier_label: e.trust.tierLabel,
        composite: e.trust.composite,
        last_audit: e.certifications[0]?.issuedDate ?? null,
        active_violations: [],
        source: e.trust.tier === 3 ? "SDK_LIVE" : "MERIDIAN_CACHE",
      };
    }
    default:
      return { error: `Unknown tool: ${name}` };
  }
}
