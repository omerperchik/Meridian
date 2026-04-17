/**
 * Unified data access layer.
 *
 * Every page and API route SHOULD go through here rather than importing fixtures
 * directly. When DATABASE_URL is set the reads go to Postgres; otherwise they
 * return the static fixtures. This keeps the deploy working out-of-the-box while
 * making the Postgres upgrade a single env-var flip.
 *
 * Notes:
 * - Reads are wrapped in try/catch — a DB hiccup falls back to fixtures.
 * - Writes go to DB when available; when not, we queue them in the request log
 *   (see lib/events.ts) so nothing is silently dropped.
 */
import { db, hasDb } from "@/db/client";
import * as T from "@/lib/types";
import * as schema from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

import { REGISTRY as FIX_REGISTRY, listEntities as fixListEntities, getEntity as fixGetEntity } from "@/data/registry";
import { UAOP as FIX_UAOP, getArticle as fixGetArticle } from "@/data/uaop";
import { CONDUCT_CODES as FIX_CC, getConductCode as fixGetCC } from "@/data/conduct-codes";
import { THREATS as FIX_THREATS, listThreats as fixListThreats, getThreat as fixGetThreat } from "@/data/threats";
import { INCIDENTS as FIX_INC, listIncidents as fixListIncidents, getIncident as fixGetIncident } from "@/data/incidents";
import { RULINGS as FIX_RULINGS, getRuling as fixGetRuling } from "@/data/rulings";

// ─────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────
function rowToEntity(e: any, score: any, certs: any[]): T.RegistryEntity {
  const dimFactory = (
    name: T.TrustDimension["name"],
    label: string,
    weight: number,
    value: number,
    inputs: string[],
  ): T.TrustDimension => ({ name, label, weight, value, inputs, updatedAt: (score?.lastComputedAt ?? new Date()).toISOString() });
  return {
    id: e.id,
    slug: e.slug,
    name: e.name,
    version: e.version,
    provider: e.provider,
    type: e.type,
    description: e.description,
    capabilities: e.capabilities ?? [],
    domains: e.domains ?? [],
    protocols: e.protocols ?? [],
    pricing: e.pricing,
    latency: e.latency,
    constitutionVersion: e.constitutionVersion,
    certifications: certs.map((c) => ({
      tier: c.tier,
      badgeId: c.badgeId,
      issuedDate: c.issuedAt.toISOString(),
      expiresDate: c.expiresAt.toISOString(),
      auditReportUrl: c.auditReportUrl ?? undefined,
    })),
    trust: {
      composite: score?.composite ?? 0,
      tier: (score?.tier ?? 0) as any,
      tierLabel: ["Auto-discovered", "Claimed", "Premium", "SDK Integrated"][score?.tier ?? 0],
      dimensions: [
        dimFactory("security", "Security", 30, score?.security ?? 0, ["CVE exposure", "Injection resistance"]),
        dimFactory("compliance", "Compliance", 25, score?.compliance ?? 0, ["UAOP coverage"]),
        dimFactory("performance", "Performance", 20, score?.performance ?? 0, ["Arena benchmarks"]),
        dimFactory("reliability", "Reliability", 15, score?.reliability ?? 0, ["Uptime"]),
        dimFactory("affordability", "Affordability", 10, score?.affordability ?? 0, ["Cost per task"]),
      ],
      history: [],
      lastUpdated: (score?.lastComputedAt ?? new Date()).toISOString(),
    },
    links: e.links ?? {},
    addedAt: (e.addedAt ?? new Date()).toISOString().slice(0, 10),
    lastReviewed: (e.lastReviewedAt ?? new Date()).toISOString().slice(0, 10),
    tags: e.tags ?? [],
  };
}

export async function listEntities(filter?: Parameters<typeof fixListEntities>[0]) {
  if (!hasDb) return fixListEntities(filter);
  try {
    const rows = await db.select().from(schema.entities);
    const scores = await db.select().from(schema.trustScores);
    const certs = await db.select().from(schema.certifications);
    const scoreById = new Map(scores.map((s) => [s.entityId, s]));
    const certsByEntity = new Map<string, typeof certs>();
    for (const c of certs) {
      const arr = certsByEntity.get(c.entityId) ?? [];
      arr.push(c);
      certsByEntity.set(c.entityId, arr);
    }
    const full = rows.map((e) => rowToEntity(e, scoreById.get(e.id), certsByEntity.get(e.id) ?? []));
    // Apply filter (same logic as fixture version)
    return full
      .filter((e) => {
        if (filter?.type && e.type !== filter.type) return false;
        if (filter?.minTrust && e.trust.composite < filter.minTrust) return false;
        if (filter?.domain && !e.domains.includes(filter.domain)) return false;
        if (filter?.protocol && !e.protocols.includes(filter.protocol)) return false;
        if (filter?.capability && !e.capabilities.some((c) => c.includes(filter.capability!))) return false;
        return true;
      })
      .sort((a, b) => b.trust.composite - a.trust.composite);
  } catch (err) {
    console.error("[data] listEntities DB error, falling back:", err);
    return fixListEntities(filter);
  }
}

