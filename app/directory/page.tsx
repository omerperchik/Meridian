import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { REGISTRY } from "@/data/registry";
import { SITE } from "@/lib/site";
import { cn, scoreColor } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Directory — Every registered AI agent, MCP, tool, and framework",
  description:
    "The Ranked Directory. Technical scoring for agents, MCP servers, tools, and frameworks — G2 powered by analysis. Filter by capability, domain, protocol, trust score floor.",
  alternates: { canonical: `${SITE.url}/directory` },
};

export default function DirectoryPage() {
  const byType = {
    agent: REGISTRY.filter((e) => e.type === "agent"),
    mcp: REGISTRY.filter((e) => e.type === "mcp"),
    tool: REGISTRY.filter((e) => e.type === "tool"),
    framework: REGISTRY.filter((e) => e.type === "framework"),
  };
  return (
    <div className="container-wide py-12 md:py-16">
      <PageHeader
        eyebrow="Pillar 7"
        title="The Ranked Directory"
        description="Every registered agent, MCP server, tool, and framework — with verified technical scores. Not user star ratings."
        breadcrumbs={[{ label: "Directory" }]}
        meta={
          <>
            <Badge tone="neutral">{REGISTRY.length.toLocaleString()} entities</Badge>
            <Badge tone="success" dot>Live scoring</Badge>
          </>
        }
        actions={
          <>
            <Button href="/directory/leaderboards" variant="secondary">
              <Icon name="award" size={13} /> Leaderboards
            </Button>
            <Button href="/get-listed">Get listed</Button>
          </>
        }
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {(["agent", "mcp", "tool", "framework"] as const).map((t) => (
          <a
            key={t}
            href={`#${t}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
          >
            <span className="capitalize">{t}s</span>
            <span className="text-text-quaternary tabular-nums">{byType[t].length}</span>
          </a>
        ))}
      </div>

      {(["agent", "mcp", "tool", "framework"] as const).map((t) => (
        <section key={t} id={t} className="mb-12">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xl font-semibold capitalize">{t}s</h2>
            <Link href={`/directory/${t === "mcp" ? "mcp-servers" : t + "s"}`} className="text-xs text-accent-hover hover:text-text-primary">
              All {t}s →
            </Link>
          </div>
          <Card>
            <div className="divide-y divide-border">
              {byType[t].map((e, i) => (
                <Link key={e.id} href={`/directory/${e.slug}`} className="flex items-center gap-4 p-4 hover:bg-surface-hover transition-colors">
                  <div className="w-6 text-text-tertiary text-sm font-mono tabular-nums">#{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-text-primary truncate">{e.name}</span>
                      <span className="font-mono text-2xs text-text-quaternary">v{e.version}</span>
                      <Badge tone={e.trust.tier === 3 ? "success" : e.trust.tier === 2 ? "accent" : "neutral"}>
                        Tier {e.trust.tier}
                      </Badge>
                    </div>
                    <div className="text-xs text-text-tertiary line-clamp-1">{e.description}</div>
                  </div>
                  <div className="hidden md:flex flex-wrap gap-1">
                    {e.capabilities.slice(0, 2).map((c) => (
                      <span key={c} className="text-2xs text-text-quaternary">
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="text-right">
                    <div className={cn("text-lg font-semibold tabular-nums", scoreColor(e.trust.composite))}>
                      {Math.round(e.trust.composite)}
                    </div>
                    <div className="text-2xs text-text-quaternary">{e.trust.tierLabel}</div>
                  </div>
                  <Icon name="chevron-right" size={14} className="text-text-quaternary shrink-0" />
                </Link>
              ))}
            </div>
          </Card>
        </section>
      ))}
    </div>
  );
}
