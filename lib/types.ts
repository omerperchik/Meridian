/**
 * Canonical Meridian types — the shapes every page and every API route operates on.
 * These mirror the schemas in Meridian Full Spec v2.0.
 */

export type Tier = 0 | 1 | 2 | 3;
export type Severity = "critical" | "high" | "medium" | "low";
export type IncidentPriority = "P0" | "P1" | "P2" | "P3";
export type EntityType = "agent" | "mcp" | "tool" | "framework";
export type Status =
  | "active"
  | "partial"
  | "mitigated"
  | "resolved"
  | "reported"
  | "under-investigation"
  | "ruling-published"
  | "standard-updated"
  | "closed";

// ========== UAOP ==========
export interface UAOPArticle {
  number: number;
  slug: string;
  title: string;
  requires: string;
  commonFailureMode: string;
  commentary: string;
  examples: string[];
}

// ========== Conduct Code ==========
export interface ConductCode {
  id: string;
  domain: string;
  title: string;
  status: "launched" | "draft" | "planned";
  phase: string;
  obligations: string[];
  summary: string;
  lastUpdated: string;
  version: string;
}

// ========== Trust ==========
export interface TrustDimension {
  name: "security" | "compliance" | "performance" | "reliability" | "affordability";
  label: string;
  weight: number; // percent
  value: number; // 0-100
  inputs: string[];
  updatedAt: string;
}

export interface TrustScore {
  composite: number;
  tier: Tier;
  tierLabel: string;
  dimensions: TrustDimension[];
  history: Array<{ date: string; score: number }>;
  lastUpdated: string;
}

// ========== Registry ==========
export interface RegistryEntity {
  id: string;
  slug: string;
  name: string;
  version: string;
  provider: string;
  type: EntityType;
  description: string;
  capabilities: string[];
  domains: string[];
  protocols: string[];
  pricing: {
    perCall?: number;
    currency: string;
    freeTier: boolean;
    model: "free" | "freemium" | "paid" | "open-source";
  };
  latency: { p50: number; p95: number };
  constitutionVersion: string;
  certifications: Array<{
    tier: Tier;
    badgeId: string;
    issuedDate: string;
    expiresDate: string;
    auditReportUrl?: string;
  }>;
  trust: TrustScore;
  links: { homepage?: string; github?: string; docs?: string; npm?: string; pypi?: string };
  addedAt: string;
  lastReviewed: string;
  tags: string[];
}

// ========== Threats ==========
export interface Threat {
  id: string;
  title: string;
  category:
    | "prompt-injection"
    | "agent-impersonation"
    | "privilege-escalation"
    | "data-exfiltration"
    | "jailbreak"
    | "coordination-attack"
    | "supply-chain";
  severity: Severity;
  cvss: number;
  discoveredAt: string;
  reporter: string;
  affectedEntityTypes: EntityType[];
  affectedEntities: string[]; // slugs
  summary: string;
  pattern: string;
  detectionSignature: {
    type: "regex" | "heuristic" | "ml-model" | "static-rule";
    signature: string;
  };
  mitigations: string[];
  status: Extract<Status, "active" | "partial" | "mitigated" | "resolved">;
  lastUpdated: string;
}

// ========== Incidents ==========
export interface Incident {
  id: string;
  title: string;
  slug: string;
  reportedAt: string;
  occurredAt: string;
  entity: string; // anonymized unless disclosed
  entityAnonymized: boolean;
  type:
    | "misrepresentation"
    | "unauthorized-action"
    | "data-breach"
    | "coordination-failure"
    | "safety-violation"
    | "deception"
    | "availability-failure"
    | "other";
  priority: IncidentPriority;
  description: string;
  technicalAnalysis: string;
  ruling: string;
  violatedArticles: number[]; // UAOP article numbers
  standardUpdate?: { version: string; note: string };
  status: Extract<Status, "reported" | "under-investigation" | "ruling-published" | "standard-updated" | "closed">;
  lessonsLearned: string[];
}

// ========== Rulings ==========
export interface Ruling {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  scenario: string;
  applicableStandards: string[];
  arguments: Array<{ title: string; body: string }>;
  ruling: string;
  dissent?: { by: string; body: string };
  practicalImplications: string[];
  recommendedBehavior: string;
  antiPatternBehaviors: string[];
  relatedRulings: string[];
}

// ========== Arena / Benchmarks ==========
export interface BenchmarkSuite {
  id: string;
  name: string;
  description: string;
  taskTypes: string[];
  taskCount: number;
  leaderboardReset: "weekly" | "monthly" | "quarterly" | "bi-annual";
  lastRun: string;
}

export interface LeaderboardEntry {
  rank: number;
  entityId: string;
  entityName: string;
  score: number;
  delta: number;
  runs: number;
}

// ========== Content ==========
export interface ContentArticle {
  slug: string;
  title: string;
  series: string;
  author: { name: string; credentials: string };
  publishedAt: string;
  lastReviewed: string;
  directAnswer: string;
  summary: string;
  body: string; // markdown-ish; rendered with prose
  keyClaims: string[];
  applicableStandards: string[];
  relatedRulings: string[];
  faq: Array<{ q: string; a: string }>;
  tags: string[];
  reviewCadence: string;
  contentVersion: string;
}

// ========== Glossary ==========
export interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  seeAlso: string[];
  category: string;
}

// ========== Regulation ==========
export interface Regulation {
  id: string;
  jurisdiction: string;
  title: string;
  entityTypesAffected: EntityType[];
  effectiveDate: string;
  summary: string;
  requirements: Array<{ requirement: string; deadline?: string; severity: "must" | "should" | "may" }>;
  lastUpdated: string;
}

// ========== Governance ==========
export interface BoardMember {
  id: string;
  name: string;
  role: string;
  constituency: "model-provider" | "enterprise" | "researcher" | "public-interest";
  termStart: string;
  termEnd: string;
  affiliation: string;
  bio: string;
}

export interface BoardVote {
  id: string;
  date: string;
  decision: string;
  type: "MAJOR" | "MINOR" | "PATCH" | "methodology" | "membership" | "naming";
  requiredMajority: string;
  outcome: "passed" | "failed" | "withdrawn";
  votes: Array<{ member: string; vote: "yea" | "nay" | "abstain" | "recused"; rationale?: string }>;
}
