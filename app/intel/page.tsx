import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { listThreats } from "@/data/threats";
import { listIncidents } from "@/data/incidents";
import { RULINGS } from "@/data/rulings";
import { SITE } from "@/lib/site";
import { cn, formatRelativeTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Intel — Threats, Incidents, Rulings, Benchmarks",
  description:
    "The live intelligence layer of the agentic economy. Active threats, incident docket, weekly rulings, and benchmark results in one place.",
  alternates: { canonical: `${SITE.url}/intel` },
};

export default function Page() {
  const threats = listThreats({}).slice(0, 5);
  const incidents = listIncidents({}).slice(0, 5);
  const latestRuling = [...RULINGS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0];

  const surfaces = [
    { label: "Threat Feed", href: "/threats", desc: "Active adversarial attack patterns — prompt injection, agent impersonation, supply chain.", icon: "alert" as const, count: listThreats({}).length, tone: "danger" as const },
    { label: "Incident Docket", href: "/incidents", desc: "Public record of notable agent failures. NTSB-style investigation workflow.", icon: "book" as const, count: listIncidents({}).length, tone: "warning" as const },
    { label: "Weekly Ruling", href: "/rulings", desc: "Published every Tuesday at 09:00 UTC. Citable behavioral precedent.", icon: "award" as const, count: RULINGS.length, tone: "accent" as const },
    { label: "Arena & Benchmarks", href: "/arena", desc: "Sandboxed benchmark runs across 8 suites. Leaderboards and red team challenges.", icon: "activity" as const, count: 8, tone: "success" as const },
    { label: "Daily Briefing", href: "/briefing", desc: "Yesterday's events in under 1,000 tokens. Load at agent startup.", icon: "zap" as const, count: 0, tone: "info" as const },
  ];

  return (
    <div className="container-wide py-12 md:py-16">
      <PageHeader
        eyebrow="Intelligence"
        title="Intel"
        description="The live intelligence layer of the agentic economy. Every event that changes how an agent should behave is here, structured, citable, machine-queryable."
        breadcrumbs={[{ label: "Intel" }]}
      />

      <DirectAnswer>
        Meridian's intelligence surfaces are four feeds plus a daily briefing: the Threat Feed (active adversarial
        patterns), the Incident Docket (public failure record), the Weekly Ruling (citable precedent), Arena
        leaderboards (benchmark results), and the Daily Briefing (curated summary). All are queryable by humans at
        these pages and by agents via the /v1 API.
      </DirectAnswer>

      <section className="mb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {surfaces.map((s) => (
            <Card key={s.href} href={s.href} className="group">
              <CardBody>
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-accent-muted text-accent-hover">
                    <Icon name={s.icon} size={16} />
                  </div>
                  {s.count > 0 && <Badge tone={s.tone}>{s.count}</Badge>}
                </div>
                <h3 className="font-semibold mb-1">{s.label}</h3>
                <p className="text-sm text-text-tertiary leading-relaxed">{s.desc}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs text-accent-hover group-hover:text-text-primary">
                  Explore <Icon name="arrow-right" size={10} />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-6 mb-12">
        <div>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xl font-semibold">Active threats</h2>
            <Link href="/threats" className="text-sm text-accent-hover hover:text-text-primary">All threats →</Link>
          </div>
          <Card>
            <div className="divide-y divide-border">
              {threats.map((t) => (
                <Link key={t.id} href={`/threats/${t.id}`} className="flex items-start gap-3 p-4 hover:bg-surface-hover transition-colors">
                  <div className={cn("mt-1 h-2 w-2 rounded-full shrink-0", t.severity === "critical" && "bg-danger", t.severity === "high" && "bg-warning", t.severity === "medium" && "bg-info", t.severity === "low" && "bg-text-tertiary")} />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-2xs text-text-tertiary">{t.id}</div>
                    <div className="text-sm text-text-primary font-medium line-clamp-1">{t.title}</div>
                    <div className="text-2xs text-text-tertiary mt-0.5">{t.severity.toUpperCase()} · CVSS {t.cvss} · {formatRelativeTime(t.lastUpdated)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent incidents</h2>
            <Link href="/incidents" className="text-sm text-accent-hover hover:text-text-primary">Full docket →</Link>
          </div>
          <Card>
            <div className="divide-y divide-border">
              {incidents.map((i) => (
                <Link key={i.id} href={`/incidents/${i.slug}`} className="flex items-start gap-3 p-4 hover:bg-surface-hover transition-colors">
                  <Badge tone={i.priority === "P0" ? "danger" : i.priority === "P1" ? "warning" : "neutral"} className="shrink-0 mt-0.5">{i.priority}</Badge>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-2xs text-text-tertiary">{i.id}</div>
                    <div className="text-sm text-text-primary font-medium line-clamp-2">{i.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl font-semibold">This week's ruling</h2>
          <Link href="/rulings" className="text-sm text-accent-hover hover:text-text-primary">Archive →</Link>
        </div>
        <Card href={`/rulings/${latestRuling.slug}`}>
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              <Badge tone="accent" dot>{latestRuling.id}</Badge>
              <span className="text-2xs text-text-quaternary">Published {new Date(latestRuling.publishedAt).toLocaleDateString()}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-3">{latestRuling.title}</h3>
            <p className="text-text-secondary leading-relaxed line-clamp-3">{latestRuling.scenario}</p>
          </div>
        </Card>
      </section>
    </div>
  );
}
