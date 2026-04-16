import { ARTICLES, getArticle } from "@/data/series";
import { apiJson, apiError } from "@/lib/utils";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return apiError("not_found", `Article '${slug}' not found`, 404);
  return apiJson({
    slug: a.slug,
    direct_answer: a.directAnswer,
    title: a.title,
    applicable_standards: a.applicableStandards,
    last_reviewed: a.lastReviewed,
  });
}
