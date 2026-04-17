/**
 * Meridian canonical database schema. Drizzle ORM.
 *
 * Design notes:
 * - `id` columns are strings that mirror human-readable IDs (MINC-YYYY-NNNN, MR-YYYY-NNN, etc.) per spec.
 * - Timestamps are always `timestamptz` (UTC) for audit clarity.
 * - `_updated_at` is managed by triggers where available; app code also sets it.
 * - Permissions and secrets are hashed, never stored plaintext.
 */
import {
  pgTable,
  text,
  integer,
  real,
  boolean,
  timestamp,
  jsonb,
  primaryKey,
  index,
  uniqueIndex,
  serial,
  bigserial,
  bigint,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─────────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────────
export const entityTypeEnum = pgEnum("entity_type", ["agent", "mcp", "tool", "framework"]);
export const severityEnum = pgEnum("severity", ["critical", "high", "medium", "low"]);
export const threatStatusEnum = pgEnum("threat_status", ["active", "partial", "mitigated", "resolved"]);
export const incidentStatusEnum = pgEnum("incident_status", [
  "reported",
  "under-investigation",
  "ruling-published",
  "standard-updated",
  "closed",
]);
export const incidentPriorityEnum = pgEnum("incident_priority", ["P0", "P1", "P2", "P3"]);
export const apiKeyTierEnum = pgEnum("api_key_tier", ["free", "pro", "enterprise"]);

// ─────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────
export const entities = pgTable(
  "entities",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    type: entityTypeEnum("type").notNull(),
    version: text("version").notNull(),
    provider: text("provider").notNull(),
    description: text("description").notNull(),
    capabilities: jsonb("capabilities").$type<string[]>().notNull().default([]),
    domains: jsonb("domains").$type<string[]>().notNull().default([]),
    protocols: jsonb("protocols").$type<string[]>().notNull().default([]),
    pricing: jsonb("pricing").$type<{
      perCall?: number;
      currency: string;
      freeTier: boolean;
      model: "free" | "freemium" | "paid" | "open-source";
    }>().notNull(),
    latency: jsonb("latency").$type<{ p50: number; p95: number }>().notNull(),
    constitutionVersion: text("constitution_version").notNull(),
    links: jsonb("links").$type<Record<string, string>>().notNull().default({}),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
    lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }).notNull().defaultNow(),
    // Discovery metadata
    discoverySource: text("discovery_source"), // 'github', 'npm', 'pypi', 'hn', 'ph', 'manual'
    discoveryUrl: text("discovery_url"),
  },
  (t) => ({
    slugIdx: uniqueIndex("entities_slug_idx").on(t.slug),
    typeIdx: index("entities_type_idx").on(t.type),
  }),
);

export const trustScores = pgTable(
  "trust_scores",
  {
    entityId: text("entity_id")
      .primaryKey()
      .references(() => entities.id, { onDelete: "cascade" }),
    composite: real("composite").notNull(),
    tier: integer("tier").notNull(), // 0-3
    // Dimension values
    security: real("security").notNull(),
    compliance: real("compliance").notNull(),
    performance: real("performance").notNull(),
    reliability: real("reliability").notNull(),
    affordability: real("affordability").notNull(),
    lastComputedAt: timestamp("last_computed_at", { withTimezone: true }).notNull().defaultNow(),
  },
);

export const trustScoreHistory = pgTable(
  "trust_score_history",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    entityId: text("entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    composite: real("composite").notNull(),
    tier: integer("tier").notNull(),
    security: real("security").notNull(),
    compliance: real("compliance").notNull(),
    performance: real("performance").notNull(),
    reliability: real("reliability").notNull(),
    affordability: real("affordability").notNull(),
    reason: text("reason"), // 'benchmark_run' | 'sdk_telemetry' | 'audit_update' | 'dispute_resolved'
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    entityCreatedIdx: index("trust_history_entity_created_idx").on(t.entityId, t.createdAt),
  }),
);

