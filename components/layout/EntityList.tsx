import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import type { RegistryEntity } from "@/lib/types";
import { cn, scoreColor } from "@/lib/utils";

export function EntityList({ entities }: { entities: RegistryEntity[] }) {
  return (
    <Card>
      <div className="divide-y divide-border">
        {entities.map((e, i) => (
          <Link
            key={e.id}
            href={`/directory/${e.slug}`}
            className="flex items-center gap-4 p-4 hover:bg-surface-hover transition-colors"
          >
            <div className="w-6 text-text-tertiary text-sm font-mono tabular-nums">#{i + 1}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="font-medium text-text-primary truncate">{e.name}</span>
                <span className="font-mono text-2xs text-text-quaternary">v{e.version}</span>
                <Badge tone={e.trust.tier === 3 ? "success" : e.trust.tier === 2 ? "accent" : "neutral"}>
                  Tier {e.trust.tier}
                </Badge>
              </div>
              <div className="text-xs text-text-tertiary line-clamp-1">{e.description}</div>
            </div>
            <div className="text-right shrink-0">
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
  );
}
