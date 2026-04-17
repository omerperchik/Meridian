/**
 * Audit trail: hash-chain log. Entries are stored locally; only the rolling hash
 * is transmitted to Meridian. This matches spec §13.2: audit logs stay local,
 * hash chain is shared for integrity verification.
 *
 * Log format (one JSON line per entry):
 *   { seq, at, prev_hash, entry_hash, op, meta }
 */
import type { TelemetryEvent } from "./types";

export class AuditChain {
  private prevHash = "GENESIS";
  private seq = 0;
  constructor(private readonly writer: (line: string) => Promise<void> | void) {}

  async append(op: string, meta: Record<string, unknown>): Promise<{ seq: number; entry_hash: string }> {
    this.seq += 1;
    const at = new Date().toISOString();
    const payload = JSON.stringify({ seq: this.seq, at, prev_hash: this.prevHash, op, meta });
    const entry_hash = await sha256(payload);
    const line = JSON.stringify({ seq: this.seq, at, prev_hash: this.prevHash, entry_hash, op, meta });
    await this.writer(line);
    this.prevHash = entry_hash;
    return { seq: this.seq, entry_hash };
  }

  head(): { seq: number; prev_hash: string } {
    return { seq: this.seq, prev_hash: this.prevHash };
  }
}

export async function sha256(s: string): Promise<string> {
  const data = new TextEncoder().encode(s);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Default file-backed writer (Node only). Falls back to stdout on other runtimes.
export function defaultWriter(path: string | null): (line: string) => Promise<void> {
  if (!path) return async () => {};
  if (typeof process === "undefined" || typeof require === "undefined") {
    return async (line) => {
      // Browser / edge — append to in-memory ring buffer and stream to stdout if present.
      (globalThis as any).__meridian_audit ??= [];
      (globalThis as any).__meridian_audit.push(line);
    };
  }
  return async (line) => {
    try {
      // Dynamic require to avoid bundler issues in non-Node environments.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fs = require("node:fs/promises");
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pathMod = require("node:path");
      await fs.mkdir(pathMod.dirname(path), { recursive: true });
      await fs.appendFile(path, line + "\n", "utf8");
    } catch {
      /* swallow */
    }
  };
}
