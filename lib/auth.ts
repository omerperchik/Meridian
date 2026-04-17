/**
 * API key authentication and rate limiting.
 *
 * API key format: mr_{tier}_{random}
 *   - tier prefix is informational only (e.g., mr_pro_abc123def456…)
 *   - the full key is hashed on issue and the hash stored in api_keys.hashedSecret
 *
 * Rate limiting: sliding window per (key|ip, UTC day).
 *   - Free: 100/day
 *   - Pro:  10,000/day
 *   - Enterprise: effectively unlimited (10M/day ceiling to catch runaways)
 */
import { db, hasDb } from "@/db/client";
import * as schema from "@/db/schema";
import { eq, sql } from "drizzle-orm";

// Rate limits per tier
export const TIER_LIMITS = {
  free: 100,
  pro: 10_000,
  enterprise: 10_000_000,
} as const;

export type Tier = keyof typeof TIER_LIMITS;

export interface AuthedRequest {
  tier: Tier;
  apiKeyId?: string;
  ownerEmail?: string;
  ip: string;
  isAnonymous: boolean;
}

// ─────────────────────────────────────────────────────────────────────
// SHA-256 hashing (Web Crypto, runtime-agnostic)
// ─────────────────────────────────────────────────────────────────────
async function sha256(s: string): Promise<string> {
  const enc = new TextEncoder().encode(s);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Timing-safe string compare
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Generate a new API key. Returns { plaintext, id, hashedSecret }. Store the hash only.
export async function generateApiKey(tier: Tier = "free"): Promise<{
  plaintext: string;
  id: string;
  hashedSecret: string;
}> {
  const rand = crypto.getRandomValues(new Uint8Array(24));
  const suffix = Array.from(rand)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const id = `mr_${tier}_${suffix.slice(0, 8)}`;
  const plaintext = `${id}.${suffix.slice(8)}`;
  const hashedSecret = await sha256(plaintext);
  return { plaintext, id, hashedSecret };
}

// ─────────────────────────────────────────────────────────────────────
// Extract the auth principal from a Request
// ─────────────────────────────────────────────────────────────────────
export async function authenticate(req: Request): Promise<AuthedRequest> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "anonymous";

  const auth = req.headers.get("authorization") || "";
  const apiKeyHeader = req.headers.get("x-api-key");
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const plaintext = bearer || apiKeyHeader || "";

  if (!plaintext || !hasDb) {
    return { tier: "free", ip, isAnonymous: true };
  }

  try {
    const hashedSecret = await sha256(plaintext);
    const [row] = await db
      .select()
      .from(schema.apiKeys)
      .where(eq(schema.apiKeys.hashedSecret, hashedSecret))
      .limit(1);
    if (!row || row.disabled) {
      return { tier: "free", ip, isAnonymous: true };
    }
    // Update last-used timestamp (best-effort).
    db.update(schema.apiKeys)
      .set({ lastUsedAt: new Date() })
      .where(eq(schema.apiKeys.id, row.id))
      .catch(() => {});
    return {
      tier: row.tier as Tier,
      apiKeyId: row.id,
      ownerEmail: row.ownerEmail,
      ip,
      isAnonymous: false,
    };
  } catch {
    return { tier: "free", ip, isAnonymous: true };
  }
}

// ─────────────────────────────────────────────────────────────────────
// Rate limiting
// ─────────────────────────────────────────────────────────────────────
export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;
}

function dayKey(principal: AuthedRequest): string {
  const day = new Date().toISOString().slice(0, 10);
  if (principal.apiKeyId) return `apikey:${principal.apiKeyId}:${day}`;
  return `ip:${principal.ip}:${day}`;
}

export async function checkRateLimit(principal: AuthedRequest): Promise<RateLimitResult> {
  const limit = TIER_LIMITS[principal.tier];
  const reset = new Date();
  reset.setUTCHours(24, 0, 0, 0);

  if (!hasDb) {
    // In-memory bucket (per Lambda/edge instance — imperfect but graceful).
    const bucket = (globalThis as any).__meridian_rl || ((globalThis as any).__meridian_rl = new Map<string, number>());
    const key = dayKey(principal);
    const n = (bucket.get(key) || 0) + 1;
    bucket.set(key, n);
    return {
      allowed: n <= limit,
      limit,
      remaining: Math.max(0, limit - n),
      resetAt: reset,
    };
  }

  try {
    const key = dayKey(principal);
    // Upsert+increment atomically; return the new count.
    const rows = await db
      .insert(schema.rateLimitBuckets)
      .values({ key, count: 1 })
      .onConflictDoUpdate({
        target: schema.rateLimitBuckets.key,
        set: { count: sql`${schema.rateLimitBuckets.count} + 1` },
      })
      .returning({ count: schema.rateLimitBuckets.count });
    const n = rows[0]?.count ?? 1;
    return {
      allowed: n <= limit,
      limit,
      remaining: Math.max(0, limit - n),
      resetAt: reset,
    };
  } catch {
    // If the DB hiccups, fail open — better to serve than to 429 on our own error.
    return { allowed: true, limit, remaining: limit, resetAt: reset };
  }
}

// ─────────────────────────────────────────────────────────────────────
// Helper for route handlers
// ─────────────────────────────────────────────────────────────────────
export async function authGuard(
  req: Request,
  opts?: { requireKey?: boolean; minTier?: Tier },
): Promise<{ ok: true; principal: AuthedRequest; rl: RateLimitResult } | { ok: false; response: Response }> {
  const principal = await authenticate(req);
  if (opts?.requireKey && principal.isAnonymous) {
    return {
      ok: false,
      response: new Response(
        JSON.stringify({ error: { code: "auth_required", message: "This endpoint requires an API key. See /developers/api." } }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      ),
    };
  }
  const rl = await checkRateLimit(principal);
  const headers: HeadersInit = {
    "X-RateLimit-Limit": String(rl.limit),
    "X-RateLimit-Remaining": String(rl.remaining),
    "X-RateLimit-Reset": rl.resetAt.toISOString(),
  };
  if (!rl.allowed) {
    return {
      ok: false,
      response: new Response(
        JSON.stringify({
          error: {
            code: "rate_limited",
            message: `Rate limit exceeded. Tier: ${principal.tier}. Daily limit: ${rl.limit}. Resets at ${rl.resetAt.toISOString()}.`,
          },
        }),
        { status: 429, headers: { "Content-Type": "application/json", ...headers, "Retry-After": "86400" } },
      ),
    };
  }
  return { ok: true, principal, rl };
}
