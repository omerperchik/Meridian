/**
 * Small utility helpers used across the app.
 */

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("en-US");
}

export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", opts ?? { year: "numeric", month: "short", day: "numeric" });
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}w ago`;
  if (diffDay < 365) return `${Math.floor(diffDay / 30)}mo ago`;
  return `${Math.floor(diffDay / 365)}y ago`;
}

export function scoreColor(score: number): string {
  if (score >= 85) return "text-success";
  if (score >= 70) return "text-info";
  if (score >= 55) return "text-warning";
  return "text-danger";
}

export function scoreBgColor(score: number): string {
  if (score >= 85) return "bg-success";
  if (score >= 70) return "bg-info";
  if (score >= 55) return "bg-warning";
  return "bg-danger";
}

export function tierLabel(tier: 0 | 1 | 2 | 3): string {
  return ["Auto-discovered", "Claimed", "Premium", "SDK Integrated"][tier];
}

export function tierColor(tier: 0 | 1 | 2 | 3): string {
  return ["text-tier-0", "text-tier-1", "text-tier-2", "text-tier-3"][tier];
}

export function tierMaxScore(tier: 0 | 1 | 2 | 3): number {
  return [55, 70, 85, 100][tier];
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Content negotiation helper: Next.js App Router route handlers.
 * Returns true if the request wants JSON (Accept: application/json).
 */
export function wantsJson(request: Request): boolean {
  const accept = request.headers.get("accept") || "";
  return accept.includes("application/json");
}

/**
 * Standard API response wrapper.
 */
export function apiJson<T>(data: T, init?: ResponseInit): Response {
  return new Response(JSON.stringify({ data, meta: { version: "v1", timestamp: new Date().toISOString() } }, null, 2), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-API-Version": "v1",
      "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
      ...(init?.headers || {}),
    },
  });
}

export function apiError(code: string, message: string, status = 400): Response {
  return new Response(JSON.stringify({ error: { code, message } }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
