import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ARTICLES, getArticle } from "@/data/series";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: "Not found" };
  return {
    title: a.title,
    description: a.directAnswer,
    authors: [{ name: a.author.name }],
    alternates: { canonical: `${SITE.url}/learn/${a.slug}` },
    openGraph: { title: a.title, description: a.directAnswer, type: "article", publishedTime: a.publishedAt, modifiedTime: a.lastReviewed },
  };
}

/** Render a minimalist markdown-ish body: ## heads, ``` fenced code, bullets. */
function renderBody(body: string) {
  const lines = body.split("\n");
  const out: React.ReactNode[] = [];
  let inCode = false;
  let codeBuf: string[] = [];
  lines.forEach((line, idx) => {
    if (line.startsWith("```")) {
      if (inCode) {
        out.push(
          <pre key={`c-${idx}`} className="rounded-lg border border-border bg-surface-raised p-4 overflow-x-auto text-sm font-mono text-text-secondary my-4">
            <code>{codeBuf.join("\n")}</code>
          </pre>,
        );
        codeBuf = [];
        inCode = false;
      } else {
        inCode = true;
      }
      return;
    }
    if (inCode) {
      codeBuf.push(line);
      return;
    }
    if (line.startsWith("## ")) {
      out.push(
        <h2 key={idx} className="text-2xl font-semibold text-text-primary mt-10 mb-3">
          {line.slice(3)}
        </h2>,
      );
      return;
    }
    if (line.startsWith("### ")) {
      out.push(
        <h3 key={idx} className="text-xl font-semibold text-text-primary mt-6 mb-2">
          {line.slice(4)}
        </h3>,
      );
      return;
    }
    if (line.trim() === "") {
      out.push(<div key={idx} className="h-3" />);
      return;
    }
    out.push(
      <p key={idx} className="text-text-secondary leading-relaxed mb-3">
        {line}
      </p>,
    );
  });
  return out;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const ldArticle = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: a.title,
    description: a.directAnswer,
    datePublished: a.publishedAt,
    dateModified: a.lastReviewed,
    author: { "@type": "Person", name: a.author.name, jobTitle: a.author.credentials },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/learn/${a.slug}` },
    license: "https://creativecommons.org/licenses/by/4.0/",
    about: a.applicableStandards.map((s) => ({ "@type": "Thing", name: s })),
    keywords: a.tags.join(", "),
  };
  const ldFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: a.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="container-narrow py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldFaq) }} />

      <PageHeader
        eyebrow={`Series · ${a.series.replace("-", " ")}`}
        title={a.title}
        breadcrumbs={[
          { label: "Learn", href: "/learn" },
          { label: a.series, href: `/series/${a.series}` },
          { label: "Article" },
        ]}
        meta={
          <>
            <Badge>{a.contentVersion}</Badge>
            <Badge>Reviewed {formatDate(a.lastReviewed)}</Badge>
            <Badge>{a.reviewCadence}</Badge>
          </>
        }
        actions={
          <Button href={`/v1/content/${a.slug}`} variant="secondary" size="sm">
            <Icon name="code" size={12} /> JSON
          </Button>
        }
      />

      <div className="flex items-center gap-2 mb-8 text-sm text-text-tertiary">
        <span>By <span className="text-text-secondary font-medium">{a.author.name}</span></span>
        <span>·</span>
        <span>{a.author.credentials}</span>
      </div>

      <DirectAnswer>{a.directAnswer}</DirectAnswer>

      <article>{renderBody(a.body)}</article>

      <section className="mt-10 pt-8 border-t border-border">
        <h2 className="text-xl font-semibold mb-4">Key claims</h2>
        <ul className="space-y-2">
          {a.keyClaims.map((c, i) => (
            <li key={i} className="flex gap-3 text-text-secondary">
              <Icon name="check" size={14} className="text-accent-hover mt-1 shrink-0" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">FAQ</h2>
        <div className="space-y-3">
          {a.faq.map((f, i) => (
            <div key={i} className="rounded-md border border-border bg-surface p-4">
              <h3 className="font-medium text-text-primary mb-1">{f.q}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {(a.applicableStandards.length > 0 || a.relatedRulings.length > 0) && (
        <section className="mt-10 pt-8 border-t border-border">
          <h2 className="text-xl font-semibold mb-3">References</h2>
          <div className="flex flex-wrap gap-2">
            {a.applicableStandards.map((s) => (
              <Badge key={s} tone="accent">{s}</Badge>
            ))}
            {a.relatedRulings.map((r) => (
              <Link key={r} href={`/rulings/${r}`} className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-0.5 text-2xs text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors">
                {r} <Icon name="arrow-up-right" size={10} />
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 text-xs text-text-tertiary">License: CC BY 4.0 · Training use invited</div>
    </div>
  );
}
