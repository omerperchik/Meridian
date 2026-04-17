/**
 * Vector search path: queries the `embeddings` table when available.
 *
 * The worker at scoring/embeddings.py populates this table. When DATABASE_URL
 * isn't configured or the table is empty, callers fall back to the TF-IDF
 * path in lib/search.ts.
 *
 * We do cosine similarity in SQL for portability. If pgvector is installed
 * and a second migration converts the jsonb column to vector(N), swap to the
 * native `<=>` operator for a 10–100x speedup.
 */
import { db, hasDb } from "@/db/client";
import * as schema from "@/db/schema";
import { sql, eq } from "drizzle-orm";

let hashbagCache: { dim: number } | null = null;
async function computeHashbag(text: string, dim: number): Promise<number[]> {
  const enc = new TextEncoder();
  const v = new Float32Array(dim);
  for (const raw of text.toLowerCase().split(/\s+/).filter(Boolean)) {
    const bytes = enc.encode(raw);
    const h = await crypto.subtle.digest("SHA-1", bytes);
    const view = new DataView(h);
    const word = view.getUint32(0, false);
    const idx = word % dim;
    const sign = (word >>> 31) & 1 ? -1 : 1;
    v[idx] += sign;
  }
  let n = 0;
  for (const x of v) n += x * x;
  n = Math.sqrt(n) || 1;
  const out = new Array(dim);
  for (let i = 0; i < dim; i++) out[i] = v[i] / n;
  return out;
}

function cosineJson(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

export interface VectorMatch {
  kind: string;
  ref_id: string;
  score: number;
}

/**
 * Run a vector query against the embeddings table using the hash-bag path.
 * Returns `null` if the DB is unavailable or the table is empty — caller
 * should fall back to TF-IDF.
 */
export async function vectorSimilar(query: string, kind?: string, k = 10): Promise<VectorMatch[] | null> {
  if (!hasDb) return null;
  try {
    // Peek at one row to discover the model's dimension
    const [sample] = await db.select({ dim: schema.embeddings.dim, model: schema.embeddings.model }).from(schema.embeddings).limit(1);
    if (!sample) return null;
    const dim = sample.dim;
    // If the stored model is the hash-bag we can compute the query vector locally.
    // Otherwise we need to call the same provider the worker used — that requires
    // the API key at request time. We don't want runtime API calls on the hot path,
    // so for non-local models we return null and let TF-IDF take over.
    if (sample.model !== "meridian-hashbag-v1") return null;

    const q = await computeHashbag(query, dim);
    const rows = await db
      .select({ kind: schema.embeddings.kind, ref: schema.embeddings.refId, vec: schema.embeddings.vector })
      .from(schema.embeddings)
      .where(kind ? eq(schema.embeddings.kind, kind) : sql`TRUE`);
    const scored = rows.map((r) => ({ kind: r.kind, ref_id: r.ref, score: cosineJson(q, r.vec as number[]) }));
    return scored.sort((a, b) => b.score - a.score).slice(0, k);
  } catch (err) {
    console.error("[vectorSimilar] failed:", err);
    return null;
  }
}