export async function getEntity(slug: string): Promise<T.RegistryEntity | undefined> {
  if (!hasDb) return fixGetEntity(slug);
  try {
    const entities = await db
      .select()
      .from(schema.entities)
      .where(sql`${schema.entities.slug} = ${slug} OR ${schema.entities.id} = ${slug}`)
      .limit(1);
    const e = entities[0];
    if (!e) return undefined;
    const [score] = await db.select().from(schema.trustScores).where(eq(schema.trustScores.entityId, e.id));
    const certs = await db.select().from(schema.certifications).where(eq(schema.certifications.entityId, e.id));
    return rowToEntity(e, score, certs);
  } catch (err) {
    console.error("[data] getEntity DB error, falling back:", err);
    return fixGetEntity(slug);
  }
}

// ─────────────────────────────────────────────────────────────────────
// UAOP & conduct codes (rarely change; always serve from fixtures for speed)
// ─────────────────────────────────────────────────────────────────────
export const getUAOP = () => FIX_UAOP;
export const getArticle = fixGetArticle;
export const getConductCodes = () => FIX_CC;
export const getConductCode = fixGetCC;

// ─────────────────────────────────────────────────────────────────────
// Threats
// ─────────────────────────────────────────────────────────────────────
export async function listThreats(filter?: Parameters<typeof fixListThreats>[0]) {
  if (!hasDb) return fixListThreats(filter);
  try {
    const rows = await db.select().from(schema.threats);
    const sevRank = { critical: 4, high: 3, medium: 2, low: 1 } as const;
    return rows
      .filter((t) => {
        if (filter?.severity && t.severity !== filter.severity) return false;
        if (filter?.status && t.status !== filter.status) return false;
        if (filter?.category && t.category !== filter.category) return false;
        return true;
      })
      .map((t) => ({
        ...t,
        affectedEntityTypes: t.affectedEntityTypes as any,
        affectedEntities: t.affectedEntities as any,
        detectionSignature: t.detectionSignature as any,
        mitigations: t.mitigations as any,
        discoveredAt: t.discoveredAt.toISOString(),
        lastUpdated: t.lastUpdatedAt.toISOString(),
      }))
      .sort((a, b) => sevRank[b.severity] - sevRank[a.severity] || b.lastUpdated.localeCompare(a.lastUpdated)) as any;
  } catch (err) {
    console.error("[data] listThreats DB error, falling back:", err);
    return fixListThreats(filter);
  }
}

export async function getThreat(id: string) {
  if (!hasDb) return fixGetThreat(id);
  try {
    const [t] = await db.select().from(schema.threats).where(eq(schema.threats.id, id));
    if (!t) return undefined;
    return {
      ...t,
      affectedEntityTypes: t.affectedEntityTypes as any,
      affectedEntities: t.affectedEntities as any,
      detectionSignature: t.detectionSignature as any,
      mitigations: t.mitigations as any,
      discoveredAt: t.discoveredAt.toISOString(),
      lastUpdated: t.lastUpdatedAt.toISOString(),
    } as any;
  } catch {
    return fixGetThreat(id);
  }
}

// ─────────────────────────────────────────────────────────────────────
// Incidents
// ─────────────────────────────────────────────────────────────────────
export async function listIncidents(filter?: Parameters<typeof fixListIncidents>[0]) {
  if (!hasDb) return fixListIncidents(filter);
  try {
    const rows = await db.select().from(schema.incidents);
    const prioRank = { P0: 4, P1: 3, P2: 2, P3: 1 } as const;
    return rows
      .filter((i) => {
        if (filter?.priority && i.priority !== filter.priority) return false;
        if (filter?.status && i.status !== filter.status) return false;
        if (filter?.type && i.type !== filter.type) return false;
        return true;
      })
      .map((i) => ({
        ...i,
        violatedArticles: i.violatedArticles as any,
        standardUpdate: i.standardUpdate as any,
        lessonsLearned: i.lessonsLearned as any,
        reportedAt: i.reportedAt.toISOString().slice(0, 10),
        occurredAt: i.occurredAt.toISOString().slice(0, 10),
      }))
      .sort((a, b) => prioRank[b.priority] - prioRank[a.priority] || b.reportedAt.localeCompare(a.reportedAt)) as any;
  } catch (err) {
    console.error("[data] listIncidents DB error, falling back:", err);
    return fixListIncidents(filter);
  }
}

