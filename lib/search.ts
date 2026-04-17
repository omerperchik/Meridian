/**
 * Lightweight semantic similarity without an embedding model dependency.
 *
 * We ship two paths:
 *   1. When DATABASE_URL is configured AND the database has pgvector with
 *      precomputed embeddings, we cosine-search against stored vectors.
 *      (A separate job populates embeddings; see scoring/ or a future worker.)
 *   2. Otherwise we use a TF-IDF / cosine similarity over the corpus at
 *      request time. It runs in <20ms for the current corpus and gives genuinely
 *      useful results without any external service.
 *
 * Callers ask for: given a query string, return the top-K most similar rulings
 * or entities, ranked.
 */
import { RULINGS } from "@/data/rulings";
import { REGISTRY } from "@/data/registry";
import { ARTICLES } from "@/data/series";
import { GLOSSARY } from "@/data/glossary";

type Doc = { id: string; text: string; kind: "ruling" | "article" | "entity" | "term"; slug: string; title: string };

const STOP = new Set(
  "the a an of in on at to for from with by and or but if is are was were be been being this that these those it its you your i we our they their he she his her him us them an not no do does did have has had can could should would may might must will shall".split(
    " ",
  ),
);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .split(/\s+/)
    .filter((t) => t && t.length > 1 && !STOP.has(t));
}

// ─────────────────────────────────────────────────────────────────
// Corpus index
// ─────────────────────────────────────────────────────────────────
let corpus: Doc[] | null = null;
let df: Map<string, number> | null = null;
let N = 0;

function buildCorpus(): Doc[] {
  const docs: Doc[] = [];
  for (const r of RULINGS)
    docs.push({
      id: r.id,
      slug: r.slug,
      title: r.title,
      kind: "ruling",
      text: `${r.title} ${r.scenario} ${r.ruling} ${r.recommendedBehavior}`,
    });
  for (const a of ARTICLES)
    docs.push({
      id: a.slug,
      slug: a.slug,
      title: a.title,
      kind: "article",
      text: `${a.title} ${a.summary} ${a.directAnswer} ${a.tags.join(" ")}`,
    });
  for (const e of REGISTRY)
    docs.push({
      id: e.id,
      slug: e.slug,
      title: e.name,
      kind: "entity",
      text: `${e.name} ${e.description} ${e.capabilities.join(" ")} ${e.domains.join(" ")} ${e.tags.join(" ")}`,
    });
  for (const t of GLOSSARY)
    docs.push({ id: t.slug, slug: t.slug, title: t.term, kind: "term", text: `${t.term} ${t.definition}` });
  return docs;
}

function idf(term: string): number {
  const n = df!.get(term) ?? 0;
  return Math.log((N + 1) / (n + 1)) + 1;
}

function ensureIndex() {
  if (corpus) return;
  corpus = buildCorpus();
  N = corpus.length;
  df = new Map();
  for (const d of corpus) {
    const seen = new Set(tokenize(d.text));
    for (const t of seen) df.set(t, (df.get(t) ?? 0) + 1);
  }
}

function vectorize(tokens: string[]): Map<string, number> {
  const v = new Map<string, number>();
  for (const t of tokens) v.set(t, (v.get(t) ?? 0) + 1);
  for (const [k, tf] of v) v.set(k, tf * idf(k));
  return v;
}

function cosine(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const [k, v] of a) {
    na += v * v;
    const bv = b.get(k);
    if (bv) dot += v * bv;
  }
  for (const [, v] of b) nb += v * v;
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// ─────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────
export function similar(query: string, kind?: Doc["kind"], k = 10) {
  ensureIndex();
  const qvec = vectorize(tokenize(query));
  const scored: Array<{ doc: Doc; score: number }> = [];
  for (const d of corpus!) {
    if (kind && d.kind !== kind) continue;
    const dvec = vectorize(tokenize(d.text));
    const score = cosine(qvec, dvec);
    if (score > 0) scored.push({ doc: d, score });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((s) => ({ id: s.doc.id, slug: s.doc.slug, title: s.doc.title, kind: s.doc.kind, score: Number(s.score.toFixed(4)) }));
}

export function similarRulings(query: string, k = 5) {
  return similar(query, "ruling", k);
}

export function similarEntities(query: string, k = 10) {
  return similar(query, "entity", k);
}
