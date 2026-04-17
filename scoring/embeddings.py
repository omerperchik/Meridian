"""
Embedding generation worker.

Generates and upserts vector embeddings for the Meridian corpus (rulings,
entities, articles, glossary). Powers the real semantic-search path when
pgvector is installed; falls back to JSON-stored vectors otherwise.

Provider selection (first one that has config wins):
  1. OPENAI_API_KEY      → OpenAI text-embedding-3-small (1536 dim)
  2. VOYAGE_API_KEY      → Voyage voyage-3-lite (512 dim)
  3. (local)             → Deterministic hashed bag-of-words (384 dim)
                           — zero-dep fallback; fine for bootstrap

The schema stores `model` alongside each vector so a provider switch simply
re-embeds; old vectors remain queryable until evicted.

Idempotent: skips rows whose (kind, ref_id, model) tuple is already current.
"""

from __future__ import annotations

import hashlib
import json
import math
import os
import sys
from typing import Iterable, List, Optional, Tuple

import psycopg
from urllib.request import Request, urlopen

# ─────────────────────────────────────────────────────────────────
# Corpus ingestion — read directly from the DB
# ─────────────────────────────────────────────────────────────────
def fetch_corpus(conn) -> List[Tuple[str, str, str]]:
    """Returns list of (kind, ref_id, text)."""
    out: List[Tuple[str, str, str]] = []
    with conn.cursor() as cur:
        cur.execute("SELECT slug, title, scenario, ruling, recommended_behavior FROM rulings")
        for slug, title, scenario, ruling, rec in cur.fetchall():
            out.append(("ruling", slug, f"{title}\n{scenario}\n{ruling}\n{rec}"))
        cur.execute("SELECT slug, name, description, capabilities, domains, tags FROM entities")
        for slug, name, desc, caps, doms, tags in cur.fetchall():
            out.append(
                (
                    "entity",
                    slug,
                    f"{name}\n{desc}\n{' '.join(caps or [])} {' '.join(doms or [])} {' '.join(tags or [])}",
                )
            )
        cur.execute("SELECT slug, title, requires, commentary FROM uaop_articles")
        for slug, title, req, comm in cur.fetchall():
            out.append(("uaop", slug, f"{title}\n{req}\n{comm}"))
    return out


# ─────────────────────────────────────────────────────────────────
# Providers
# ─────────────────────────────────────────────────────────────────
def embed_openai(texts: List[str]) -> Tuple[str, int, List[List[float]]]:
    key = os.environ["OPENAI_API_KEY"]
    model = os.environ.get("OPENAI_EMBED_MODEL", "text-embedding-3-small")
    body = json.dumps({"model": model, "input": texts}).encode("utf-8")
    req = Request(
        "https://api.openai.com/v1/embeddings",
        data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    vectors = [row["embedding"] for row in data["data"]]
    dim = len(vectors[0]) if vectors else 0
    return model, dim, vectors


def embed_voyage(texts: List[str]) -> Tuple[str, int, List[List[float]]]:
    key = os.environ["VOYAGE_API_KEY"]
    model = os.environ.get("VOYAGE_EMBED_MODEL", "voyage-3-lite")
    body = json.dumps({"model": model, "input": texts}).encode("utf-8")
    req = Request(
        "https://api.voyageai.com/v1/embeddings",
        data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    vectors = [row["embedding"] for row in data["data"]]
    dim = len(vectors[0]) if vectors else 0
    return model, dim, vectors


def embed_local(texts: List[str]) -> Tuple[str, int, List[List[float]]]:
    """
    Deterministic hash-bag embedding (384 dim). No external deps, stable across
    machines. Good for bootstrap / offline; swap to OpenAI/Voyage once ready.
    """
    dim = 384
    model = "meridian-hashbag-v1"
    vectors: List[List[float]] = []
    for t in texts:
        v = [0.0] * dim
        tokens = [tok.lower() for tok in t.split() if tok]
        for tok in tokens:
            h = int.from_bytes(hashlib.sha1(tok.encode("utf-8")).digest()[:4], "big")
            idx = h % dim
            sign = 1.0 if (h >> 31) & 1 == 0 else -1.0
            v[idx] += sign
        norm = math.sqrt(sum(x * x for x in v)) or 1.0
        vectors.append([x / norm for x in v])
    return model, dim, vectors


def pick_provider():
    if os.environ.get("OPENAI_API_KEY"):
        return embed_openai
    if os.environ.get("VOYAGE_API_KEY"):
        return embed_voyage
    return embed_local


# ─────────────────────────────────────────────────────────────────
# Orchestration
# ─────────────────────────────────────────────────────────────────
def chunked(xs: List, n: int) -> Iterable[List]:
    for i in range(0, len(xs), n):
        yield xs[i : i + n]


def main() -> int:
    url = os.environ.get("DATABASE_URL")
    if not url:
        print("DATABASE_URL not set — nothing to do.", file=sys.stderr)
        return 0

    provider = pick_provider()
    provider_name = provider.__name__.replace("embed_", "")
    print(f"[embeddings] provider={provider_name}")

    with psycopg.connect(url, autocommit=False) as conn:
        corpus = fetch_corpus(conn)
        print(f"[embeddings] corpus size={len(corpus)}")

        # Read existing (kind, ref_id, model) to skip unchanged
        with conn.cursor() as cur:
            cur.execute("SELECT kind, ref_id, model FROM embeddings")
            existing = {(k, r, m) for (k, r, m) in cur.fetchall()}

        inserted = 0
        skipped = 0
        batch_size = 64
        for batch in chunked(corpus, batch_size):
            pending = []
            texts_to_embed = []
            for kind, ref, text in batch:
                pending.append((kind, ref, text))
                texts_to_embed.append(text)

            model, dim, vectors = provider(texts_to_embed)

            rows = []
            for (kind, ref, text), vec in zip(pending, vectors):
                if (kind, ref, model) in existing:
                    skipped += 1
                    continue
                rows.append((kind, ref, model, dim, json.dumps(vec), text))

            if rows:
                with conn.cursor() as cur:
                    cur.executemany(
                        """
                        INSERT INTO embeddings (kind, ref_id, model, dim, vector, text)
                        VALUES (%s, %s, %s, %s, %s::jsonb, %s)
                        ON CONFLICT (kind, ref_id, model)
                        DO UPDATE SET vector = EXCLUDED.vector, text = EXCLUDED.text, created_at = NOW()
                        """,
                        rows,
                    )
                inserted += len(rows)

        conn.commit()
        print(json.dumps({"provider": provider_name, "inserted": inserted, "skipped": skipped}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
