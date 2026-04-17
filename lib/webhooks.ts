/**
 * Webhook delivery: emit, sign, enqueue, retry.
 *
 * Outbound signature header: `X-Meridian-Signature: t=<unix>,v1=<hex>`
 * Signed as: HMAC-SHA256(secret, `${t}.${body}`) — Stripe-style.
 *
 * Retries follow exponential backoff: 1m, 5m, 25m, 2h, 10h, 1d, 3d (dead).
 */
import { db, hasDb } from "@/db/client";
import * as schema from "@/db/schema";
import { eq, and, lte, sql } from "drizzle-orm";

export type WebhookEvent =
  | "trust.score.changed"
  | "threat.published"
  | "incident.filed"
  | "incident.ruling"
  | "ruling.published"
  | "standards.updated";

const BACKOFF_MINUTES = [1, 5, 25, 120, 600, 1440, 4320]; // seven attempts then dead

async function hmacHex(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signPayload(secret: string, bodyJson: string): Promise<string> {
  const t = Math.floor(Date.now() / 1000);
  const signature = await hmacHex(secret, `${t}.${bodyJson}`);
  return `t=${t},v1=${signature}`;
}

/**
 * Emit an event to all matching webhook subscriptions.
 * If no DB is configured this is a silent no-op (keeps deploys simple).
 */
export async function emit(event: WebhookEvent, payload: Record<string, unknown>): Promise<void> {
  if (!hasDb) return;
  try {
    const subs = await db
      .select()
      .from(schema.webhookSubscriptions)
      .where(eq(schema.webhookSubscriptions.active, true));
    const matched = subs.filter((s) => (s.events as string[]).includes(event));
    if (!matched.length) return;
    for (const s of matched) {
      await db.insert(schema.webhookDeliveries).values({
        subscriptionId: s.id,
        event,
        payload,
        status: "pending",
        attempts: 0,
        nextAttemptAt: new Date(),
      });
    }
  } catch (err) {
    console.error("[webhooks] emit failed", err);
  }
}

/**
 * Deliver one pending batch. Called by the /v1/admin/webhooks/drain endpoint
 * (which is invoked on a cron). Returns a report.
 */
export async function drain(limit = 25): Promise<{ attempted: number; delivered: number; failed: number; dead: number }> {
  if (!hasDb) return { attempted: 0, delivered: 0, failed: 0, dead: 0 };
  const now = new Date();
  const due = await db
    .select()
    .from(schema.webhookDeliveries)
    .where(and(eq(schema.webhookDeliveries.status, "pending"), lte(schema.webhookDeliveries.nextAttemptAt, now)))
    .limit(limit);
  if (!due.length) return { attempted: 0, delivered: 0, failed: 0, dead: 0 };

  const subs = await db.select().from(schema.webhookSubscriptions);
  const subById = new Map(subs.map((s) => [s.id, s]));

  let delivered = 0;
  let failed = 0;
  let dead = 0;

  for (const d of due) {
    const sub = subById.get(d.subscriptionId);
    if (!sub || !sub.active) {
      await db
        .update(schema.webhookDeliveries)
        .set({ status: "dead", lastError: "subscription disabled", lastAttemptAt: new Date() })
        .where(eq(schema.webhookDeliveries.id, d.id));
      dead++;
      continue;
    }
    const body = JSON.stringify({
      id: d.id,
      event: d.event,
      delivered_at: new Date().toISOString(),
      data: d.payload,
    });
    const sig = await signPayload(sub.secret, body);
    let code = 0;
    let err: string | null = null;
    try {
      const resp = await fetch(sub.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Meridian-Signature": sig,
          "X-Meridian-Event": d.event,
          "User-Agent": "Meridian-Webhooks/1.0",
        },
        body,
      });
      code = resp.status;
      if (resp.status < 200 || resp.status >= 300) err = `HTTP ${resp.status}`;
    } catch (e: any) {
      err = e?.message ?? "network error";
    }
    const attempts = d.attempts + 1;
    if (!err) {
      await db
        .update(schema.webhookDeliveries)
        .set({
          status: "delivered",
          attempts,
          lastAttemptAt: new Date(),
          lastResponseCode: code,
          lastError: null,
        })
        .where(eq(schema.webhookDeliveries.id, d.id));
      delivered++;
    } else if (attempts >= BACKOFF_MINUTES.length) {
      await db
        .update(schema.webhookDeliveries)
        .set({
          status: "dead",
          attempts,
          lastAttemptAt: new Date(),
          lastResponseCode: code || null,
          lastError: err,
        })
        .where(eq(schema.webhookDeliveries.id, d.id));
      dead++;
    } else {
      const minutes = BACKOFF_MINUTES[attempts] || BACKOFF_MINUTES.at(-1)!;
      await db
        .update(schema.webhookDeliveries)
        .set({
          status: "pending",
          attempts,
          lastAttemptAt: new Date(),
          lastResponseCode: code || null,
          lastError: err,
          nextAttemptAt: new Date(Date.now() + minutes * 60_000),
        })
        .where(eq(schema.webhookDeliveries.id, d.id));
      failed++;
    }
  }

  return { attempted: due.length, delivered, failed, dead };
}
