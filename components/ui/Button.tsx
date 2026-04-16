import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface Props {
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  type?: "button" | "submit";
  children: React.ReactNode;
  external?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  "aria-label"?: string;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-text-primary hover:bg-accent-hover active:bg-accent-active shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
  secondary:
    "border border-border-strong bg-surface-raised text-text-primary hover:bg-surface-hover hover:border-border-focus",
  ghost: "text-text-secondary hover:text-text-primary hover:bg-surface-hover",
  danger: "bg-danger text-text-primary hover:opacity-90",
};

const SIZES: Record<Size, string> = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-3.5 py-1.5 text-sm",
  lg: "px-5 py-2.5 text-base",
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  children,
  external,
  onClick,
  disabled,
  ...rest
}: Props) {
  const classes = cn(
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  if (href) {
    if (external || href.startsWith("http") || href.endsWith(".txt") || href.endsWith(".json") || href.endsWith(".xml")) {
      return (
        <a href={href} className={classes} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} aria-label={rest["aria-label"]}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} aria-label={rest["aria-label"]}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} aria-label={rest["aria-label"]}>
      {children}
    </button>
  );
}
