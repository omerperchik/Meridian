import { cn, scoreColor } from "@/lib/utils";

interface Props {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

/**
 * Circular score ring — the live ATP trust score visual.
 * 0-100 scale. Stroke color shifts with tier bands.
 */
export function ScoreRing({ score, size = 72, strokeWidth = 6, label, className }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;
  const color = scoreColor(score);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="none" className="text-border" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("transition-all duration-500", color)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-semibold tabular-nums", color)} style={{ fontSize: size * 0.3 }}>
          {Math.round(score)}
        </span>
        {label && <span className="text-2xs text-text-tertiary font-medium">{label}</span>}
      </div>
    </div>
  );
}

/** Horizontal dimension bar (e.g., Security 30% weight) */
export function DimensionBar({ label, value, max = 100, weight }: { label: string; value: number; max?: number; weight?: string }) {
  const pct = (value / max) * 100;
  const color = scoreColor(value);
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm text-text-secondary font-medium">{label}</span>
        <div className="flex items-baseline gap-2 text-xs">
          {weight && <span className="text-text-quaternary">{weight}</span>}
          <span className={cn("font-semibold tabular-nums", color)}>{value}</span>
        </div>
      </div>
      <div className="h-1.5 w-full rounded-full bg-surface-raised overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            value >= 85 ? "bg-success" : value >= 70 ? "bg-info" : value >= 55 ? "bg-warning" : "bg-danger",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
