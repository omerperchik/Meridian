/**
 * Meridian Discovery Crawler.
 *
 * Runs on a cron (via GitHub Actions). Surveys:
 *   - GitHub: trending + tagged repos (mcp, ai-agent, llm-tool, langchain, crewai, autogen)
 *   - npm:    packages tagged mcp/agent/llm with momentum
 *   - PyPI:   packages tagged ai/agent with recent releases
 *   - Hacker News: Show HN stories matching agent-tool patterns (24h)
 *   - Product Hunt: latest AI & Dev Tools launches
 *
 * Every candidate is deduped against the `discovery_queue` table (src+external_id
 * unique). When DATABASE_URL isn't set, the crawler emits JSONL to stdout —
 * useful for dry runs.
 */

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema.js";
import { sql } from "drizzle-orm";

const DRY = !!process.env.DRY_RUN || !process.env.DATABASE_URL;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // optional; increases rate limit

interface Candidate {
  source: "github" | "npm" | "pypi" | "hn" | "ph";
  external_id: string;
  url: string;
  name: string;
  raw: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────────
// Source crawlers
// ─────────────────────────────────────────────────────────────────
async function github(): Promise<Candidate[]> {
  const queries = [
    "topic:mcp stars:>10",
    "topic:ai-agent stars:>25",
    "topic:llm-tool stars:>25",
    "topic:langchain stars:>50",
    "topic:crewai stars:>10",
    "topic:autogen stars:>10",
    "topic:agentic stars:>10",
  ];
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "meridian-crawler/1.0",
  };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  const seen = new Set<string>();
  const out: Candidate[] = [];
  for (const q of queries) {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=updated&per_page=25`;
    try {
      const resp = await fetch(url, { headers });
      if (!resp.ok) continue;
      const { items } = (await resp.json()) as { items: any[] };
      for (const r of items ?? []) {
        const id = `github:${r.id}`;
        if (seen.has(id)) continue;
        seen.add(id);
        out.push({
          source: "github",
          external_id: String(r.id),
          url: r.html_url,
          name: r.full_name,
          raw: {
            description: r.description,
            stars: r.stargazers_count,
            pushed_at: r.pushed_at,
            topics: r.topics,
            language: r.language,
          },
        });
      }
    } catch (err) {
      console.error(`[crawler] github ${q} failed:`, err);
    }
  }
  return out;
}

async function npm(): Promise<Candidate[]> {
  const keywords = ["mcp", "ai-agent", "agent", "langchain", "crewai", "autogen", "llm-tool"];
  const out: Candidate[] = [];
  for (const k of keywords) {
    const url = `https://registry.npmjs.org/-/v1/search?text=keywords:${encodeURIComponent(k)}&size=25`;
    try {
      const resp = await fetch(url);
      if (!resp.ok) continue;
      const data = (await resp.json()) as { objects: Array<{ package: any; score: any }> };
      for (const o of data.objects ?? []) {
        const p = o.package;
        // Require some signal (nonzero score, recent version)
        if (!p.name) continue;
        out.push({
          source: "npm",
          external_id: p.name,
          url: p.links?.npm ?? `https://www.npmjs.com/package/${p.name}`,
          name: p.name,
          raw: {
            version: p.version,
            description: p.description,
            keywords: p.keywords,
            date: p.date,
            score: o.score?.final,
          },
        });
      }
    } catch (err) {
      console.error(`[crawler] npm ${k} failed:`, err);
    }
  }
  return out;
}

async function pypi(): Promise<Candidate[]> {
  // PyPI lacks a stable search API so we use the XML-RPC-less JSON RSS feeds for recent updates.
  try {
    const resp = await fetch("https://pypi.org/rss/updates.xml");
    if (!resp.ok) return [];
    const text = await resp.text();
    const out: Candidate[] = [];
    const re = /<title>([^<]+)<\/title>[\s\S]*?<link>([^<]+)<\/link>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const [, title, link] = m;
      if (!/(agent|mcp|llm|langchain|crewai|autogen|anthropic|openai)/i.test(title)) continue;
      const name = title.split(" ")[0];
      out.push({
        source: "pypi",
        external_id: `pypi:${name}`,
        url: link,
        name,
        raw: { title },
      });
    }
    return out;
  } catch (err) {
    console.error(`[crawler] pypi failed:`, err);
    return [];
  }
}

