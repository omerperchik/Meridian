import Link from "next/link";
import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  href?: string;
  interactive?: boolean;
}

export function Card({ className, children, href, interactive }: CardProps) {
  const classes = cn(
    "rounded-lg border border-border bg-surface shadow-card transition-all duration-200",
    (interactive || href) && "hover:border-border-strong hover:bg-surface-raised",
    className,
  );
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return <div className={classes}>{children}</div>;
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-5 border-b border-border", className)}>{children}</div>;
}

export function CardBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={cn("text-lg font-semibold text-text-primary", className)}>{children}</h3>;
}

export function CardDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn("text-sm text-text-tertiary mt-1", className)}>{children}</p>;
}
