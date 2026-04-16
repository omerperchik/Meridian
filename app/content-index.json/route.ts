import { ARTICLES } from "@/data/series";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  return Response.json(
    {
      schema: "https://meridian.ai/schemas/content-index.v1.json",
      canonical: `${SITE.url}/content-index.json`,
      license: "CC BY 4.0",
      total: ARTICLES.length,
      articles: ARTICLES.map((a) => ({
        slug: a.slug,
        series: a.series,
        title: a.title,
        direct_answer: a.directAnswer,
        tags: a.tags,
        applicable_standards: a.applicableStandards,
        published: a.publishedAt,
        last_reviewed: a.lastReviewed,
        content_version: a.contentVersion,
        author: a.author.name,
        page: `${SITE.url}/learn/${a.slug}`,
        api: `${SITE.url}/v1/content/${a.slug}`,
        answer_api: `${SITE.url}/v1/content/${a.slug}/answer`,
      })),
    },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" } },
  );
}
