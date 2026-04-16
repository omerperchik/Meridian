import { ARTICLES } from "@/data/series";
import { GLOSSARY } from "@/data/glossary";
import { apiJson } from "@/lib/utils";

export const dynamic = "force-static";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.toLowerCase() || "";
  if (!q)
    return apiJson({ total: 0, results: [], hint: "Pass ?q= to search." });
  const articles = ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.directAnswer.toLowerCase().includes(q) ||
      a.tags.some((t) => t.includes(q)),
  ).slice(0, 10);
  const terms = GLOSSARY.filter(
    (t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q),
  ).slice(0, 10);
  return apiJson({
    total: articles.length + terms.length,
    articles: articles.map((a) => ({ slug: a.slug, title: a.title, direct_answer: a.directAnswer })),
    glossary: terms.map((t) => ({ term: t.term, slug: t.slug, definition: t.definition })),
  });
}
