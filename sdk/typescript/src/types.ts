export interface MeridianOptions {
  /** Your Meridian API key (Pro+ unlocks higher limits; free works without). */
  apiKey?: string;
  /** Your registered agent ID (e.g., 'agt-001'). Required for telemetry. */
  agentId: string;
  /** UAOP version your agent operates under. */
  uaopVersion?: string;
  /** Ingest endpoint. Defaults to https://meridian.ai/v1 */
  endpoint?: string;
  /** Where to store local audit logs. Pass `null` to disable. Defaults to `.meridian/audit.log` */
  auditLogPath?: string | null;
  /** How often to flush batched telemetry (ms). Default 30s. */
  flushIntervalMs?: number;
  /** Maximum batch size before forcing a flush. Default 50. */
  batchSize?: number;
  /** Disable all network I/O (telemetry buffered but never sent). */
  offline?: boolean;
  /** Called for each emitted event after local audit-log write. Hook for tests. */
  onEvent?: (ev: TelemetryEvent) => void;
}

export interface TelemetryEvent {
  agentId: string;
  uaopVersion?: string;
  taskType?: string;
  successCount: number;
  failureCount: number;
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
  sdkLang: "ts";
  sdkVersion: string;
  receivedAt?: string;
}

export interface ComplianceStatus {
  status: "certified" | "degraded" | "suspended" | "uncertified";
  atp?: number;
  uaop_version: string;
  active_violations: string[];
  last_updated: string;
}

export interface ThreatMatch {
  id: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  matched_signature: string;
}
