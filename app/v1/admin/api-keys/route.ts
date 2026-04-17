/**
 * Admin-only API key issuance endpoint.
 *
 * Requires `X-Admin-Token: $ADMIN_TOKEN` (env var).
 * Intentionally minimal: for production-grade key mgmt, build a dashboard UI.
 */
import { db, hasDb } from "@/db/client";
import * as schema from "@/db/schema";
import { generateApiKey, type Tier, TIER_LIMITS } from "@/lib/auth";
import { apiError } from "@/lib/utils";

export const dynamic = "force-dynamic";

function adminOk(req: Request): boolean {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return false;
  return req.headers.get("x-admin-token") === token;
}

export async function POST(req: Request) {
  if (!hasDb) return apiError("no_db", "Database is not configured — DATABASE_URL required.", 503);
  if (!adminOk(req)) return apiError("forbidden", "Invalid or missing X-Admin-Token", 403);

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return apiError("bad_request", "JSON body required", 400);
  }
  const tier: Tier = body.tier && ["free", "pro", "enterprise"].includes(body.tier) ? body.tier : "free";
  const label = body.label || "unlabeled";
  const ownerEmail = body.owner_email || body.ownerEmail;
  if (!ownerEmail) return apiError("validation_error", "owner_email required", 422);

  const { plaintext, id, hashedSecret } = await generateApiKey(tier);
  await db.insert(schema.apiKeys).values({
    id,
    hashedSecret,
    label,
    tier,
    ownerEmail,
    rateLimitDaily: TIER_LIMITS[tier],
  });

  return new Response(
    JSON.stringify({
      data: {
        id,
        label,
        tier,
        rate_limit_daily: TIER_LIMITS[tier],
        key: plaintext, // only returned once — store it safely
        notes: "Save this key now. It will never be shown again.",
      },
    }),
    { status: 201, headers: { "Content-Type": "application/json" } },
  );
}
