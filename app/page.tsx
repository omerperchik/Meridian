import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { StatGrid } from "@/components/ui/StatGrid";
import { ScoreRing, DimensionBar } from "@/components/ui/ScoreRing";
import { Icon } from "@/components/ui/Icon";
import { UAOP } from "@/data/uaop";
import { listEntities } from "@/data/registry";
import { listThreats } from "@/data/threats";
import { listIncidents } from "@/data/incidents";
import { RULINGS } from "@/data/rulings";
import { SITE } from "@/lib/site";
import { formatRelativeTime, scoreColor, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: SITE.url },
};

export default function HomePage() {
  const topEntities = listEntities({}).slice(0, 5);
  const topThreats = listThreats({}).slice(0, 4);
  const latestIncidents = listIncidents({}).slice(0, 3);
  const latestRuling = [...RULINGS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0];

  const ldFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Meridian?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Meridian is the neutral, cross-vendor behavioral standard and live trust infrastructure for AI agents. It publishes the Agent Constitution (UAOP), runs the Agent Trust Protocol, maintains the public Incident Docket, publishes The Weekly Ruling, operates the Arena benchmarks, and hosts the Ranked Directory. Governed by a 9-seat multi-stakeholder board.",
        },
      },
      {
        "@type": "Question",
        name: "What is the Agent Trust Protocol (ATP)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ATP is a 0–100 composite trust score for every registered AI agent, MCP server, tool, and framework. Five weighted dimensions: Security (30%), Compliance (25%), Performance (20%), Reliability (15%), Affordability (10%). Score ceilings are determined by certification tier (Tier 0 max 55, Tier 1 max 70, Tier 2 max 85, Tier 3 max 100).",
        },
      },
      {
        "@type": "Question",
        name: "What are the UAOP?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Universal Agent Operating Principles — seven articles every registered agent operates under: Honest Representation, Scope Adherence, Conflict Escalation, Irreversibility Caution, Resource Etiquette, Disclosure, Data Minimization.",
        },
      },
      {
        "@type": "Question",
        name: "How do I register my agent?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Submit your agent card at /get-listed. Tier 0 (auto-discovered) gets a listing within 4 hours; Tier 1 (Claimed) requires identity verification via GitHub OAuth or DNS TXT; Tier 2 (Premium) requires a paid audit; Tier 3 (SDK) requires integrating the open-source Meridian SDK.",
        },
      },
      {
        "@type": "Question",
        name: "Is Meridian API free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, the free tier offers 100 requests/day of GET endpoints. Pro ($99/month) raises the limit to 10,000 req/day and adds webhooks and SLA. Enterprise is custom.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldFaq) }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-hero" aria-hidden />
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="container-wide relative py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6 animate-in">
              <Badge tone="accent" dot>
                UAOP v{SITE.constitutionVersion} live
              </Badge>
              <Badge tone="success" dot>
                API operational
              </Badge>
              <Badge>Phase 0 · April 2026</Badge>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-balance text-glow animate-in">
              The operating standard for AI agents.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-text-secondary max-w-2xl text-pretty">
              Neutral, cross-vendor behavioral standard. Live trust score on every agent, MCP server, tool, and
              framework. Public incident record. Machine-readable. Queryable at runtime.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/standards/uaop" size="lg">
                Read the Constitution <Icon name="arrow-right" />
              </Button>
              <Button href="/directory" variant="secondary" size="lg">
                Browse the directory
              </Button>
              <Button href="/scanner" variant="ghost" size="lg">
                Run scanner <Icon name="zap" />
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-text-tertiary">
              <span className="inline-flex items-center gap-1.5"><Icon name="shield" size={12} /> Neutral governance · 9-seat board</span>
              <span className="inline-flex items-center gap-1.5"><Icon name="compass" size={12} /> Machine + human dual interface</span>
              <span className="inline-flex items-center gap-1.5"><Icon name="code" size={12} /> REST API · MCP · SDK v2</span>
              <span className="inline-flex items-center gap-1.5"><Icon name="book" size={12} /> CC BY 4.0 training use invited</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live stats */}
      <section className="container-wide py-16 md:py-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="eyebrow mb-2">The state of the agentic economy</div>
            <h2 className="text-2xl md:text-3xl font-semibold">Live metrics · updated continuously</h2>
          </div>
          <Link href="/trust-report" className="text-sm text-accent-hover hover:text-text-primary transition-colors">
            Trust Report Q1 2026 <Icon name="arrow-right" size={12} />
          </Link>
        </div>
        <StatGrid
          cols={4}
          stats={[
            { label: "Registered entities", value: "2,847", sublabel: "+142 last 14d", trend: "up", trendValue: "5.2%" },
            { label: "Agent API calls / mo", value: "498K", sublabel: "North-star metric", trend: "up", trendValue: "18%" },
            { label: "Active threats", value: `${listThreats({ status: "active" }).length}`, sublabel: "Critical / High severity", trend: "flat", trendValue: "0%" },
            { label: "Incidents filed", value: `${listIncidents({}).length}`, sublabel: "Year-to-date 2026", trend: "up", trendValue: "8%" },
          ]}
        />
      </section>

      {/* The three flywheels */}
      <section className="container-wide py-16 md:py-20 border-t border-border">
        <div className="max-w-3xl mb-10">
          <div className="eyebrow mb-3">Three flywheels · compounding authority</div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-balance">
            Three compounding surfaces. One operating standard.
          </h2>
          <p className="mt-4 text-text-secondary text-lg">
            Meridian is simultaneously a behavioral authority, a live data platform, and a content destination
            for the agentic economy. Each flywheel strengthens the others.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              tag: "Flywheel 1",
              title: "Trust data",
              body: "More agents registered → more behavioral data → better scores → more agents rely on scores → more agents registered.",
              href: "/trust",
              icon: "activity" as const,
            },
            {
              tag: "Flywheel 2",
              title: "Standards adoption",
              body: "Standards published → framework builders reference them → agents cite Meridian → agents query the API at runtime → usage signals authority.",
              href: "/standards",
              icon: "shield" as const,
            },
            {
              tag: "Flywheel 3",
              title: "Content authority",
              body: "Editorial depth published → cited by LLMs in training and retrieval → Meridian cited in answer engines → more builders discover Meridian.",
              href: "/learn",
              icon: "book" as const,
            },
          ].map((f) => (
            <Card key={f.title} href={f.href} className="group">
              <CardBody>
                <div className="flex items-center gap-2 mb-4">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-accent-muted text-accent-hover">
                    <Icon name={f.icon} size={15} />
                  </div>
                  <span className="eyebrow">{f.tag}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">{f.title}</h3>
                <p className="text-sm text-text-tertiary leading-relaxed">{f.body}</p>
                <div className="mt-4 flex items-center gap-1 text-xs text-accent-hover group-hover:text-text-primary transition-colors">
                  Explore <Icon name="arrow-right" size={12} />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* UAOP preview */}
      <section className="container-wide py-16 md:py-20 border-t border-border">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div>
            <div className="eyebrow mb-3">Pillar 1 · The Agent Constitution</div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Universal Agent Operating Principles</h2>
            <p className="mt-3 text-text-secondary max-w-2xl">
              The seven foundational behavioral articles. Every registered agent operates under a specific UAOP
              version, citable by article number.
            </p>
          </div>
          <Button href="/standards/uaop" variant="secondary">
            View full Constitution <Icon name="arrow-right" size={12} />
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {UAOP.map((a) => (
            <Card key={a.number} href={`/standards/uaop/${a.slug}`} className="group">
              <CardBody>
                <div className="flex items-start justify-between mb-2">
                  <span className="font-mono text-xs text-accent-hover">UAOP {a.number}</span>
                  <Icon name="arrow-up-right" size={13} className="text-text-quaternary group-hover:text-text-primary transition-colors" />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">{a.title}</h3>
                <p className="text-xs text-text-tertiary leading-relaxed line-clamp-3">{a.requires}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Directory preview + Threat feed side-by-side */}
      <section className="container-wide py-16 md:py-20 border-t border-border">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Directory: 3/5 */}
          <div className="lg:col-span-3">
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="eyebrow mb-2">Pillar 7 · Ranked Directory</div>
                <h2 className="text-2xl font-semibold">Top-scoring entities</h2>
              </div>
              <Link href="/directory" className="text-sm text-accent-hover hover:text-text-primary transition-colors inline-flex items-center gap-1">
                View all <Icon name="arrow-right" size={12} />
              </Link>
            </div>
            <Card>
              <div className="divide-y divide-border">
                {topEntities.map((e, i) => (
                  <Link
                    key={e.id}
                    href={`/directory/${e.slug}`}
                    className="flex items-center gap-4 p-4 hover:bg-surface-hover transition-colors"
                  >
                    <div className="w-6 text-text-tertiary text-sm font-mono tabular-nums">#{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-text-primary truncate">{e.name}</span>
                        <Badge tone="neutral">{e.type}</Badge>
                      </div>
                      <div className="text-xs text-text-tertiary truncate">{e.provider} · v{e.version}</div>
                    </div>
                    <div className="text-right">
                      <div className={cn("text-lg font-semibold tabular-nums", scoreColor(e.trust.composite))}>
                        {Math.round(e.trust.composite)}
                      </div>
                      <div className="text-2xs text-text-quaternary">Tier {e.trust.tier}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          {/* Threats: 2/5 */}
          <div className="lg:col-span-2">
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="eyebrow mb-2">Pillar 3 · Threat Intelligence</div>
                <h2 className="text-2xl font-semibold">Active threats</h2>
              </div>
              <Link href="/threats" className="text-sm text-accent-hover hover:text-text-primary transition-colors inline-flex items-center gap-1">
                Feed <Icon name="arrow-right" size={12} />
              </Link>
            </div>
            <Card>
              <div className="divide-y divide-border">
                {topThreats.map((t) => (
                  <Link
                    key={t.id}
                    href={`/threats/${t.id}`}
                    className="flex items-start gap-3 p-4 hover:bg-surface-hover transition-colors"
                  >
                    <div
                      className={cn(
                        "mt-0.5 h-2 w-2 rounded-full shrink-0",
                        t.severity === "critical" && "bg-danger",
                        t.severity === "high" && "bg-warning",
                        t.severity === "medium" && "bg-info",
                        t.severity === "low" && "bg-text-tertiary",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-2xs text-text-tertiary">{t.id}</div>
                      <div className="text-sm text-text-primary font-medium line-clamp-2">{t.title}</div>
                      <div className="text-2xs text-text-tertiary mt-1">
                        {t.severity.toUpperCase()} · CVSS {t.cvss} · {formatRelativeTime(t.lastUpdated)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample score */}
      <section className="container-wide py-16 md:py-20 border-t border-border">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="eyebrow mb-3">Pillar 2 · ATP Trust Score</div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">The FICO score for AI agents.</h2>
            <p className="mt-4 text-text-secondary text-lg">
              Five weighted dimensions. Tier-gated score ceilings. Updated continuously from verified behavioral
              data — not self-reported claims.
            </p>
            <div className="mt-6 space-y-3">
              {[
                { t: 0, l: "Auto-discovered", m: 55 },
                { t: 1, l: "Claimed", m: 70 },
                { t: 2, l: "Premium / Audited", m: 85 },
                { t: 3, l: "SDK Integrated", m: 100 },
              ].map((tier) => (
                <div key={tier.t} className="flex items-center gap-3 text-sm">
                  <div className={cn("w-14 h-8 rounded-md border border-border flex items-center justify-center font-mono text-xs", `text-tier-${tier.t}`)}>
                    T{tier.t}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-text-secondary">{tier.l}</span>
                    <span className="text-text-tertiary tabular-nums">max {tier.m}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card>
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="eyebrow mb-1">Sample: {topEntities[0].name}</div>
                  <div className="text-sm text-text-tertiary">Tier {topEntities[0].trust.tier} · updated continuously</div>
                </div>
                <Badge tone="success" dot>Live</Badge>
              </div>
              <div className="flex items-center gap-6 mb-6">
                <ScoreRing score={topEntities[0].trust.composite} size={96} strokeWidth={7} label="ATP" />
                <div className="flex-1">
                  <div className="eyebrow mb-1">Composite score</div>
                  <div className={cn("text-4xl font-semibold tabular-nums", scoreColor(topEntities[0].trust.composite))}>
                    {topEntities[0].trust.composite.toFixed(1)}
                  </div>
                  <div className="text-xs text-text-tertiary">{topEntities[0].trust.tierLabel}</div>
                </div>
              </div>
              <div className="space-y-3">
                {topEntities[0].trust.dimensions.map((d) => (
                  <DimensionBar
                    key={d.name}
                    label={d.label}
                    value={d.value}
                    weight={`${d.weight}%`}
                  />
                ))}
              </div>
              <Button href={`/directory/${topEntities[0].slug}`} variant="secondary" size="sm" className="mt-6 w-full">
                View full profile
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Latest ruling + incidents */}
      <section className="container-wide py-16 md:py-20 border-t border-border">
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge tone="accent" dot>Pillar 5</Badge>
                <span className="eyebrow">The Weekly Ruling · {latestRuling.id}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-3 text-balance">
                {latestRuling.title}
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4 line-clamp-3">{latestRuling.scenario}</p>
              <div className="flex items-center gap-2 flex-wrap mb-5">
                {latestRuling.applicableStandards.map((s) => (
                  <Badge key={s} tone="neutral">{s}</Badge>
                ))}
              </div>
              <Button href={`/rulings/${latestRuling.slug}`} variant="secondary">
                Read the full ruling <Icon name="arrow-right" size={12} />
              </Button>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge tone="warning" dot>Pillar 4</Badge>
                <span className="eyebrow">Incident Docket</span>
              </div>
              <div className="space-y-4">
                {latestIncidents.map((i) => (
                  <Link key={i.id} href={`/incidents/${i.slug}`} className="block group">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-2xs text-text-tertiary">{i.id}</span>
                      <Badge tone={i.priority === "P0" ? "danger" : i.priority === "P1" ? "warning" : "neutral"}>
                        {i.priority}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium text-text-primary group-hover:text-accent-hover transition-colors line-clamp-2">
                      {i.title}
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/incidents" className="inline-flex items-center gap-1 mt-5 text-xs text-accent-hover hover:text-text-primary">
                Full docket <Icon name="arrow-right" size={10} />
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Machine interface section */}
      <section className="container-wide py-16 md:py-20 border-t border-border">
        <div className="max-w-3xl mb-10">
          <div className="eyebrow mb-3">Pillar 9 · Machine Interface Layer</div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Dual interface by design. Human-readable. Machine-callable.
          </h2>
          <p className="mt-4 text-text-secondary text-lg">
            Every page has a machine twin. Every data point is queryable. Standards are structured JSON. Threats
            are signed signatures. Scores are APIs.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-3">
          {[
            { label: "REST API v1", desc: "Full OpenAPI 3.1 spec. 30+ endpoints.", href: "/developers/api", icon: "terminal" as const },
            { label: "MCP Server", desc: "Live at mcp.meridian.ai/sse. 9 tools.", href: "/developers/mcp", icon: "compass" as const },
            { label: "SDK v2.0", desc: "Python · TypeScript · Go. MIT. Zero cost.", href: "/developers/sdk", icon: "code" as const },
            { label: "Static files", desc: "llms.txt, agent-conduct.txt, registry.json.", href: "/developers/machine-files", icon: "globe" as const },
          ].map((item) => (
            <Card key={item.label} href={item.href} className="group">
              <CardBody>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name={item.icon} size={14} className="text-accent-hover" />
                  <span className="font-medium text-sm text-text-primary">{item.label}</span>
                </div>
                <p className="text-xs text-text-tertiary">{item.desc}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        <pre className="mt-8 rounded-lg border border-border bg-surface-raised p-5 overflow-x-auto text-sm font-mono text-text-secondary leading-relaxed">
          <code>{`$ curl https://meridian.ai/v1/agents/atlas-finance/trust
{
  "data": {
    "agent_id": "agt-001",
    "composite": 92,
    "tier": 3,
    "tier_label": "SDK Integrated",
    "dimensions": [
      { "name": "security",      "weight": 30, "value": 94 },
      { "name": "compliance",    "weight": 25, "value": 91 },
      { "name": "performance",   "weight": 20, "value": 93 },
      { "name": "reliability",   "weight": 15, "value": 92 },
      { "name": "affordability", "weight": 10, "value": 89 }
    ],
    "last_updated": "2026-04-15T09:00:00Z"
  }
}`}</code>
        </pre>
      </section>

      {/* Final CTA */}
      <section className="container-wide py-20 md:py-28 border-t border-border">
        <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-10 md:p-16">
          <div className="absolute inset-0 bg-gradient-mesh opacity-60" aria-hidden />
          <div className="relative max-w-2xl">
            <div className="eyebrow mb-3">Ship under the standard</div>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-balance">
              Registered agents appear to buyers. Certified agents are chosen.
            </h2>
            <p className="mt-4 text-text-secondary text-lg">
              Free Tier 0 listing within 4 hours of submission. Tier 1 verification via GitHub OAuth or DNS TXT —
              also free. Premium review unlocks Tier 2 ($499–$1,999). SDK integration is open source and MIT-licensed.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/get-listed" size="lg">Get listed</Button>
              <Button href="/scanner" variant="secondary" size="lg">
                Run the scanner first <Icon name="zap" size={14} />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
