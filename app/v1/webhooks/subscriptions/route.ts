/**
 * Webhook subscription management.
 * Requires a Pro or Enterprise API key.
 */
import { db, hasDb } from "@/db/client";
import * as schema from "@/db/schema";
import { authGuard } from "@/lib/auth";
import { apiError, apiJson } from "@/lib/utils";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const VALID_EVENTS = [
  "trust.score.changed",
  "threat.published",
  "incident.filed",
  "incident.ruling",
  "ruling.published",
  "standards.updated",
];

export async function GET(req: Request) {
  const guard = await authGuard(req, { requireKey: true });
  if (!guard.ok) return guard.response;
  if (!hasDb) return apiError("no_db", "Database not configured", 503);
  if (guard.principal.tier === "free") return apiError("plan_required", "Webhooks require Pro or Enterprise", 402);
  const rows = await db
    .select()
    .from(schema.webhookSubscriptions)
    .where(eq(schema.webhookSubscriptions.apiKeyId, guard.principal.apiKeyId!));
  return apiJson(
    rows.map((r) => ({ id: r.id, url: r.url, events: r.events, active: r.active, created: r.createdAt })),
    { rateLimit: guard.rl },
  );
}

export async function POST(req: Request) {
  const guard = await authGuard(req, { requireKey: true });
  if (!guard.ok) return guard.response;
  if (!hasDb) return apiError("no_db", "Database not configured", 503);
  if (guard.principal.tier === "free") return apiError("plan_required", "Webhooks require Pro or Enterprise", 402);

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return apiError("bad_request", "JSON body required", 400);
  }
  if (!body.url) return apiError("validation_error", "url required", 422);
  const events = Array.isArray(body.events) ? body.events : [];
  const invalid = events.filter((e: string) => !VALID_EVENTS.includes(e));
  if (!events.length) return apiError("validation_error", "events required", 422);
  if (invalid.length) return apiError("validation_error", `invalid events: ${invalid.join(", ")}`, 422);

  // Pro limit: 5 subscriptions
  if (guard.principal.tier === "pro") {
    const existing = await db
      .select({ n: schema.webhookSubscriptions.id })
      .from(schema.webhookSubscriptions)
      .where(eq(schema.webhookSubscriptions.apiKeyId, guard.principal.apiKeyId!));
    if (existing.length >= 5)
      return apiError("quota_exceeded", "Pro plan limit is 5 webhook subscriptions", 402);
  }

  const id = `whs_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
  const secretBytes = crypto.getRandomValues(new Uint8Array(32));
  const secret = `whsec_${Array.from(secretBytes).map((b) => b.toString(16).padStart(2, "0")).join("")}`;
  await db.insert(schema.webhookSubscriptions).values({
    id,
    apiKeyId: guard.principal.apiKeyId!,
    url: body.url,
    secret,
    events,
    active: true,
  });
  return apiJson(
    { id, url: body.url, events, active: true, secret, notes: "Save the secret now — it is shown once." },
    { status: 201, rateLimit: guard.rl },
  );
}
