/**
 * @meridian/sdk — TypeScript SDK v2.0
 *
 * Minimally invasive middleware for AI agents. Reports aggregated behavioral
 * telemetry to Meridian — no task content, no user data, no payloads. Audit
 * logs stay local (hash chain only is transmitted).
 *
 * Quickstart:
 *   import { Meridian } from "@meridian/sdk";
 *   const meridian = new Meridian({ agentId: "agt-001", apiKey: process.env.MERIDIAN_API_KEY });
 *
 *   await meridian.instrument("code_review", async (ctx) => {
 *     // your tool logic
 *     return result;
 *   });
 */
import type {
  MeridianOptions,
  TelemetryEvent,
  ComplianceStatus,
  ThreatMatch,
} from "./types";
import { AuditChain, defaultWriter } from "./audit";
import { detect, isSuspiciousHost } from "./detectors";
import { check as complianceCheck, summarize as complianceSummary, type CallContext, type ComplianceCheck } from "./compliance";
import { LatencyReservoir, Counter } from "./metrics";

export * from "./types";
export * from "./compliance";
export * from "./detectors";

const SDK_VERSION = "2.0.0";

export class Meridian {
  public readonly opts: Required<Omit<MeridianOptions, "apiKey" | "uaopVersion" | "onEvent">> &
    Pick<MeridianOptions, "apiKey" | "uaopVersion" | "onEvent">;
  private readonly audit: AuditChain;
  private readonly latency = new LatencyReservoir();
  private readonly success = new Counter();
  private readonly failure = new Counter();
  private readonly buffer: TelemetryEvent[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private currentStatus: ComplianceStatus = {
    status: "uncertified",
    uaop_version: "1.0.0",
    active_violations: [],
    last_updated: new Date().toISOString(),
  };
  private tokensIn = 0;
  private tokensOut = 0;

  constructor(options: MeridianOptions) {
    this.opts = {
      endpoint: options.endpoint ?? "https://meridian.ai/v1",
      auditLogPath: options.auditLogPath === null ? null : options.auditLogPath ?? ".meridian/audit.log",
      flushIntervalMs: options.flushIntervalMs ?? 30_000,
      batchSize: options.batchSize ?? 50,
      offline: options.offline ?? false,
      agentId: options.agentId,
      apiKey: options.apiKey,
      uaopVersion: options.uaopVersion ?? "1.0.0",
      onEvent: options.onEvent,
    };
    this.audit = new AuditChain(defaultWriter(this.opts.auditLogPath));
    this.currentStatus.uaop_version = this.opts.uaopVersion || "1.0.0";
    this.startFlushLoop();
  }

  // ── Core instrumentation ─────────────────────────────────────────
  /**
   * Wrap an async operation with full Meridian instrumentation:
   *   - security-monitor scan on any stringified inputs
   *   - compliance check against UAOP
   *   - latency/cost tracking
   *   - audit-trail append
   *   - telemetry emission (batched)
   *
   * The wrapped operation receives a `ctx` you can populate to enrich the
   * compliance check (declaredCapabilities, isIrreversible, pii, etc.).
   */
  async instrument<T>(
    taskType: string,
    fn: (ctx: CallContext) => Promise<T>,
    initial?: Partial<CallContext>,
  ): Promise<T> {
    const ctx: CallContext = { ...initial };
    const start = Date.now();
    const attackAttempts: ThreatMatch[] = [];

    // Pre-scan arguments if the caller provided a `requestedAction` string
    if (ctx.requestedAction) attackAttempts.push(...detect(ctx.requestedAction));

    let success = true;
    let errorType: string | undefined;
    try {
      const result = await fn(ctx);
      return result;
    } catch (err: any) {
      success = false;
      errorType = err?.name || "UnknownError";
      throw err;
    } finally {
      const elapsed = Date.now() - start;
      this.latency.observe(elapsed);
      (success ? this.success : this.failure).inc();

      const checks = complianceCheck(ctx);
      const violations = checks.filter((c) => !c.passed).map((c) => c.article);
      this.currentStatus = complianceSummary(checks, this.currentStatus.atp, this.opts.uaopVersion);

      const { seq, entry_hash } = await this.audit.append(taskType, {
        success,
        elapsed,
        violations,
        attack_hits: attackAttempts.map((a) => a.id),
      });

      const ev: TelemetryEvent = {
        agentId: this.opts.agentId,
        uaopVersion: this.opts.uaopVersion,
        taskType,
        successCount: success ? 1 : 0,
        failureCount: success ? 0 : 1,
        latencyP50: this.latency.percentile(50),
        latencyP95: this.latency.percentile(95),
        errorType,
        uaopArticlesTriggered: violations,
        attackAttemptCategory: attackAttempts[0]?.category,
        anomalyFlag: attackAttempts.length > 0,
        tokensIn: this.tokensIn || undefined,
        tokensOut: this.tokensOut || undefined,
        auditLogHash: entry_hash,
        hashChainSeq: seq,
        sdkLang: "ts",
        sdkVersion: SDK_VERSION,
      };
      this.opts.onEvent?.(ev);
      this.enqueue(ev);
    }
  }

  // ── Security-monitor helpers ────────────────────────────────────
  /** Run the built-in injection/jailbreak detectors over arbitrary untrusted text. */
  scanInput(input: string): ThreatMatch[] {
    return detect(input);
  }

  /** Heuristic flag for DNS-encoding exfil patterns in outbound host names. */
  flagSuspiciousHost(host: string): boolean {
    return isSuspiciousHost(host);
  }

  // ── Cost tracker ────────────────────────────────────────────────
  recordTokens(inTok: number, outTok: number) {
    this.tokensIn += inTok;
    this.tokensOut += outTok;
  }

  // ── Compliance endpoint (HTTP handler factory) ──────────────────
  /**
   * Returns a small HTTP handler you can mount at /meridian/compliance.
   * Works with any framework: `(req, res) => handler(req, res)` in Node,
   * or via `export const GET = meridian.complianceHandler()` in Next.js.
   */
  complianceHandler(): (req: Request) => Response {
    return () =>
      new Response(JSON.stringify(this.currentStatus, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=10",
        },
      });
  }

  // ── Telemetry flushing ──────────────────────────────────────────
  private enqueue(ev: TelemetryEvent) {
    this.buffer.push(ev);
    if (this.buffer.length >= this.opts.batchSize) this.flush().catch(() => {});
  }

  private startFlushLoop() {
    if (this.flushTimer || this.opts.offline) return;
    this.flushTimer = setInterval(() => {
      this.flush().catch(() => {});
    }, this.opts.flushIntervalMs);
    // Allow Node to exit cleanly.
    // @ts-expect-error — unref on NodeTimers
    this.flushTimer.unref?.();
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0 || this.opts.offline) return;
    const batch = this.buffer.splice(0, this.buffer.length);
    try {
      await fetch(`${this.opts.endpoint}/telemetry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.opts.apiKey ? { Authorization: `Bearer ${this.opts.apiKey}` } : {}),
          "User-Agent": `meridian-sdk-ts/${SDK_VERSION}`,
        },
        body: JSON.stringify({ events: batch }),
      });
    } catch (err) {
      // Push back, let retry happen on next flush
      this.buffer.unshift(...batch);
    }
  }

  /** Stop the background flush loop. Ideal for graceful shutdown. */
  async close() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    await this.flush();
  }
}

export default Meridian;
