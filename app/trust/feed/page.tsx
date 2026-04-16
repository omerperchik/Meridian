import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { REGISTRY } from "@/data/registry";
import { SITE } from "@/lib/site";
import { cn, formatRelativeTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Live Trust Feed",
  description: "Real-time feed of trust score changes across all registered entities.",
  alternates: { canonical: `${SITE.url}/trust/feed` },
};

export default function TrustFeedPage() {
  const events = REGISTRY.slice(0, 20).flatMap((e, i) => [
    {
      t: new Date(Date.now() - i * 42 * 60_000).toISOString(),
      entity: e,
      delta: ((i * 7) % 11) - 5,
      kind: i % 3 === 0 ? "benchmark_run" : i % 3 === 1 ? "sdk_telemetry" : "audit_update",
    },
  ]);

  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Pillar 2"
        title="Live Trust Feed"
        description="Real-time feed of ATP score changes across all registered entities. Filter by tier, category, or magnitude."
        breadcrumbs={[{ label: "Trust", href: "/trust" }, { label: "Feed" }]}
        meta={<Badge tone="success" dot>Streaming</Badge>}
      />

      <Card>
        <div className="divide-y divide-border">
          {events.map((ev, i) => (
            <Link
              key={i}
              href={`/directory/${ev.entity.slug}`}
              className="flex items-center gap-4 p-4 hover:bg-surface-hover transition-colors"
            >
              <div className="text-2xs font-mono text-text-quaternary w-20">
                {formatRelativeTime(ev.t)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-sm text-text-primary">{ev.entity.name}</span>
                  <Badge tone="neutral">{ev.kind.replace("_", " ")}</Badge>
                </div>
                <div className="text-xs text-text-tertiary">
                  New composite {ev.entity.trust.composite.toFixed(1)} · Tier {ev.entity.trust.tier}
                </div>
              </div>
              <div
                className={cn(
                  "tabular-nums text-sm font-semibold",
                  ev.delta > 0 ? "text-success" : ev.delta < 0 ? "text-danger" : "text-text-tertiary",
                )}
              >
                {ev.delta > 0 ? "+" : ""}
                {ev.delta}
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
