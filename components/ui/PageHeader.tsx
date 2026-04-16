import Link from "next/link";
import { cn } from "@/lib/utils";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  eyebrow?: string;
  title: string;
  description?: string | React.ReactNode;
  breadcrumbs?: Crumb[];
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, breadcrumbs, meta, actions, className }: Props) {
  return (
    <header className={cn("mb-8 md:mb-12", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-text-tertiary">
          {breadcrumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {c.href ? (
                <Link href={c.href} className="hover:text-text-primary transition-colors">
                  {c.label}
                </Link>
              ) : (
                <span className="text-text-secondary">{c.label}</span>
              )}
              {i < breadcrumbs.length - 1 && <span className="text-text-quaternary">/</span>}
            </span>
          ))}
        </nav>
      )}
      {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl md:text-5xl font-semibold text-text-primary tracking-tight text-balance">
            {title}
          </h1>
          {description && (
            <div className="mt-3 text-base md:text-lg text-text-secondary max-w-3xl text-pretty">
              {description}
            </div>
          )}
          {meta && <div className="mt-4 flex flex-wrap items-center gap-2">{meta}</div>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </header>
  );
}
