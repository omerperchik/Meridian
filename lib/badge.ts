/**
 * Shields.io-compatible SVG badge generator — plus larger Meridian-specific
 * composite badges. All output is pure SVG, no external font dependencies
 * (Verdana + fallback). Designed to render correctly in GitHub READMEs,
 * LinkedIn, blog posts, and Slack unfurls.
 */

// ─────────────────────────────────────────────────────────────────
// Colors (Linear-inspired + shields.io standard palette)
// ─────────────────────────────────────────────────────────────────
export const COLORS = {
  label: "#24292f",
  bg: "#ffffff",
  tier0: "#8a8f98",
  tier1: "#5e9aff",
  tier2: "#bd8cfe",
  tier3: "#4cb782",
  score: {
    excellent: "#4cb782", // >= 85
    good: "#5e9aff", // >= 70
    okay: "#f2c94c", // >= 55
    low: "#eb5757", // < 55
  },
  accent: "#5e6ad2",
  accentDark: "#4c54b5",
  text: "#ffffff",
  darkBg: "#08090a",
} as const;

export function scoreColor(score: number): string {
  if (score >= 85) return COLORS.score.excellent;
  if (score >= 70) return COLORS.score.good;
  if (score >= 55) return COLORS.score.okay;
  return COLORS.score.low;
}

export function tierColor(tier: number): string {
  return [COLORS.tier0, COLORS.tier1, COLORS.tier2, COLORS.tier3][Math.min(3, Math.max(0, tier))];
}

// ─────────────────────────────────────────────────────────────────
// Width estimation. Verdana 11px char widths (shields.io convention).
// ─────────────────────────────────────────────────────────────────
const CHAR_W_11: Record<string, number> = {
  W: 9, M: 9, m: 9, w: 9, "%": 11,
  " ": 4, ".": 4, ",": 4, ":": 4, ";": 4, "!": 4, "|": 4, "'": 4,
  i: 4, l: 4, I: 4, j: 4, f: 5, t: 5, r: 5,
};

export function textWidth(s: string, size = 11): number {
  let w = 0;
  for (const c of s) {
    const base = CHAR_W_11[c] ?? 7;
    w += base * (size / 11);
  }
  return Math.ceil(w + 10);
}

// ─────────────────────────────────────────────────────────────────
// XML-safe escaping
// ─────────────────────────────────────────────────────────────────
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─────────────────────────────────────────────────────────────────
// Flat badge (shields.io "flat" style)
// ─────────────────────────────────────────────────────────────────
export interface FlatBadgeOptions {
  label: string;
  value: string;
  color?: string; // right side
  labelColor?: string; // left side
  logo?: boolean;
  link?: string; // purely documentation; SVG can't embed links natively in README inline imgs
}

export function flatBadge({ label, value, color, labelColor, logo = true }: FlatBadgeOptions): string {
  const padding = 6;
  const logoWidth = logo ? 20 : 0;
  const labelWidth = textWidth(label) + padding * 2 + logoWidth;
  const valueWidth = textWidth(value) + padding * 2;
  const width = labelWidth + valueWidth;
  const height = 20;
  const rightColor = color || COLORS.score.good;
  const leftColor = labelColor || COLORS.label;

  const LOGO = logo
    ? `<g transform="translate(5 3)">
  <circle cx="7" cy="7" r="6.5" fill="none" stroke="#ffffff" stroke-width="1.1" opacity="0.9"/>
  <path d="M7 0.5v13M0.5 7h13" stroke="#ffffff" stroke-width="0.7" opacity="0.5"/>
  <circle cx="7" cy="7" r="2" fill="#ffffff"/>
</g>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" role="img" aria-label="${esc(label)}: ${esc(value)}">
<title>${esc(label)}: ${esc(value)}</title>
<linearGradient id="s" x2="0" y2="100%">
  <stop offset="0" stop-color="#fff" stop-opacity=".2"/>
  <stop offset="1" stop-opacity=".15"/>
</linearGradient>
<clipPath id="r"><rect width="${width}" height="${height}" rx="3" fill="#fff"/></clipPath>
<g clip-path="url(#r)">
  <rect width="${labelWidth}" height="${height}" fill="${leftColor}"/>
  <rect x="${labelWidth}" width="${valueWidth}" height="${height}" fill="${rightColor}"/>
  <rect width="${width}" height="${height}" fill="url(#s)"/>
</g>
${LOGO}
<g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="110" text-rendering="geometricPrecision" transform="scale(.1)">
  <text aria-hidden="true" x="${(labelWidth + logoWidth) * 5 + (logo ? 20 : 0)}" y="150" fill="#010101" fill-opacity=".3" textLength="${(textWidth(label)) * 10}">${esc(label)}</text>
  <text x="${(labelWidth + logoWidth) * 5 + (logo ? 20 : 0)}" y="140" textLength="${(textWidth(label)) * 10}">${esc(label)}</text>
  <text aria-hidden="true" x="${(labelWidth + valueWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" textLength="${textWidth(value) * 10}">${esc(value)}</text>
  <text x="${(labelWidth + valueWidth / 2) * 10}" y="140" textLength="${textWidth(value) * 10}">${esc(value)}</text>
</g>
</svg>`;
}

