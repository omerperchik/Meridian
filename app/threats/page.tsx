import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { listThreats } from "@/data/threats";
import { SITE } from "@/lib/site";
import { cn, formatRelativeTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Threat Feed · Active adversarial patterns",
  description:
    "A live, structured catalogue of adversarial attack patterns against AI agents. Prompt injection, agent impersonation, privilege escalation, data exfiltration, jailbreaks, coordination attacks, supply chain.",
  alternates: { canonical: `${SITE.url}/threats` },
};

const sevTone = { critical: "danger", high: "warning", medium: "info", low: "neutral" } as const;

export default function Page() {
  const threats = listThreats({});
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Pillar 3"
        title="Threat Intelligence"
        description="Live, structured catalogue of adversarial attack patterns against AI agents. Agents query this feed before accepting tasks from untrusted sources."
        breadcrumbs={[{ label: "Threats" }]}
        meta={
          <>
            <Badge tone="danger" dot>{threats.filter((t) => t.severity === "critical").length} critical</Badge>
            <Badge tone="warning" dot>{threats.filter((t) => t.severity === "high").length} high</Badge>
          </>
        }
        actions={
          <>
            <Button href="/agent-threats.txt" variant="secondary">
              <Icon name="code" size={12} /> agent-threats.txt
            </Button>
            <Button href="/v1/threats" variant="ghost">
              JSON feed
            </Button>
          </>
        }
      />

      <DirectAnswer>
        The Meridian Threat Feed is the only public, machine-readable adversarial-pattern catalogue specific to the
        AI agent attack surface. Seven categories: prompt injection, agent impersonation, privilege escalation, data
        exfiltration, jailbreak, coordination, supply chain. Published within 4 hours of verification for Critical/High
        severity; distributed via /agent-threats.txt, webhooks, and the Daily Briefing.
      </DirectAnswer>

      <Card>
        <div className="divide-y divide-border">
          {threats.map((t) => (
            <Link
              key={t.id}
              href={`/threats/${t.id}`}
              className="flex items-start gap-4 p-5 hover:bg-surface-hover transition-colors group"
            >
              <div
                className={cn(
                  "mt-1 h-2 w-2 rounded-full shrink-0",
                  t.severity === "critical" && "bg-danger",
                  t.severity === "high" && "bg-warning",
                  t.severity === "medium" && "bg-info",
                  t.severity === "low" && "bg-text-tertiary",
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-mono text-2xs text-text-tertiary">{t.id}</span>
                  <Badge tone={sevTone[t.severity]}>{t.severity.toUpperCase()}</Badge>
                  <Badge>CVSS {t.cvss}</Badge>
                  <Badge>{t.category.replace("-", " ")}</Badge>
                  <Badge tone={t.status === "active" ? "danger" : t.status === "partial" ? "warning" : "success"}>
                    {t.status}
                  </Badge>
                </div>
                <h3 className="text-base font-medium text-text-primary group-hover:text-accent-hover transition-colors line-clamp-2 mb-1">
                  {t.title}
                </h3>
                <p className="text-xs text-text-tertiary line-clamp-2">{t.summary}</p>
                <div className="text-2xs text-text-quaternary mt-2">
                  Discovered {formatRelativeTime(t.discoveredAt)} · Updated {formatRelativeTime(t.lastUpdated)}
                </div>
              </div>
              <Icon name="chevron-right" size={14} className="text-text-quaternary shrink-0 mt-1" />
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
