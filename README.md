# Meridian — The Operating Standard for AI Agents

Full-stack implementation of Meridian Full Spec v2.0. Sixteen product pillars, real infrastructure:
live trust scoring, SDK ingestion, open crawler, scheduled scoring engine, semantic search,
HMAC-signed webhooks, running MCP server, Arena benchmark runner.

## Monorepo layout

```
app/                    Next.js 15 App Router — web + /v1 API + /mcp/sse
components/ lib/ data/  Shared UI + helpers + canonical fixture data
db/                     Drizzle schema, migrations, seed
sdk/typescript/         @meridian/sdk      (npm package)
sdk/python/             meridian-sdk       (PyPI package)
crawler/                Discovery crawler  (GitHub Actions)
scoring/                ATP scoring engine (GitHub Actions, Python)
arena/                  Benchmark runner   (GitHub Actions)
.github/workflows/      Cron schedules for crawler, scoring, webhooks, arena
```

## What's live

### Web + API
- 662 statically-generated pages covering all 16 pillars.
- REST API v1 — full OpenAPI 3.1 at `/v1/openapi.json`, 40+ endpoints.
- API-key auth + per-tier rate limiting (Free 100/day, Pro 10k/day, Enterprise unlimited).
- HMAC-SHA256-signed webhooks with exponential-backoff retry (7 attempts → dead).
- SDK telemetry ingress at `/v1/telemetry`.
- MCP server (SSE) at `/mcp/sse` — 9 tools callable by any MCP-aware agent.

### Data
- Postgres schema (Drizzle) with 18 tables; graceful fallback to TypeScript fixtures when `DATABASE_URL` is unset.
- Canonical seed: 20 entities, 12 threats, 13 incidents, 6 rulings, 8 benchmark suites, 36 glossary terms, 10 regulations.
- TF-IDF cosine semantic search for rulings and registry recommendations.

### SDKs
- `@meridian/sdk` (TypeScript) — all 7 modules: telemetry, compliance monitor, security monitor, audit trail, compliance endpoint, cost tracker, durability monitor.
- `meridian-sdk` (Python) — same surface, same detector rules, same hash-chain audit.
- Both are MIT, emit no task content or user data, and expose `/meridian/compliance`.

### Autonomous workers (GitHub Actions)
- **Crawler** — every 6h: GitHub / npm / PyPI / Hacker News / Product Hunt.
- **Scoring engine** — hourly: recomputes ATP composites from telemetry, threats, incidents, benchmarks, attestations.
- **Webhook drain** — every 5m: sends pending deliveries, retries with backoff.
- **Arena runner** — hourly: executes benchmark suites against submitted entities.

## Run locally

```bash
npm install
npm run dev                 # http://localhost:3000
```

No configuration needed — everything serves from TypeScript fixtures.

## Deploy to a VPS

```bash
curl -fsSL https://raw.githubusercontent.com/omerperchik/Meridian/main/deploy.sh | bash
```

One-liner: installs Node 20, clones, builds, installs a systemd service on port 4040.
Re-run any time to pull + redeploy.

## Turn on live infrastructure

1. **Provision Postgres** (free at [neon.tech](https://neon.tech)).
2. Create `~/meridian/.env.local`:
   ```
   DATABASE_URL=postgres://…@neon.tech/meridian?sslmode=require
   ADMIN_TOKEN=$(openssl rand -hex 32)
   NEXT_PUBLIC_SITE_URL=https://your-domain
   ```
3. Generate migrations + seed:
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```
4. Re-run `deploy.sh` — systemd picks up the env file automatically.

### Enable GitHub Actions workers

In the repo's **Settings → Secrets and variables → Actions**, add:

| Secret | Purpose |
|---|---|
| `DATABASE_URL` | Crawler, scoring, arena write target |
| `ADMIN_TOKEN` | Webhook drain auth |
| `MERIDIAN_URL` | e.g. `https://your-domain.com` |
| `GH_DISCOVERY_TOKEN` | (optional) GitHub PAT for higher crawl rate limit |

That's it — the four workflows self-schedule.

## Publish the SDKs

```bash
# TypeScript
cd sdk/typescript && npm install && npm run build
npm publish --access public   # once you own the @meridian scope

# Python
cd sdk/python && python -m build && twine upload dist/*
```

## Honest caveats

- **Arena sandboxing** uses operator-exposed test endpoints. Real container isolation (Firecracker, CF containers) is out of scope for this reference build — see `arena/runner.ts` for the contract your agent's test endpoint must implement.
- **Scoring algorithm v1** is the reference from spec §16.3. It smooths heavily against prior scores, so fresh signal takes a few runs to move composites. Tune constants in `scoring/engine.py`.
- **Anti-ring detection** for attestations is a placeholder flag in schema; the nightly job that sets `anti_ring_flag` is out of scope for this pass.
- **pgvector** path is plumbed through `lib/search.ts` but the default is TF-IDF cosine. Embeddings generation job is a future add.

## License

Content: CC BY 4.0 (training use explicitly invited — see `/training-use.txt`).
Code: MIT.
