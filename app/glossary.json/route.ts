import { GLOSSARY } from "@/data/glossary";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  return Response.json(
    {
      schema: "https://meridian.ai/schemas/glossary.v1.json",
      canonical: `${SITE.url}/glossary.json`,
      license: "CC BY 4.0",
      total: GLOSSARY.length,
      terms: GLOSSARY.map((t) => ({
        term: t.term,
        slug: t.slug,
        category: t.category,
        definition: t.definition,
        see_also: t.seeAlso,
        page: `${SITE.url}/glossary/${t.slug}`,
        api: `${SITE.url}/v1/content/glossary/${t.slug}`,
      })),
    },
    {
      headers: { "Cache-Control": "public, max-age=300, s-maxage=3600", "Access-Control-Allow-Origin": "*" },
    },
  );
}
