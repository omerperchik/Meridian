import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: "up" | "down" | "flat";
  trendValue?: string;
}

export function StatGrid({ stats, className, cols = 4 }: { stats: Stat[]; className?: string; cols?: 2 | 3 | 4 }) {
  const gridCols = cols === 2 ? "md:grid-cols-2" : cols === 3 ? "md:grid-cols-3" : "md:grid-cols-4";
  return (
    <dl className={cn("grid grid-cols-2 gap-3", gridCols, className)}>
      {stats.map((s) => (
        <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
          <dt className="eyebrow mb-2">{s.label}</dt>
          <dd className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-semibold text-text-primary tabular-nums">
              {s.value}
            </span>
            {s.trend && s.trendValue && (
              <span
                className={cn(
                  "text-xs font-medium tabular-nums",
                  s.trend === "up" && "text-success",
                  s.trend === "down" && "text-danger",
                  s.trend === "flat" && "text-text-tertiary",
                )}
              >
                {s.trend === "up" ? "↑" : s.trend === "down" ? "↓" : "–"} {s.trendValue}
              </span>
            )}
          </dd>
          {s.sublabel && <div className="text-xs text-text-tertiary mt-1">{s.sublabel}</div>}
        </div>
      ))}
    </dl>
  );
}