export const certifications = pgTable("certifications", {
  badgeId: text("badge_id").primaryKey(),
  entityId: text("entity_id")
    .notNull()
    .references(() => entities.id, { onDelete: "cascade" }),
  tier: integer("tier").notNull(),
  issuedAt: timestamp("issued_at", { withTimezone: true }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  auditReportUrl: text("audit_report_url"),
});

// ─────────────────────────────────────────────────────────────────
// Standards
// ─────────────────────────────────────────────────────────────────
export const uaopArticles = pgTable("uaop_articles", {
  number: integer("number").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  requires: text("requires").notNull(),
  commonFailureMode: text("common_failure_mode").notNull(),
  commentary: text("commentary").notNull(),
  examples: jsonb("examples").$type<string[]>().notNull().default([]),
  version: text("version").notNull(),
});

export const conductCodes = pgTable("conduct_codes", {
  id: text("id").primaryKey(),
  domain: text("domain").notNull().unique(),
  title: text("title").notNull(),
  status: text("status").notNull(), // 'launched' | 'draft' | 'planned'
  phase: text("phase").notNull(),
  version: text("version").notNull(),
  summary: text("summary").notNull(),
  obligations: jsonb("obligations").$type<string[]>().notNull().default([]),
  lastUpdatedAt: timestamp("last_updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────────
// Threats
// ─────────────────────────────────────────────────────────────────
export const threats = pgTable(
  "threats",
  {
    id: text("id").primaryKey(), // MTHRT-YYYY-NNNN
    title: text("title").notNull(),
    category: text("category").notNull(),
    severity: severityEnum("severity").notNull(),
    cvss: real("cvss").notNull(),
    discoveredAt: timestamp("discovered_at", { withTimezone: true }).notNull(),
    reporter: text("reporter").notNull(),
    affectedEntityTypes: jsonb("affected_entity_types").$type<string[]>().notNull().default([]),
    affectedEntities: jsonb("affected_entities").$type<string[]>().notNull().default([]),
    summary: text("summary").notNull(),
    pattern: text("pattern").notNull(),
    detectionSignature: jsonb("detection_signature")
      .$type<{ type: string; signature: string }>()
      .notNull(),
    mitigations: jsonb("mitigations").$type<string[]>().notNull().default([]),
    status: threatStatusEnum("status").notNull().default("active"),
    lastUpdatedAt: timestamp("last_updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    statusIdx: index("threats_status_idx").on(t.status),
    severityIdx: index("threats_severity_idx").on(t.severity),
  }),
);

// ─────────────────────────────────────────────────────────────────
// Incidents
// ─────────────────────────────────────────────────────────────────
export const incidents = pgTable(
  "incidents",
  {
    id: text("id").primaryKey(), // MINC-YYYY-NNNN
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    reportedAt: timestamp("reported_at", { withTimezone: true }).notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    entity: text("entity").notNull(),
    entityAnonymized: boolean("entity_anonymized").notNull().default(true),
    type: text("type").notNull(),
    priority: incidentPriorityEnum("priority").notNull(),
    description: text("description").notNull(),
    technicalAnalysis: text("technical_analysis").notNull(),
    ruling: text("ruling").notNull(),
    violatedArticles: jsonb("violated_articles").$type<number[]>().notNull().default([]),
    standardUpdate: jsonb("standard_update").$type<{ version: string; note: string } | null>(),
    status: incidentStatusEnum("status").notNull().default("reported"),
    lessonsLearned: jsonb("lessons_learned").$type<string[]>().notNull().default([]),
    // Moderation fields for user-submitted incidents
    submittedBy: text("submitted_by"), // email
    moderatedAt: timestamp("moderated_at", { withTimezone: true }),
  },
);

// ─────────────────────────────────────────────────────────────────
// Rulings
// ─────────────────────────────────────────────────────────────────
export const rulings = pgTable("rulings", {
  id: text("id").primaryKey(), // MR-YYYY-NNN
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
  scenario: text("scenario").notNull(),
  applicableStandards: jsonb("applicable_standards").$type<string[]>().notNull().default([]),
  arguments_: jsonb("arguments").$type<Array<{ title: string; body: string }>>().notNull().default([]),
  ruling: text("ruling").notNull(),
  dissent: jsonb("dissent").$type<{ by: string; body: string } | null>(),
  practicalImplications: jsonb("practical_implications").$type<string[]>().notNull().default([]),
  recommendedBehavior: text("recommended_behavior").notNull(),
  antiPatternBehaviors: jsonb("anti_pattern_behaviors").$type<string[]>().notNull().default([]),
  relatedRulings: jsonb("related_rulings").$type<string[]>().notNull().default([]),
});

export const rulingSubmissions = pgTable("ruling_submissions", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  scenario: text("scenario").notNull(),
  rationale: text("rationale"),
  submittedBy: text("submitted_by"),
  status: text("status").notNull().default("received"), // received|under-review|selected|rejected
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────────
// Attestations
// ─────────────────────────────────────────────────────────────────
export const attestations = pgTable(
  "attestations",
  {
    id: text("id").primaryKey(),
    attestingAgentId: text("attesting_agent_id").notNull(),
    subjectAgentId: text("subject_agent_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    taskType: text("task_type").notNull(),
    reliabilityObserved: integer("reliability_observed").notNull(),
    honestyObserved: integer("honesty_observed").notNull(),
    securityConcerns: boolean("security_concerns").notNull().default(false),
    securityNotes: text("security_notes"),
    wouldWorkWithAgain: boolean("would_work_with_again").notNull(),
    freeText: text("free_text"),
    weight: real("weight"), // computed nightly; nullable while pending
    antiRingFlag: boolean("anti_ring_flag").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    subjectIdx: index("attestations_subject_idx").on(t.subjectAgentId),
  }),
);

// ─────────────────────────────────────────────────────────────────
// Disputes
// ─────────────────────────────────────────────────────────────────
export const disputes = pgTable("disputes", {
  id: text("id").primaryKey(),
  entityId: text("entity_id").notNull(),
  dimension: text("dimension").notNull(),
  disputedDate: timestamp("disputed_date", { withTimezone: true }),
  evidence: text("evidence").notNull(),
  filer: text("filer").notNull(), // email
  status: text("status").notNull().default("received"), // received|panel-drawn|reviewing|decided
  panel: jsonb("panel").$type<string[]>(),
  decision: text("decision"),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────────
// Auth: API keys
// ─────────────────────────────────────────────────────────────────
export const apiKeys = pgTable(
  "api_keys",
  {
    id: text("id").primaryKey(), // mr_xxx public id
    hashedSecret: text("hashed_secret").notNull(), // Argon2 hash of the secret
    label: text("label").notNull(),
    tier: apiKeyTierEnum("tier").notNull().default("free"),
    ownerEmail: text("owner_email").notNull(),
    // Quotas
    rateLimitDaily: integer("rate_limit_daily").notNull().default(100),
    // State
    disabled: boolean("disabled").notNull().default(false),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    ownerIdx: index("api_keys_owner_idx").on(t.ownerEmail),
  }),
);

// Sliding-window rate limit bucket. Cleared daily.
export const rateLimitBuckets = pgTable(
  "rate_limit_buckets",
  {
    key: text("key").primaryKey(), // e.g. apikey:mr_xxx:2026-04-17 or ip:1.2.3.4:2026-04-17
    count: integer("count").notNull().default(0),
    windowStart: timestamp("window_start", { withTimezone: true }).notNull().defaultNow(),
  },
);

// ─────────────────────────────────────────────────────────────────
// Webhooks
// ─────────────────────────────────────────────────────────────────
export const webhookSubscriptions = pgTable(
  "webhook_subscriptions",
  {
    id: text("id").primaryKey(),
    apiKeyId: text("api_key_id")
      .notNull()
      .references(() => apiKeys.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    secret: text("secret").notNull(), // for HMAC signing
    events: jsonb("events").$type<string[]>().notNull(), // ['trust.score.changed', 'threat.published', ...]
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
);

export const webhookDeliveries = pgTable(
  "webhook_deliveries",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    subscriptionId: text("subscription_id")
      .notNull()
      .references(() => webhookSubscriptions.id, { onDelete: "cascade" }),
    event: text("event").notNull(),
    payload: jsonb("payload").notNull(),
    status: text("status").notNull(), // pending|delivered|failed|dead
    attempts: integer("attempts").notNull().default(0),
    lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true }),
    lastResponseCode: integer("last_response_code"),
    lastError: text("last_error"),
    nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    statusIdx: index("webhook_deliveries_status_idx").on(t.status, t.nextAttemptAt),
  }),
);

// ─────────────────────────────────────────────────────────────────
// SDK Telemetry (ingress)
// ─────────────────────────────────────────────────────────────────
export const telemetryEvents = pgTable(
  "telemetry_events",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    agentId: text("agent_id").notNull(),
    apiKeyId: text("api_key_id"), // nullable — anonymous SDK posts allowed in free tier
    uaopVersion: text("uaop_version"),
    // Aggregated metrics (no task content!)
    taskType: text("task_type"),
    successCount: integer("success_count").notNull().default(0),
    failureCount: integer("failure_count").notNull().default(0),
    latencyP50: real("latency_p50"),
    latencyP95: real("latency_p95"),
    errorType: text("error_type"),
    // Compliance signals (per UAOP article)
    uaopArticlesTriggered: jsonb("uaop_articles_triggered").$type<number[]>().default([]),
    driftDetected: boolean("drift_detected").default(false),
    // Security signals
    attackAttemptCategory: text("attack_attempt_category"),
    anomalyFlag: boolean("anomaly_flag").default(false),
    // Cost signals
    tokensIn: bigint("tokens_in", { mode: "number" }),
    tokensOut: bigint("tokens_out", { mode: "number" }),
    // Audit integrity
    auditLogHash: text("audit_log_hash"),
    hashChainSeq: bigint("hash_chain_seq", { mode: "number" }),
    // Metadata
    sdkLang: text("sdk_lang"), // 'ts' | 'py' | 'go'
    sdkVersion: text("sdk_version"),
    receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    agentReceivedIdx: index("telemetry_agent_received_idx").on(t.agentId, t.receivedAt),
  }),
);

// ─────────────────────────────────────────────────────────────────
// Crawler state
// ─────────────────────────────────────────────────────────────────
export const crawlRuns = pgTable("crawl_runs", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  source: text("source").notNull(), // 'github', 'npm', 'pypi', ...
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  discovered: integer("discovered").notNull().default(0),
  enqueued: integer("enqueued").notNull().default(0),
  skipped: integer("skipped").notNull().default(0),
  errors: integer("errors").notNull().default(0),
  notes: text("notes"),
});

export const discoveryQueue = pgTable(
  "discovery_queue",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    source: text("source").notNull(),
    externalId: text("external_id").notNull(),
    url: text("url").notNull(),
    name: text("name").notNull(),
    raw: jsonb("raw"),
    status: text("status").notNull().default("pending"), // pending|tier0|dedupe|done|rejected
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    srcExtIdx: uniqueIndex("discovery_src_ext_idx").on(t.source, t.externalId),
    statusIdx: index("discovery_status_idx").on(t.status),
  }),
);

