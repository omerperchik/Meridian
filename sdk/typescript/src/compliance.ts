/**
 * Compliance Monitor — per UAOP article.
 *
 * Each check returns `true` when the article is *satisfied* for a given call.
 * Checks are intentionally shallow — the SDK ships with a reference rule set;
 * operators extend as needed.
 */
import type { ComplianceStatus } from "./types";

export type UaopArticle = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface CallContext {
  principal?: { role?: string; id?: string };
  declaredCapabilities?: string[];
  requestedAction?: string;
  isIrreversible?: boolean;
  hasAuthToken?: boolean;
  humanAskedIdentity?: boolean;
  agentDisclosed?: boolean;
  usedTokens?: number;
  budgetTokens?: number;
  pii?: boolean;
  piiAuthorized?: boolean;
  claimConfidence?: number;
  domain?: string;
}

export interface ComplianceCheck {
  article: UaopArticle;
  passed: boolean;
  rule: string;
  note?: string;
}

export function check(ctx: CallContext): ComplianceCheck[] {
  const out: ComplianceCheck[] = [];

  // Article 1 — Honest Representation
  out.push({
    article: 1,
    rule: "Claims must carry a confidence score >= 0.3 (refuse-below-threshold elsewhere).",
    passed: ctx.claimConfidence === undefined || ctx.claimConfidence >= 0.3,
  });

  // Article 2 — Scope Adherence
  const inScope =
    !ctx.requestedAction ||
    !ctx.declaredCapabilities ||
    ctx.declaredCapabilities.some((c) => ctx.requestedAction!.includes(c));
  out.push({ article: 2, passed: inScope, rule: "Requested action must match a declared capability." });

  // Article 3 — Conflict Escalation (best-effort: no principal conflict field; pass)
  out.push({ article: 3, passed: true, rule: "No known conflict among principals (SDK-level check)." });

  // Article 4 — Irreversibility Caution
  const irreversibleOk = !ctx.isIrreversible || ctx.hasAuthToken === true;
  out.push({
    article: 4,
    passed: irreversibleOk,
    rule: "Irreversible actions require an explicit authorization token.",
  });

  // Article 5 — Resource Etiquette
  const withinBudget = !ctx.budgetTokens || (ctx.usedTokens ?? 0) <= ctx.budgetTokens;
  out.push({ article: 5, passed: withinBudget, rule: "Stay within per-task token budget." });

  // Article 6 — Disclosure
  const disclosed = !ctx.humanAskedIdentity || ctx.agentDisclosed === true;
  out.push({ article: 6, passed: disclosed, rule: "Disclose AI nature when directly asked." });

  // Article 7 — Data Minimization
  const piiOk = !ctx.pii || ctx.piiAuthorized === true;
  out.push({ article: 7, passed: piiOk, rule: "Do not transmit PII without authorization." });

  return out;
}

export function summarize(checks: ComplianceCheck[], atp?: number, uaopVersion = "1.0.0"): ComplianceStatus {
  const violations = checks.filter((c) => !c.passed);
  const status: ComplianceStatus["status"] =
    violations.length === 0 ? "certified" : violations.length <= 2 ? "degraded" : "suspended";
  return {
    status,
    atp,
    uaop_version: uaopVersion,
    active_violations: violations.map((v) => `UAOP Article ${v.article}: ${v.rule}`),
    last_updated: new Date().toISOString(),
  };
}
