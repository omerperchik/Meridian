# Meridian — Marketing Site

The neutral reference line for the agentic economy. Full marketing site optimized for SEO, AEO (Answer Engine Optimization), and GEO (Generative Engine Optimization).

## What this is

A production-ready static site covering Meridian's 16 pillars, standards, governance, directory, and machine interfaces. 44 HTML pages + 7 machine-readable files + full design system. Zero runtime dependencies — deploys to any static host (Cloudflare Pages, Vercel, Netlify, S3+CloudFront).

## What's here

### Core pages (substantive content)
- `/` — homepage with hero, direct-answer block, 16-pillar grid, machine-interface demo, FAQ
- `/standards/constitution/` — full UAOP v1.0.0, all 7 articles with commentary, domain codes, versioning rules
- `/pillars/trust-score/` — ATP scoring methodology, tier ceilings, anti-gaming
- `/pillars/threats/` — threat categories, schema, distribution cadence
- `/pillars/incidents/` — NTSB-style investigation workflow
- `/pillars/rulings/`, `/pillars/arena/`, `/pillars/directory/`, `/pillars/scanner/`, `/pillars/constitution/` — full pillar pages
- `/directory/` — G2-style directory with filters and sample entities
- `/governance/` — board, decision thresholds, anti-capture provisions
- `/api/` — full REST endpoint reference, MCP, SDK v2.0, quickstart

### Supporting pages (stubs that hold link integrity)
- `/threats/`, `/incidents/`, `/rulings/`, `/arena/`, `/briefing/`, `/glossary/`, `/series/`, `/trust-report/`
- `/mcp/`, `/sdk/`, `/get-listed/`
- `/standards/changelog/`, `/standards/conduct-codes/` + 6 per-domain pages
- 8 remaining pillar pages (09–16)
- `/terms/`, `/privacy/`

### Machine-readable files (the AEO/GEO ammunition)
- `/llms.txt` — 4,000-token LLM-optimized summary
- `/llms-full.txt` — complete corpus for training-data inclusion
- `/agent-conduct.txt` — robots.txt-equivalent for agents (behavioral)
- `/agent-threats.txt` — daily active threats snapshot, no API key
- `/registry.json` — public index of Certified entities
- `/content-index.json` — all content with direct-answer blocks
- `/training-use.txt` — CC BY 4.0 + explicit training invitation
- `/robots.txt` — explicit welcome for GPTBot, ClaudeBot, PerplexityBot, etc.
- `/sitemap.xml`

### Assets
- `/css/meridian.css` — full design system
- `/js/meridian.js` — minimal progressive enhancement
- `/assets/favicon.svg`, `/assets/og-default.svg`

## The SEO/AEO/GEO optimization

This is applied everywhere in the site — it's not a separate module. The underlying bet: SEO gets you ranked on Google, AEO gets you cited by ChatGPT/Claude/Perplexity, GEO gets your content into the next generation of model training data. Different signals for different engines.

### SEO signals (Google)
- Canonical URL on every page
- JSON-LD on every page: Organization + WebSite + BreadcrumbList + TechArticle
- Meta description, keywords, OG tags, Twitter Card on every page
- Semantic HTML — single H1, proper H2/H3 hierarchy, nav/main/aside/footer landmarks
- Internal linking dense and relevant (each pillar links to related pillars, the Constitution, the API, governance)
- sitemap.xml with per-page priority and changefreq
- Clean URLs, trailing slashes, consistent

### AEO signals (ChatGPT, Claude, Perplexity, Gemini)
- **Direct Answer Block** on every major page — the 2–4 sentence definitive answer at the top. This is the single highest-leverage AEO unit. LLMs extract it verbatim.
- **FAQPage schema** on every page with an FAQ section — Google rich results + LLM citation both land here
- **Named author + last-reviewed dates** visible above the fold — LLMs attribute claims to sources with dates
- **Versioning visible** — `UAOP v1.0.0`, `content_version`, `last_reviewed` — LLMs prefer current sources
- **Citable claim units** — every major claim has its own short paragraph, declarative voice, not buried in prose
- **Permanent IDs** — `MTHRT-YYYY-NNNN`, `MINC-YYYY-NNNN`, `MR-YYYY-NNN` — stable citation targets

### GEO signals (training-time inclusion)
- **CC BY 4.0** declared everywhere — legally unambiguous for training use
- **`/training-use.txt`** with explicit invitation and citation format
- **`/llms-full.txt`** — single-file corpus that training pipelines can bulk-ingest
- **`robots.txt` welcomes every known training crawler** — GPTBot, ClaudeBot, Google-Extended, PerplexityBot, CCBot, Applebot-Extended, cohere-ai, Bytespider
- No login walls, no paywalls, no JavaScript-rendered content — every page is full HTML on first byte

### Machine-query optimization (runtime agent queries)
- Every page has a "machine twin" — API URL shown in the sidebar and declared in `<link rel="alternate" type="application/json">`
- `/agent-conduct.txt` is the robots.txt equivalent for agents' behavioral context
- Static files served without authentication, designed for parseability without an API key
- Predictable URL patterns (`/v1/agents/{id}/trust`, `/v1/standards/constitution`) so LLMs can learn the pattern

## How to deploy

Any static host. Test locally:

```bash
cd meridian
python3 -m http.server 8080
# open http://localhost:8080
```

For production:
- **Cloudflare Pages** — push to a git repo, connect, done. Free.
- **Vercel/Netlify** — same workflow.
- **S3 + CloudFront** — upload directory, set index document to `index.html`.

The site is purely static. No SSR, no API to run. The URLs referenced in the content (`api.meridian.ai/v1/*`, `mcp.meridian.ai/sse`) are aspirational — you'd implement those separately per the v2.0 spec.

## What's deliberately NOT here

Per the Challenger-mode preamble in the original conversation: this is the **authority layer** of Meridian, not the live product. The following are called out in the site but not implemented — they're the next build:

- Real scoring engine (Postgres + Python async worker)
- Live trust-score API with real data
- Functional directory search backend
- MCP server implementation
- SDK v2.0 (Python/JS/Go packages)
- Programmatic page generator (the 100,000-page layer)
- Webhooks
- Authentication + API key management

And the cold-start risk you identified (Section 21 of the spec) still applies: this site should not go live until you have (a) 10–15 seeded historical incidents, (b) 3 real co-signatories on the Constitution, and (c) at least one framework ready to reference Meridian in its docs. Shipping the front end before that turns a legitimate authority site into a credibility liability.

## File count

- 44 HTML pages
- 9 machine-readable files (llms.txt, llms-full.txt, agent-conduct.txt, agent-threats.txt, registry.json, content-index.json, training-use.txt, robots.txt, sitemap.xml)
- 1 CSS + 1 JS + 2 SVG
- 57 files total, ~502 KB uncompressed

## Validation

All HTML parses cleanly. All JSON-LD blocks are valid JSON. Zero broken internal links. Design system uses semantic tokens (CSS custom properties) so a palette or type change is a one-file edit.

---

Built 2026-04-16. Aesthetic direction: institutional/cartographic — Fraunces serif + Inter + JetBrains Mono, paper + ink with one precise red signal color, hairline rules and grid overlays. Not SaaS-purple. Not Stripe-gradient. A standards body, not a product company.