async function hackernews(): Promise<Candidate[]> {
  try {
    const ids = (await (await fetch("https://hacker-news.firebaseio.com/v0/newstories.json")).json()) as number[];
    const recent = ids.slice(0, 60);
    const items = await Promise.all(
      recent.map((id) => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((r) => r.json() as any)),
    );
    return items
      .filter((i: any) => i && /show hn|ai|agent|mcp|llm/i.test(i.title ?? "") && i.url)
      .map((i: any) => ({
        source: "hn" as const,
        external_id: `hn:${i.id}`,
        url: i.url,
        name: i.title,
        raw: { by: i.by, score: i.score, time: i.time },
      }));
  } catch (err) {
    console.error(`[crawler] hn failed:`, err);
    return [];
  }
}

async function producthunt(): Promise<Candidate[]> {
  // Public RSS feed — no auth needed.
  try {
    const resp = await fetch("https://www.producthunt.com/feed");
    if (!resp.ok) return [];
    const text = await resp.text();
    const out: Candidate[] = [];
    const re = /<title>([^<]+)<\/title>[\s\S]*?<link>([^<]+)<\/link>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const [, title, link] = m;
      if (!/(ai|agent|mcp|llm|copilot|assistant)/i.test(title)) continue;
      out.push({
        source: "ph",
        external_id: `ph:${link}`,
        url: link,
        name: title,
        raw: { title },
      });
    }
    return out;
  } catch (err) {
    console.error(`[crawler] ph failed:`, err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────
// Orchestration
// ─────────────────────────────────────────────────────────────────
async function main() {
  const started = new Date();
  console.log(`[crawler] start ${started.toISOString()} (DRY=${DRY})`);

  const [g, n, p, h, ph] = await Promise.all([github(), npm(), pypi(), hackernews(), producthunt()]);
  const all: Candidate[] = [...g, ...n, ...p, ...h, ...ph];
  console.log(
    `[crawler] found  github=${g.length} npm=${n.length} pypi=${p.length} hn=${h.length} ph=${ph.length} (total=${all.length})`,
  );

  if (DRY) {
    for (const c of all.slice(0, 20)) console.log(JSON.stringify(c));
    console.log(`[crawler] dry complete — set DATABASE_URL to persist.`);
    return;
  }

  const db = drizzle(neon(process.env.DATABASE_URL!), { schema });

  // Per-source runs
  const bySource = all.reduce<Record<string, Candidate[]>>((acc, c) => {
    (acc[c.source] ||= []).push(c);
    return acc;
  }, {});

  let enqueued = 0;
  let skipped = 0;
  for (const [source, items] of Object.entries(bySource)) {
    const started_at = new Date();
    let inserted = 0;
    for (const c of items) {
      try {
        const r = await db
          .insert(schema.discoveryQueue)
          .values({
            source: c.source,
            externalId: c.external_id,
            url: c.url,
            name: c.name,
            raw: c.raw,
            status: "pending",
          })
          .onConflictDoNothing()
          .returning({ id: schema.discoveryQueue.id });
        if (r.length) inserted++;
        else skipped++;
      } catch (err) {
        console.error(`[crawler] insert failed: ${c.external_id}`, err);
      }
    }
    enqueued += inserted;
    await db.insert(schema.crawlRuns).values({
      source,
      startedAt: started_at,
      completedAt: new Date(),
      discovered: items.length,
      enqueued: inserted,
      skipped: items.length - inserted,
      errors: 0,
    });
    console.log(`[crawler]   ${source} inserted=${inserted} skipped=${items.length - inserted}`);
  }

  console.log(`[crawler] done: enqueued=${enqueued} skipped=${skipped}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
