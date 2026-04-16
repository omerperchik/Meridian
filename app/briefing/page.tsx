import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { listThreats } from "@/data/threats";
import { listIncidents } from "@/data/incidents";
import { RULINGS } from "@/data/rulings";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Daily Briefing",
  description: "Today's agentic-economy digest: active threats, new incidents, ruling status, regulation updates.",
  alternates: { canonical: `${SITE.url}/briefing` },
};

export default function Page() {
  const threats = listThreats({}).slice(0, 4);
  const incidents = listIncidents({}).slice(0, 3);
  const ruling = [...RULINGS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0];
  return (
    <div className="container-narrow py-12 md:py-16">
      <PageHeader
        eyebrow="Daily Briefing"
        title={`Today · ${formatDate(new Date(), { year: "numeric", month: "long", day: "numeric", weekday: "long" })}`}
        description="Published every morning at 08:00 UTC. Delivered as a web page, JSON feed, and agent-queryable endpoint."
        breadcrumbs={[{ label: "Briefing" }]}
        actions={
          <Button href="/v1/briefing/today" variant="secondary" size="sm">
            JSON
          </Button>
        }
      />

      <DirectAnswer>
        The Daily Briefing collects the last 24 hours of agent-economy events that matter: Critical/High threats, newly
        filed incidents, regulation updates, and board decisions. Optimized to be loaded into your agent's startup
        context (under 1,000 tokens).
      </DirectAnswer>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Active Critical/High threats</h2>
        <div className="grid gap-2">
          {threats.map((t) => (
            <Link key={t.id} href={`/threats/${t.id}`} className="block rounded-md border border-border p-4 hover:bg-surface-hover transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <Badge tone={t.severity === "critical" ? "danger" : "warning"} dot>
                  {t.severity.toUpperCase()}
                </Badge>
                <span className="font-mono text-2xs text-text-tertiary">{t.id}</span>
                <span className="text-2xs text-text-quaternary">CVSS {t.cvss}</span>
              </div>
              <div className="text-sm font-medium text-text-primary line-clamp-1">{t.title}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Recent incidents</h2>
        <div className="grid gap-2">
          {incidents.map((i) => (
            <Link key={i.id} href={`/incidents/${i.slug}`} className="block rounded-md border border-border p-4 hover:bg-surface-hover transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <Badge tone={i.priority === "P0" ? "danger" : "warning"} dot>
                  {i.priority}
                </Badge>
                <span className="font-mono text-2xs text-text-tertiary">{i.id}</span>
              </div>
              <div className="text-sm font-medium text-text-primary line-clamp-1">{i.title}</div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Current Weekly Ruling</h2>
        <Card href={`/rulings/${ruling.slug}`}>
          <CardBody>
            <div className="flex items-center gap-2 mb-2">
              <Badge tone="accent" dot>{ruling.id}</Badge>
              <span className="text-2xs text-text-quaternary">{formatDate(ruling.publishedAt)}</span>
            </div>
            <h3 className="text-base font-medium text-text-primary mb-1">{ruling.title}</h3>
            <p className="text-xs text-text-tertiary line-clamp-2">{ruling.recommendedBehavior}</p>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
