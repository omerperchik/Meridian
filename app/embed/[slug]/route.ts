/**
 * Embeddable live widget — returns standalone HTML designed to sit in an iframe.
 * Sizes: 360x92 (default) matches the full SVG badge, but renders as real HTML
 * so the score is hoverable, linkable, and a11y-readable.
 *
 *   <iframe src="https://meridian.ai/embed/atlas-finance"
 *           width="380" height="92"
 *           style="border:0;border-radius:10px"
 *           loading="lazy"
 *           title="Meridian score"></iframe>
 *
 * Query params:
 *   ?theme=dark|light   (default: dark to match Meridian visuals)
 */
import { REGISTRY, getEntity } from "@/data/registry";
import { scoreColor, tierColor, COLORS } from "@/lib/badge";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams() {
  return REGISTRY.map((e) => ({ slug: e.slug }));
}

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const url = new URL(req.url);
  const theme = url.searchParams.get("theme") === "light" ? "light" : "dark";
  const e = getEntity(slug);

  const dark = {
    bg: "#08090a",
    surface: "#0d0e10",
    border: "#1f2023",
    text: "#f7f8f8",
    secondary: "#b4bcd0",
    tertiary: "#8a8f98",
  };
  const light = {
    bg: "#ffffff",
    surface: "#f7f8f8",
    border: "#e7e8e9",
    text: "#08090a",
    secondary: "#2a2b2e",
    tertiary: "#62666d",
  };
  const c = theme === "dark" ? dark : light;

  const body = e
    ? `<a href="${SITE.url}/directory/${e.slug}" target="_top" rel="noopener" aria-label="Meridian trust profile for ${e.name}">
  <div class="card" data-score="${Math.round(e.trust.composite)}" data-tier="${e.trust.tier}">
    <div class="bar"></div>
    <div class="body">
      <div class="logo" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#7170ff"/><stop offset="100%" stop-color="#5e6ad2"/>
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="10" stroke="url(#g)" stroke-width="1.75"/>
          <path d="M12 2v20M2 12h20" stroke="url(#g)" stroke-width="1" stroke-opacity=".5"/>
          <circle cx="12" cy="12" r="2.5" fill="url(#g)"/>
        </svg>
      </div>
      <div class="meta">
        <div class="eyebrow">MERIDIAN · UAOP v${e.constitutionVersion || SITE.constitutionVersion}</div>
        <div class="name">${escapeHtml(e.name)}</div>
        <div class="sub">v${escapeHtml(e.version)} · ${escapeHtml(e.trust.tierLabel)}</div>
      </div>
      <div class="score">
        <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="28" fill="none" stroke="${c.border}" stroke-width="4"/>
          <circle cx="32" cy="32" r="28" fill="none" stroke="${scoreColor(e.trust.composite)}"
            stroke-width="4" stroke-linecap="round"
            stroke-dasharray="${2 * Math.PI * 28}"
            stroke-dashoffset="${(2 * Math.PI * 28) * (1 - e.trust.composite / 100)}"
            transform="rotate(-90 32 32)"/>
        </svg>
        <div class="score-num" style="color:${scoreColor(e.trust.composite)}">${Math.round(e.trust.composite)}</div>
        <div class="score-label">ATP</div>
      </div>
    </div>
    <div class="tier-chip" style="color:${tierColor(e.trust.tier)};border-color:${tierColor(e.trust.tier)}33">TIER ${e.trust.tier}</div>
  </div>
</a>`
    : `<div class="card unlisted"><div class="body"><div class="name">Entity not in registry</div><div class="sub">Submit at ${SITE.url}/get-listed</div></div></div>`;

  const html = `<!doctype html>
<html lang="en" data-theme="${theme}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${e ? e.name : "Meridian"} — Meridian score</title>
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%;background:${c.bg};color:${c.text};
    font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
    -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
  a{color:inherit;text-decoration:none;display:block;height:100%}
  .card{position:relative;display:flex;flex-direction:column;height:100%;background:${c.surface};
    border:1px solid ${c.border};border-radius:10px;overflow:hidden;transition:transform .18s ease, border-color .18s ease}
  a:hover .card{transform:translateY(-1px);border-color:${COLORS.accent}55}
  .bar{position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(180deg,${COLORS.accent},${COLORS.accentDark})}
  .body{display:grid;grid-template-columns:36px 1fr auto;align-items:center;gap:12px;padding:14px 18px;flex:1}
  .logo{display:flex;align-items:center;justify-content:center}
  .meta{min-width:0}
  .eyebrow{font-size:10px;letter-spacing:.08em;color:${c.tertiary};font-weight:500;text-transform:uppercase}
  .name{font-size:15px;font-weight:600;color:${c.text};margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .sub{font-size:11px;color:${c.tertiary};font-family:JetBrains Mono,ui-monospace,monospace;margin-top:2px}
  .score{position:relative;width:64px;height:64px;display:flex;align-items:center;justify-content:center}
  .score-num{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:600;font-variant-numeric:tabular-nums}
  .score-label{position:absolute;bottom:6px;left:0;right:0;text-align:center;font-size:8px;color:${c.tertiary};letter-spacing:.1em;font-weight:500}
  .tier-chip{position:absolute;right:16px;bottom:10px;font-size:9px;font-weight:600;letter-spacing:.1em;
    padding:2px 8px;border:1px solid;border-radius:4px}
  .unlisted{align-items:center;justify-content:center;text-align:center;padding:16px}
</style>
</head>
<body>${body}</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
      // Allow embedding in any site's iframe:
      "Content-Security-Policy": "frame-ancestors *",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
