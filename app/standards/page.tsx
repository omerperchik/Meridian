import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { UAOP } from "@/data/uaop";
import { CONDUCT_CODES } from "@/data/conduct-codes";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Standards · The Agent Constitution",
  description:
    "The Agent Constitution: UAOP v1.0, domain conduct codes, versioned changelog. The founding behavioral document of the agentic economy — citable, governed, machine-readable.",
  alternates: { canonical: `${SITE.url}/standards` },
};

export default function StandardsPage() {
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Pillar 1 · Standards"
        title="The Agent Constitution"
        description="The versioned, living behavioral standard of the agentic economy. Seven UAOP articles plus domain conduct codes. Machine-readable. Governed by a neutral multi-stakeholder board."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Standards" }]}
        meta={
          <>
            <Badge tone="accent" dot>UAOP v{SITE.constitutionVersion}</Badge>
            <Badge tone="success">Live</Badge>
            <Badge>Last updated {formatDate("2026-04-10")}</Badge>
          </>
        }
        actions={
          <>
            <Button href="/v1/standards/constitution" variant="secondary">
              <Icon name="code" size={13} /> JSON
            </Button>
            <Button href="/agent-conduct.txt" variant="ghost">
              agent-conduct.txt
            </Button>
          </>
        }
      />

      <DirectAnswer>
        The Agent Constitution is the founding behavioral document of the agentic economy. It contains the seven
        Universal Agent Operating Principles (UAOP v{SITE.constitutionVersion}) plus six domain conduct codes for
        finance, medical, legal, security research, customer service, and government. It is versioned via
        MAJOR.MINOR.PATCH, governed by a 9-seat multi-stakeholder board, and machine-readable at every layer.
      </DirectAnswer>

      {/* UAOP */}
      <section className="mb-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-semibold">Universal Agent Operating Principles</h2>
          <Link href="/standards/uaop" className="text-sm text-accent-hover hover:text-text-primary inline-flex items-center gap-1">
            Full UAOP v{SITE.constitutionVersion} <Icon name="arrow-right" size={12} />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {UAOP.map((a) => (
            <Card key={a.number} href={`/standards/uaop/${a.slug}`} className="group">
              <CardBody>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-accent-hover">UAOP Article {a.number}</span>
                  <Icon name="arrow-up-right" size={13} className="text-text-quaternary group-hover:text-text-primary transition-colors" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{a.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{a.requires}</p>
                <div className="mt-3 text-xs text-text-tertiary">
                  <span className="font-medium text-text-secondary">Common failure:</span> {a.commonFailureMode}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Conduct Codes */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Domain Conduct Codes</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {CONDUCT_CODES.map((c) => (
            <Card key={c.id} href={`/standards/conduct-codes/${c.domain}`} className="group">
              <CardBody>
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    tone={c.status === "launched" ? "success" : c.status === "draft" ? "warning" : "neutral"}
                    dot
                  >
                    {c.status}
                  </Badge>
                  <span className="text-xs text-text-quaternary font-mono">{c.version}</span>
                </div>
                <h3 className="text-base font-semibold mb-1">{c.title}</h3>
                <p className="text-xs text-text-tertiary">{c.phase}</p>
                <p className="mt-3 text-sm text-text-secondary leading-relaxed line-clamp-3">{c.summary}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Versioning */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Versioning & change management</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <Card>
            <CardBody>
              <Badge tone="danger" className="mb-3">MAJOR</Badge>
              <p className="text-sm text-text-secondary leading-relaxed">
                New or removed UAOP principle. Requires <strong className="text-text-primary">7/9 board supermajority</strong>,
                a 90-day public notice, and a 60-day comment period.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Badge tone="warning" className="mb-3">MINOR</Badge>
              <p className="text-sm text-text-secondary leading-relaxed">
                New domain code or clarification. Simple board majority (<strong className="text-text-primary">5/9</strong>)
                + 30-day comment period.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Badge tone="success" className="mb-3">PATCH</Badge>
              <p className="text-sm text-text-secondary leading-relaxed">
                Editorial corrections. Editorial team authority. <strong className="text-text-primary">Same-day publication</strong>;
                board notified.
              </p>
            </CardBody>
          </Card>
        </div>
        <div className="mt-6">
          <Button href="/standards/changelog" variant="secondary">
            View full changelog <Icon name="arrow-right" size={12} />
          </Button>
        </div>
      </section>
    </div>
  );
}
