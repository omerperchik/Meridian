import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "accent";

interface Props {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const TONES: Record<Tone, string> = {
  neutral: "border-border bg-surface-raised text-text-secondary",
  success: "border-success/20 bg-success/10 text-success",
  warning: "border-warning/25 bg-warning/10 text-warning",
  danger: "border-danger/25 bg-danger/10 text-danger",
  info: "border-info/25 bg-info/10 text-info",
  accent: "border-accent/30 bg-accent-muted text-accent-hover",
};

const DOT: Record<Tone, string> = {
  neutral: "bg-text-tertiary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  accent: "bg-accent",
};

export function Badge({ tone = "neutral", children, className, dot }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-2xs font-medium",
        TONES[tone],
        className,
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", DOT[tone])} />}
      {children}
    </span>
  );
}