export async function getIncident(slug: string) {
  if (!hasDb) return fixGetIncident(slug);
  try {
    const [i] = await db
      .select()
      .from(schema.incidents)
      .where(sql`${schema.incidents.slug} = ${slug} OR ${schema.incidents.id} = ${slug}`)
      .limit(1);
    if (!i) return undefined;
    return {
      ...i,
      violatedArticles: i.violatedArticles as any,
      standardUpdate: i.standardUpdate as any,
      lessonsLearned: i.lessonsLearned as any,
      reportedAt: i.reportedAt.toISOString().slice(0, 10),
      occurredAt: i.occurredAt.toISOString().slice(0, 10),
    } as any;
  } catch {
    return fixGetIncident(slug);
  }
}

// ─────────────────────────────────────────────────────────────────────
// Rulings
// ─────────────────────────────────────────────────────────────────────
export async function listRulings() {
  if (!hasDb) return FIX_RULINGS;
  try {
    const rows = await db.select().from(schema.rulings).orderBy(desc(schema.rulings.publishedAt));
    return rows.map((r) => ({
      ...r,
      publishedAt: r.publishedAt.toISOString().slice(0, 10),
      applicableStandards: r.applicableStandards as any,
      arguments: r.arguments_ as any,
      dissent: r.dissent as any,
      practicalImplications: r.practicalImplications as any,
      antiPatternBehaviors: r.antiPatternBehaviors as any,
      relatedRulings: r.relatedRulings as any,
    })) as any;
  } catch {
    return FIX_RULINGS;
  }
}

export async function getRuling(slug: string) {
  if (!hasDb) return fixGetRuling(slug);
  try {
    const [r] = await db
      .select()
      .from(schema.rulings)
      .where(sql`${schema.rulings.slug} = ${slug} OR ${schema.rulings.id} = ${slug}`)
      .limit(1);
    if (!r) return undefined;
    return {
      ...r,
      publishedAt: r.publishedAt.toISOString().slice(0, 10),
      applicableStandards: r.applicableStandards as any,
      arguments: r.arguments_ as any,
      dissent: r.dissent as any,
      practicalImplications: r.practicalImplications as any,
      antiPatternBehaviors: r.antiPatternBehaviors as any,
      relatedRulings: r.relatedRulings as any,
    } as any;
  } catch {
    return fixGetRuling(slug);
  }
}

// ─────────────────────────────────────────────────────────────────────
// Recent changes (for briefing and trust feed)
// ─────────────────────────────────────────────────────────────────────
export async function listRecentScoreChanges(limit = 20) {
  if (!hasDb) {
    // Fixture version: synthesize plausible deltas from current scores.
    return FIX_REGISTRY.slice(0, limit).map((e, i) => ({
      timestamp: new Date(Date.now() - i * 42 * 60_000).toISOString(),
      entity_id: e.id,
      slug: e.slug,
      name: e.name,
      delta: ((i * 7) % 11) - 5,
      new_score: e.trust.composite,
      kind: i % 3 === 0 ? "benchmark_run" : i % 3 === 1 ? "sdk_telemetry" : "audit_update",
    }));
  }
  try {
    const rows = await db
      .select()
      .from(schema.trustScoreHistory)
      .orderBy(desc(schema.trustScoreHistory.createdAt))
      .limit(limit);
    // Join with entity names
    const ids = Array.from(new Set(rows.map((r) => r.entityId)));
    const ents = ids.length
      ? await db.select().from(schema.entities).where(sql`${schema.entities.id} = ANY(${ids})`)
      : [];
    const byId = new Map(ents.map((e) => [e.id, e]));
    return rows.map((r) => ({
      timestamp: r.createdAt.toISOString(),
      entity_id: r.entityId,
      slug: byId.get(r.entityId)?.slug ?? r.entityId,
      name: byId.get(r.entityId)?.name ?? r.entityId,
      delta: 0, // would require prior row subtraction; left as 0 for now
      new_score: r.composite,
      kind: r.reason ?? "recompute",
    }));
  } catch {
    return [];
  }
}
