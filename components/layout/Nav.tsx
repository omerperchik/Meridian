"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV } from "@/lib/site";

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-200",
          scrolled ? "border-border bg-background/80 backdrop-blur-xl" : "border-transparent bg-background",
        )}
      >
        <div className="container-wide flex h-14 items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main">
              {PRIMARY_NAV.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(item.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                      pathname.startsWith(item.href)
                        ? "text-text-primary"
                        : "text-text-secondary hover:text-text-primary",
                    )}
                  >
                    {item.label}
                    <Icon name="chevron-down" size={12} className="opacity-60" />
                  </Link>
                  {openMenu === item.label && (
                    <div className="absolute left-0 top-full pt-2">
                      <div className="w-72 rounded-lg border border-border bg-surface-raised shadow-elevated p-1.5 animate-in">
                        <div className="px-2.5 py-1.5">
                          <div className="eyebrow mb-0.5">{item.label}</div>
                          <p className="text-xs text-text-tertiary">{item.description}</p>
                        </div>
                        <div className="h-px bg-border my-1" />
                        {item.children?.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
                          >
                            {c.label}
                            <Icon name="chevron-right" size={12} className="opacity-0 group-hover:opacity-60" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/developers/api"
              className="hidden md:inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-text-tertiary hover:text-text-primary transition-colors"
            >
              <Icon name="terminal" size={12} />
              API
            </Link>
            <a
              href="https://github.com/omerperchik/Meridian"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center justify-center h-8 w-8 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-colors"
              aria-label="GitHub"
            >
              <Icon name="github" size={16} />
            </a>
            <Button href="/get-listed" variant="secondary" size="sm" className="hidden sm:inline-flex">
              Get Listed
            </Button>
            <Button href="/scanner" variant="primary" size="sm" className="hidden sm:inline-flex">
              Run Scanner
            </Button>
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <Icon name={mobileOpen ? "x" : "menu"} size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-14 z-40 bg-background animate-in overflow-y-auto">
          <div className="container-page py-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge tone="accent" dot>
                v{require("@/lib/site").SITE.constitutionVersion}
              </Badge>
              <Badge tone="success" dot>
                Live
              </Badge>
            </div>
            <nav className="space-y-4" aria-label="Mobile">
              {PRIMARY_NAV.map((item) => (
                <div key={item.label} className="border-b border-border pb-3 last:border-0">
                  <Link
                    href={item.href}
                    className="flex items-center justify-between py-2 text-base font-semibold text-text-primary"
                  >
                    {item.label}
                    <Icon name="chevron-right" size={14} className="text-text-tertiary" />
                  </Link>
                  <div className="grid grid-cols-1 gap-0.5 pl-0.5 mt-1">
                    {item.children?.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="py-1.5 text-sm text-text-secondary hover:text-text-primary"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
            <div className="flex flex-col gap-2 mt-6">
              <Button href="/scanner" variant="primary" size="lg" className="w-full">
                Run Scanner
              </Button>
              <Button href="/get-listed" variant="secondary" size="lg" className="w-full">
                Get Listed
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
