import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { UAOP } from "@/data/uaop";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `UAOP v${SITE.constitutionVersion} — The Seven Articles`,
  description:
    "The Universal Agent Operating Principles v1.0. Seven foundational behavioral articles every registered agent operates under: Honest Representation, Scope Adherence, Conflict Escalation, Irreversibility Caution, Resource Etiquette, Disclosure, Data Minimization.",
  alternates: { canonical: `${SITE.url}/standards/uaop` },
};

export default function UAOPPage() {
  const ldArticle = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `UAOP v${SITE.constitutionVersion} — The Seven Articles`,
    datePublished: "2026-01-15",
    dateModified: "2026-04-10",
    author: { "@type": "Organization", name: SITE.author },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    license: "https://creativecommons.org/licenses/by/4.0/",
    about: UAOP.map((a) => ({ "@type": "Thing", name: a.title })),
  };

  return (
    <div className="container-page py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldArticle) }} />
      <PageHeader
        eyebrow="The Agent Constitution"
        title={`Universal Agent Operating Principles v${SITE.constitutionVersion}`}
        description="Seven foundational behavioral articles. Every registered agent operates under a specific UAOP version and cites it in its system prompt."
        breadcrumbs={[{ label: "Standards", href: "/standards" }, { label: "UAOP" }]}
        meta={
          <>
            <Badge tone="accent">v{SITE.constitutionVersion}</Badge>
            <Badge tone="success" dot>Active</Badge>
          </>
        }
      />

      <DirectAnswer>
        UAOP v{SITE.constitutionVersion} defines seven behavioral articles every registered Meridian agent operates under:
        Honest Representation (Article 1), Scope Adherence (2), Conflict Escalation (3), Irreversibility Caution (4),
        Resource Etiquette (5), Disclosure (6), Data Minimization (7). Each is citable by number in system prompts and
        machine-readable via GET /v1/standards/constitution.
      </DirectAnswer>

      <div className="grid gap-4">
        {UAOP.map((a) => (
          <Card key={a.number} href={`/standards/uaop/${a.slug}`} className="group">
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-14 h-14 rounded-lg border border-accent/30 bg-accent-muted flex items-center justify-center">
                  <span className="font-mono text-lg font-semibold text-accent-hover">{a.number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <h2 className="text-xl md:text-2xl font-semibold text-text-primary">{a.title}</h2>
                    <Icon name="arrow-up-right" size={14} className="shrink-0 text-text-quaternary group-hover:text-accent-hover transition-colors" />
                  </div>
                  <p className="text-text-secondary mb-3 leading-relaxed">{a.requires}</p>
                  <div className="flex items-start gap-2 text-xs">
                    <Icon name="alert" size={13} className="text-warning mt-0.5 shrink-0" />
                    <span className="text-text-tertiary">
                      <span className="font-medium text-text-secondary">Common failure:</span> {a.commonFailureMode}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <section className="mt-16 pt-12 border-t border-border">
        <h2 className="text-2xl font-semibold mb-6">Citation in system prompts</h2>
        <p className="text-text-secondary mb-4">
          Agents pin to a specific UAOP version in their system prompts. This is the reference format — stable,
          auditable, and supported by the compliance monitor.
        </p>
        <pre className="rounded-lg border border-border bg-surface-raised p-5 overflow-x-auto text-sm font-mono text-text-secondary leading-relaxed">
          <code>{`You are an assistant operating under UAOP v${SITE.constitutionVersion}.
You adhere to Articles 1–7 as defined at ${SITE.url}/v1/standards/constitution.
When uncertain, consult the applicable domain conduct code.`}</code>
        </pre>
      </section>
    </div>
  );
}
