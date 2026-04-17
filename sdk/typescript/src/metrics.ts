/**
 * Latency percentiles (p50/p95) over a bounded sliding window.
 * Simple reservoir — no external deps.
 */
export class LatencyReservoir {
  private buf: number[] = [];
  constructor(private readonly cap = 512) {}

  observe(ms: number) {
    this.buf.push(ms);
    if (this.buf.length > this.cap) this.buf.shift();
  }

  percentile(p: number): number | undefined {
    if (!this.buf.length) return undefined;
    const sorted = [...this.buf].sort((a, b) => a - b);
    const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
    return sorted[idx];
  }

  clear() {
    this.buf = [];
  }
}

export class Counter {
  private n = 0;
  inc(v = 1) {
    this.n += v;
  }
  take(): number {
    const v = this.n;
    this.n = 0;
    return v;
  }
}
