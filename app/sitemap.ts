import type { MetadataRoute } from "next";
import { UAOP } from "@/data/uaop";
import { CONDUCT_CODES } from "@/data/conduct-codes";
import { REGISTRY } from "@/data/registry";
import { THREATS } from "@/data/threats";
import { INCIDENTS } from "@/data/incidents";
import { RULINGS } from "@/data/rulings";
import { ARTICLES, SERIES_META } from "@/data/series";
import { GLOSSARY } from "@/data/glossary";
import { REGULATIONS } from "@/data/regulations";
import { CATEGORIES } from "@/lib/categories";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date().toISOString();
  const rows: MetadataRoute.Sitemap = [];

  // Static top-level
  const staticPaths = [
    "", "/standards", "/standards/uaop", "/standards/conduct-codes", "/standards/changelog",
    "/trust", "/trust/feed",
    "/directory", "/directory/agents", "/directory/mcp-servers", "/directory/tools", "/directory/frameworks", "/directory/leaderboards",
    "/threats", "/incidents", "/incidents/submit", "/rulings", "/rulings/submit",
    "/arena", "/arena/submit",
    "/scanner", "/briefing",
    "/governance", "/governance/votes",
    "/developers", "/developers/api", "/developers/sdk", "/developers/mcp", "/developers/machine-files", "/developers/webhooks",
    "/learn", "/series", "/glossary", "/regulation",
    "/trust-report", "/get-listed", "/get-listed/submit",
    "/compare", "/best-of",
    "/about", "/privacy", "/terms", "/status", "/contact",
  ];
  for (const p of staticPaths) rows.push({ url: `${base}${p}`, lastModified: now, changeFrequency: "daily", priority: p === "" ? 1 : 0.8 });

  // UAOP articles
  for (const a of UAOP) rows.push({ url: `${base}/standards/uaop/${a.slug}`, lastModified: now, priority: 0.85 });
  // Conduct codes
  for (const c of CONDUCT_CODES) rows.push({ url: `${base}/standards/conduct-codes/${c.domain}`, lastModified: c.lastUpdated, priority: 0.8 });
  // Directory entities
  for (const e of REGISTRY) {
    rows.push({ url: `${base}/directory/${e.slug}`, lastModified: e.lastReviewed, priority: 0.75 });
    rows.push({ url: `${base}/security-assessment/${e.slug}`, lastModified: e.lastReviewed, priority: 0.7 });
  }
  // Threats
  for (const t of THREATS) rows.push({ url: `${base}/threats/${t.id}`, lastModified: t.lastUpdated, priority: 0.75 });
  // Incidents
  for (const i of INCIDENTS) rows.push({ url: `${base}/incidents/${i.slug}`, lastModified: i.reportedAt, priority: 0.75 });
  // Rulings
  for (const r of RULINGS) rows.push({ url: `${base}/rulings/${r.slug}`, lastModified: r.publishedAt, priority: 0.85 });
  // Series + articles
  for (const s of SERIES_META) rows.push({ url: `${base}/series/${s.slug}`, lastModified: now, priority: 0.7 });
  for (const a of ARTICLES) rows.push({ url: `${base}/learn/${a.slug}`, lastModified: a.lastReviewed, priority: 0.8 });
  // Glossary
  for (const g of GLOSSARY) rows.push({ url: `${base}/glossary/${g.slug}`, lastModified: now, priority: 0.65 });
  // Regulations
  for (const r of REGULATIONS) rows.push({ url: `${base}/regulation/${r.id}`, lastModified: r.lastUpdated, priority: 0.75 });
  // Best-of
  for (const c of CATEGORIES) rows.push({ url: `${base}/best-of/${c.slug}`, lastModified: now, priority: 0.75 });
  // Compare pairs
  for (let i = 0; i < REGISTRY.length; i++) {
    for (let j = i + 1; j < REGISTRY.length; j++) {
      if (REGISTRY[i].type === REGISTRY[j].type) {
        rows.push({ url: `${base}/compare/${REGISTRY[i].slug}-vs-${REGISTRY[j].slug}`, lastModified: now, priority: 0.55 });
      }
    }
  }

  return rows;
}