// ─────────────────────────────────────────────────────────────────
// Arena
// ─────────────────────────────────────────────────────────────────
export const arenaSubmissions = pgTable("arena_submissions", {
  id: text("id").primaryKey(),
  agentSlug: text("agent_slug").notNull(),
  suites: jsonb("suites").$type<string[]>().notNull(),
  email: text("email"),
  status: text("status").notNull().default("queued"), // queued|running|complete|failed
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const arenaResults = pgTable("arena_results", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  submissionId: text("submission_id")
    .notNull()
    .references(() => arenaSubmissions.id, { onDelete: "cascade" }),
  suite: text("suite").notNull(),
  score: real("score").notNull(),
  perTask: jsonb("per_task"),
  runs: integer("runs").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────────
// Embeddings (pgvector)
// Populated by scoring/embeddings.py; queried by semantic-search fallback.
// Stored as JSON arrays for portability even without pgvector; a second
// migration converts to vector(N) if pgvector is installed.
// ─────────────────────────────────────────────────────────────────
export const embeddings = pgTable(
  "embeddings",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    kind: text("kind").notNull(), // 'ruling' | 'entity' | 'article' | 'term'
    refId: text("ref_id").notNull(),
    model: text("model").notNull(),
    dim: integer("dim").notNull(),
    vector: jsonb("vector").$type<number[]>().notNull(),
    text: text("text").notNull(), // source text that was embedded
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    kindRefIdx: uniqueIndex("embeddings_kind_ref_idx").on(t.kind, t.refId, t.model),
  }),
);

// ─────────────────────────────────────────────────────────────────
// Scoring engine provenance
// ─────────────────────────────────────────────────────────────────
export const scoringRuns = pgTable("scoring_runs", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  entitiesProcessed: integer("entities_processed").notNull().default(0),
  significantChanges: integer("significant_changes").notNull().default(0),
  algorithmVersion: text("algorithm_version").notNull(),
  notes: text("notes"),
});
