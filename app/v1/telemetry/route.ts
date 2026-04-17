/**
 * SDK telemetry ingress. Accepts a batch of TelemetryEvents, validates them,
 * persists to Postgres if configured, and emits webhook events for live
 * subscribers.
 *
 * Auth: anonymous allowed on the free tier (rate-limited by IP); Pro keys get
 * 10k/day, Enterprise is unlimited.
 */
import { db, hasDb } from "@/db/client";
import * as schema from "@/db/schema";
import { authGuard } from "@/lib/auth";
import { apiError, apiJson } from "@/lib/utils";
import { emit } from "@/lib/webhooks";

export const dynamic = "force-dynamic";

interface IncomingEvent {
  agentId: string;
  uaopVersion?: string;
  taskType?: string;
  successCount?: number;
  failureCount?: number;
  latencyP50?: number;
  latencyP95?: number;
  errorType?: string;
  uaopArticlesTriggered?: number[];
  driftDetected?: boolean;
  attackAttemptCategory?: string;
  anomalyFlag?: boolean;
  tokensIn?: number;
  tokensOut?: number;
  auditLogHash?: string;
  hashChainSeq?: number;
  sdkLang?: "ts" | "py" | "go";
  sdkVersion?: string;
}

export async function POST(req: Request) {
  const guard = await authGuard(req);
  if (!guard.ok) return guard.response;

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return apiError("bad_request", "JSON body required", 400);
  }
  const events: IncomingEvent[] = Array.isArray(body.events) ? body.events : [];
  if (events.length === 0) return apiError("validation_error", "events array required", 422);
  if (events.length > 200) return apiError("validation_error", "batch size > 200", 422);

  // Validate and sanitize (strip unexpected fields)
  const sanitized = events
    .filter((e) => typeof e.agentId === "string" && e.agentId.length > 0 && e.agentId.length <= 128)
    .slice(0, 200);
  if (sanitized.length === 0) return apiError("validation_error", "no valid events", 422);

  let persisted = 0;
  if (hasDb) {
    try {
      await db.insert(schema.telemetryEvents).values(
        sanitized.map((e) => ({
          agentId: e.agentId,
          apiKeyId: guard.principal.apiKeyId ?? null,
          uaopVersion: e.uaopVersion ?? null,
          taskType: e.taskType ?? null,
          successCount: e.successCount ?? 0,
          failureCount: e.failureCount ?? 0,
          latencyP50: e.latencyP50 ?? null,
          latencyP95: e.latencyP95 ?? null,
          errorType: e.errorType ?? null,
          uaopArticlesTriggered: e.uaopArticlesTriggered ?? [],
          driftDetected: e.driftDetected ?? false,
          attackAttemptCategory: e.attackAttemptCategory ?? null,
          anomalyFlag: e.anomalyFlag ?? false,
          tokensIn: e.tokensIn ?? null,
          tokensOut: e.tokensOut ?? null,
          auditLogHash: e.auditLogHash ?? null,
          hashChainSeq: e.hashChainSeq ?? null,
          sdkLang: e.sdkLang ?? null,
          sdkVersion: e.sdkVersion ?? null,
        })),
      );
      persisted = sanitized.length;

      // Emit notable events for live webhook subscribers.
      const anomalies = sanitized.filter((e) => e.anomalyFlag || e.driftDetected);
      for (const a of anomalies) {
        await emit("trust.score.changed", {
          agent_id: a.agentId,
          reason: a.anomalyFlag ? "anomaly_detected" : "drift_detected",
          sdk_lang: a.sdkLang,
          uaop_violations: a.uaopArticlesTriggered ?? [],
        });
      }
    } catch (err) {
      console.error("[telemetry] persist failed", err);
    }
  }

  return apiJson(
    { accepted: sanitized.length, persisted, queued_for_scoring: sanitized.length },
    { status: 202, rateLimit: guard.rl },
  );
}