// ─────────────────────────────────────────────────────────────────
// Large composite badge (Meridian signature card, 360×80)
// ─────────────────────────────────────────────────────────────────
export interface FullBadgeOptions {
  name: string;
  score: number;
  tier: number;
  tierLabel: string;
  version?: string;
  uaopVersion?: string;
}

export function fullBadge({ name, score, tier, tierLabel, version, uaopVersion }: FullBadgeOptions): string {
  const W = 380;
  const H = 92;
  const tcolor = tierColor(tier);
  const scol = scoreColor(score);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" role="img" viewBox="0 0 ${W} ${H}" aria-label="${esc(name)} — Meridian ATP ${Math.round(score)} Tier ${tier}">
<title>${esc(name)} — Meridian ATP ${Math.round(score)} · ${esc(tierLabel)}</title>
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#0d0e10"/>
    <stop offset="100%" stop-color="#08090a"/>
  </linearGradient>
  <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="${COLORS.accent}"/>
    <stop offset="100%" stop-color="${COLORS.accentDark}"/>
  </linearGradient>
  <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#7170ff"/>
    <stop offset="100%" stop-color="${COLORS.accent}"/>
  </linearGradient>
  <clipPath id="card">
    <rect x="0" y="0" width="${W}" height="${H}" rx="10" ry="10"/>
  </clipPath>
</defs>
<g clip-path="url(#card)">
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <!-- subtle grid -->
  <path d="M0 22.5h${W}M0 45.5h${W}M0 68.5h${W}" stroke="#1f2023" stroke-width="1"/>
  <path d="M${W / 3}.5 0v${H}M${(2 * W) / 3}.5 0v${H}" stroke="#1f2023" stroke-width="1"/>
  <!-- accent bar -->
  <rect x="0" y="0" width="4" height="${H}" fill="url(#accent)"/>
  <!-- logo -->
  <g transform="translate(20 20)">
    <circle cx="14" cy="14" r="13" fill="none" stroke="url(#ring)" stroke-width="1.8"/>
    <path d="M14 1v26M1 14h26" stroke="url(#ring)" stroke-width="1.2" opacity="0.55"/>
    <circle cx="14" cy="14" r="3.5" fill="url(#ring)"/>
  </g>
  <!-- headline -->
  <text x="60" y="30" font-family="Inter,ui-sans-serif,system-ui,sans-serif" font-size="12" font-weight="500" fill="#8a8f98" letter-spacing="0.08em">MERIDIAN · UAOP v${esc(uaopVersion || "1.0.0")}</text>
  <text x="60" y="52" font-family="Inter,ui-sans-serif,system-ui,sans-serif" font-size="17" font-weight="600" fill="#f7f8f8">${esc(truncate(name, 28))}</text>
  <text x="60" y="72" font-family="JetBrains Mono,ui-monospace,Menlo,Monaco,monospace" font-size="11" fill="#62666d">${version ? `v${esc(version)} · ` : ""}${esc(tierLabel)}</text>
  <!-- score ring -->
  <g transform="translate(${W - 85} ${H / 2})">
    <circle cx="0" cy="0" r="30" fill="none" stroke="#1f2023" stroke-width="4"/>
    ${scoreArc(score, 30, scol)}
    <text x="0" y="4" font-family="Inter,ui-sans-serif,system-ui,sans-serif" font-size="22" font-weight="600" fill="${scol}" text-anchor="middle">${Math.round(score)}</text>
    <text x="0" y="18" font-family="Inter,ui-sans-serif,system-ui,sans-serif" font-size="8" font-weight="500" fill="#62666d" text-anchor="middle" letter-spacing="0.1em">ATP</text>
  </g>
  <!-- tier chip -->
  <g transform="translate(${W - 138} ${H - 20})">
    <rect x="0" y="0" width="46" height="14" rx="3" fill="${tcolor}22" stroke="${tcolor}66" stroke-width="0.5"/>
    <text x="23" y="10" font-family="Inter,ui-sans-serif,system-ui,sans-serif" font-size="9" font-weight="600" fill="${tcolor}" text-anchor="middle">TIER ${tier}</text>
  </g>
</g>
</svg>`;
}

function scoreArc(score: number, r: number, color: string): string {
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const circ = 2 * Math.PI * r;
  const offset = circ - pct * circ;
  return `<circle cx="0" cy="0" r="${r}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${offset}" transform="rotate(-90)"/>`;
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + "…";
}

// ─────────────────────────────────────────────────────────────────
// Shared response helper — CDN-cacheable SVG
// ─────────────────────────────────────────────────────────────────
export function svgResponse(svg: string): Response {
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      // 5 min at edge, serve stale for a day while revalidating
      "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
    },
  });
}
