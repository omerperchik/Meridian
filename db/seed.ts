/**
 * Seed Postgres from the canonical TypeScript fixtures.
 * Idempotent: uses UPSERT semantics by primary key.
 *
 * Usage: DATABASE_URL=... npm run db:seed
 */
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import * as schema from "./schema";

import { REGISTRY } from "../data/registry";
import { UAOP } from "../data/uaop";
import { CONDUCT_CODES } from "../data/conduct-codes";
import { THREATS } from "../data/threats";
import { INCIDENTS } from "../data/incidents";
import { RULINGS } from "../data/rulings";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL not set.");
    process.exit(1);
  }
  const db = drizzle(neon(url), { schema });

  console.log("Seeding registry…");
  for (const e of REGISTRY) {
    await db
      .insert(schema.entities)
      .values({
        id: e.id,
        slug: e.slug,
        name: e.name,
        type: e.type,
        version: e.version,
        provider: e.provider,
        description: e.description,
        capabilities: [...e.capabilities],
        domains: [...e.domains],
        protocols: [...e.protocols],
        pricing: e.pricing,
        latency: e.latency,
        constitutionVersion: e.constitutionVersion,
        links: e.links,
        tags: [...e.tags],
        addedAt: new Date(e.addedAt),
        lastReviewedAt: new Date(e.lastReviewed),
      })
      .onConflictDoNothing();

    await db
      .insert(schema.trustScores)
      .values({
        entityId: e.id,
        composite: e.trust.composite,
        tier: e.trust.tier,
        security: e.trust.dimensions[0].value,
        compliance: e.trust.dimensions[1].value,
        performance: e.trust.dimensions[2].value,
        reliability: e.trust.dimensions[3].value,
        affordability: e.trust.dimensions[4].value,
      })
      .onConflictDoNothing();

    for (const c of e.certifications) {
      await db
        .insert(schema.certifications)
        .values({
          badgeId: c.badgeId,
          entityId: e.id,
          tier: c.tier,
          issuedAt: new Date(c.issuedDate),
          expiresAt: new Date(c.expiresDate),
          auditReportUrl: c.auditReportUrl || null,
        })
        .onConflictDoNothing();
    }
  }

  console.log("Seeding UAOP…");
  for (const a of UAOP) {
    await db
      .insert(schema.uaopArticles)
      .values({
        number: a.number,
        slug: a.slug,
        title: a.title,
        requires: a.requires,
        commonFailureMode: a.commonFailureMode,
        commentary: a.commentary,
        examples: [...a.examples],
        version: "1.0.0",
      })
      .onConflictDoNothing();
  }

  console.log("Seeding conduct codes…");
  for (const c of CONDUCT_CODES) {
    await db
      .insert(schema.conductCodes)
      .values({
        id: c.id,
        domain: c.domain,
        title: c.title,
        status: c.status,
        phase: c.phase,
        version: c.version,
        summary: c.summary,
        obligations: [...c.obligations],
        lastUpdatedAt: new Date(c.lastUpdated),
      })
      .onConflictDoNothing();
  }

  console.log("Seeding threats…");
  for (const t of THREATS) {
    await db
      .insert(schema.threats)
      .values({
        id: t.id,
        title: t.title,
        category: t.category,
        severity: t.severity,
        cvss: t.cvss,
        discoveredAt: new Date(t.discoveredAt),
        reporter: t.reporter,
        affectedEntityTypes: [...t.affectedEntityTypes],
        affectedEntities: [...t.affectedEntities],
        summary: t.summary,
        pattern: t.pattern,
        detectionSignature: t.detectionSignature,
        mitigations: [...t.mitigations],
        status: t.status,
        lastUpdatedAt: new Date(t.lastUpdated),
      })
      .onConflictDoNothing();
  }

  console.log("Seeding incidents…");
  for (const i of INCIDENTS) {
    await db
      .insert(schema.incidents)
      .values({
        id: i.id,
        slug: i.slug,
        title: i.title,
        reportedAt: new Date(i.reportedAt),
        occurredAt: new Date(i.occurredAt),
        entity: i.entity,
        entityAnonymized: i.entityAnonymized,
        type: i.type,
        priority: i.priority,
        description: i.description,
        technicalAnalysis: i.technicalAnalysis,
        ruling: i.ruling,
        violatedArticles: [...i.violatedArticles],
        standardUpdate: i.standardUpdate ?? null,
        status: i.status,
        lessonsLearned: [...i.lessonsLearned],
      })
      .onConflictDoNothing();
  }

  console.log("Seeding rulings…");
  for (const r of RULINGS) {
    await db
      .insert(schema.rulings)
      .values({
        id: r.id,
        slug: r.slug,
        title: r.title,
        publishedAt: new Date(r.publishedAt),
        scenario: r.scenario,
        applicableStandards: [...r.applicableStandards],
        arguments_: r.arguments.map((a) => ({ title: a.title, body: a.body })),
        ruling: r.ruling,
        dissent: r.dissent ?? null,
        practicalImplications: [...r.practicalImplications],
        recommendedBehavior: r.recommendedBehavior,
        antiPatternBehaviors: [...r.antiPatternBehaviors],
        relatedRulings: [...r.relatedRulings],
      })
      .onConflictDoNothing();
  }

  console.log("✓ seed complete");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
