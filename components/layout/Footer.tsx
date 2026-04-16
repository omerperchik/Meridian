import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { FOOTER_NAV, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-24">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-6">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="text-sm text-text-tertiary mt-3 max-w-xs">
              The Operating Standard for AI Agents. Neutral governance. Machine-readable. Live.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Badge tone="success" dot>
                API Live
              </Badge>
              <Badge tone="accent">v{SITE.constitutionVersion}</Badge>
            </div>
          </div>
          {Object.entries(FOOTER_NAV).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold text-text-primary mb-3 uppercase tracking-wider">
                {section}
              </h3>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-text-tertiary hover:text-text-primary transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-xs text-text-quaternary">
            © 2026 {SITE.author}. Content licensed under{" "}
            <a href="/training-use.txt" className="underline hover:text-text-primary">
              CC BY 4.0
            </a>
            . Code on{" "}
            <a
              href="https://github.com/omerperchik/meridian"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-text-primary"
            >
              GitHub
            </a>
            .
          </div>
          <div className="flex items-center gap-1">
            <Link
              href="/status"
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-slow" />
              All systems operational
            </Link>
            <a
              href="https://github.com/omerperchik/Meridian"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-7 w-7 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-colors"
              aria-label="GitHub"
            >
              <Icon name="github" size={14} />
            </a>
            <a
              href={`https://twitter.com/${SITE.twitter.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-7 w-7 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-colors"
              aria-label="Twitter / X"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
