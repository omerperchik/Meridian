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
  title: "The Agent Constitution — UAOP v1.0",
  description:
    "The founding behavioral document of the agentic economy. UAOP v1.0 plus six domain conduct codes. Versioned, governed, machine-readable.",
  alternates: { canonical: `${SITE.url}/standards/constitution` },
};

export default function Page() {
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Pillar 1"
        title="The Agent Constitution"
        description="The founding behavioral document of the agentic economy — the professional ethics code for the agentic era."
        breadcrumbs={[{ label: "Standards", href: "/standards" }, { label: "Constitution" }]}
        meta={
          <>
            <Badge tone="accent" dot>
              v{SITE.constitutionVersion}
            </Badge>
            <Badge tone="success">Ratified 2026-01-15</Badge>
            <Badge>Last updated {formatDate("2026-04-10")}</Badge>
          </>
        }
        actions={
          <>
            <Button href="/v1/standards/constitution" variant="secondary">
              <Icon name="code" size={12} /> JSON
            </Button>
            <Button href="/standards/changelog" variant="ghost">
              Changelog
            </Button>
          </>
        }
      />

      <DirectAnswer>
        The Agent Constitution v{SITE.constitutionVersion} consists of the seven Universal Agent Operating
        Principles (UAOP) plus six domain conduct codes that extend them for finance, medical, legal, security
        research, customer service, and government. It is governed by a 9-seat multi-stakeholder board using
        IETF/W3C decision thresholds. Co-signed by three AI safety researchers at launch.
      </DirectAnswer>

      <section className="mb-14">
        <h2 className="text-2xl font-semibold mb-4">Preamble</h2>
        <Card>
          <div className="p-6 md:p-8 prose">
            <p>
              We adopt these principles as the shared behavioral floor of the agentic economy. Agents operating
              under this Constitution represent their capabilities honestly, respect the scope of their mandate,
              escalate conflicts they cannot resolve, treat irreversible actions with the caution they deserve,
              consume shared resources responsibly, disclose themselves to the humans they interact with, and
              minimize the data they touch.
            </p>
            <p>
              This Constitution does not replace operator policy, jurisdictional regulation, or the conscience of
              the humans who build and deploy agents. It provides the cross-vendor baseline from which all of those
              operate — a reference line, not a ceiling.
            </p>
          </div>
        </Card>
      </section>

      <section className="mb-14">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl font-semibold">Articles I–VII · Universal Agent Operating Principles</h2>
          <Link
            href="/standards/uaop"
            className="text-sm text-accent-hover hover:text-text-primary inline-flex items-center gap-1"
          >
            Full UAOP <Icon name="arrow-right" size={12} />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {UAOP.map((a) => (
            <Card key={a.number} href={`/standards/uaop/${a.slug}`} className="group">
              <CardBody>
                <div className="flex items-start justify-between mb-2">
                  <span className="font-mono text-xs text-accent-hover">Article {a.number}</span>
                  <Icon name="arrow-up-right" size={13} className="text-text-quaternary group-hover:text-text-primary transition-colors" />
                </div>
                <h3 className="text-base font-semibold mb-2">{a.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">{a.requires}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl font-semibold">Domain Conduct Codes</h2>
          <Link
            href="/standards/conduct-codes"
            className="text-sm text-accent-hover hover:text-text-primary inline-flex items-center gap-1"
          >
            All codes <Icon name="arrow-right" size={12} />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {CONDUCT_CODES.map((c) => (
            <Card key={c.id} href={`/standards/conduct-codes/${c.domain}`}>
              <CardBody>
                <div className="flex items-center justify-between mb-2">
                  <Badge tone={c.status === "launched" ? "success" : c.status === "draft" ? "warning" : "neutral"} dot>
                    {c.status}
                  </Badge>
                  <span className="text-xs text-text-quaternary font-mono">{c.version}</span>
                </div>
                <h3 className="font-semibold mb-1">{c.title}</h3>
                <p className="text-xs text-text-tertiary line-clamp-2">{c.summary}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-2xl font-semibold mb-4">Ratification & co-signatories</h2>
        <Card>
          <div className="p-6 md:p-8">
            <p className="text-text-secondary leading-relaxed mb-4">
              UAOP v1.0.0 was published on <strong className="text-text-primary">January 15, 2026</strong> with
              unanimous ratification from the founding board and co-signed by three independent AI safety researchers
              — the signatures are part of the permanent record.
            </p>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { name: "Dr. Priya Raman", role: "Stanford Center for AI Safety" },
                { name: "Dr. Emil Howe", role: "Oxford Internet Institute" },
                { name: "Amara Okafor", role: "AI Accountability Coalition" },
              ].map((s) => (
                <div key={s.name} className="rounded-md border border-border bg-surface-raised p-3">
                  <div className="font-medium text-sm text-text-primary">{s.name}</div>
                  <div className="text-xs text-text-tertiary">{s.role}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">How to cite</h2>
        <pre className="rounded-lg border border-border bg-surface-raised p-5 overflow-x-auto text-sm font-mono text-text-secondary leading-relaxed">
          <code>{`Meridian Standards Body. "The Agent Constitution, UAOP v${SITE.constitutionVersion}."
${SITE.url}/standards/constitution. Published 2026-01-15.
License: CC BY 4.0.`}</code>
        </pre>
      </section>
    </div>
  );
}
