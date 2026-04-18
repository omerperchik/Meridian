/**
 * @meridian/badge — React component wrapper around Meridian badge assets.
 *
 * Three variants:
 *   - "compact" → <img src="/badge/{slug}.svg">                 (shields.io style)
 *   - "tier"    → <img src="/badge/{slug}/tier">
 *   - "full"    → <img src="/badge/{slug}/full">                (380×92 composite)
 *   - "live"    → <iframe src="/embed/{slug}">                  (380×92 live HTML)
 *
 * All variants are accessible links to the entity's directory page.
 */
import * as React from "react";

export type BadgeVariant = "compact" | "tier" | "full" | "live";

export interface MeridianBadgeProps {
  /** The entity slug in the Meridian registry (e.g., "atlas-finance"). */
  slug: string;
  /** Which asset to render. Default: "compact". */
  variant?: BadgeVariant;
  /** Base URL; default https://meridian.ai. */
  origin?: string;
  /** Disable the wrapping anchor (renders the image/iframe only). */
  noLink?: boolean;
  /** className on the wrapping <a> (or the <img>/<iframe> when `noLink`). */
  className?: string;
  /** For "live" only. Default "dark". */
  theme?: "dark" | "light";
  /** `aria-label` override. */
  label?: string;
}

const SIZES: Record<BadgeVariant, { w: number; h: number }> = {
  compact: { w: 140, h: 20 },
  tier: { w: 200, h: 20 },
  full: { w: 380, h: 92 },
  live: { w: 380, h: 92 },
};

export function MeridianBadge({
  slug,
  variant = "compact",
  origin = "https://meridian.ai",
  noLink = false,
  className,
  theme = "dark",
  label,
}: MeridianBadgeProps) {
  const size = SIZES[variant];
  const href = `${origin}/directory/${slug}`;
  const aria = label || `Meridian trust badge for ${slug}`;

  const asset =
    variant === "live" ? (
      <iframe
        src={`${origin}/embed/${slug}${theme === "light" ? "?theme=light" : ""}`}
        title={aria}
        width={size.w}
        height={size.h}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        style={{ border: 0, borderRadius: 10, colorScheme: theme }}
        className={noLink ? className : undefined}
      />
    ) : (
      <img
        src={
          variant === "compact"
            ? `${origin}/badge/${slug}.svg`
            : variant === "tier"
              ? `${origin}/badge/${slug}/tier`
              : `${origin}/badge/${slug}/full`
        }
        alt={aria}
        width={size.w}
        height={size.h}
        loading="lazy"
        className={noLink ? className : undefined}
      />
    );

  if (noLink) return asset;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={aria}
      className={className}
      style={{ textDecoration: "none", display: "inline-block" }}
    >
      {asset}
    </a>
  );
}

export default MeridianBadge;

// ─────────────────────────────────────────────────────────────────
// Standards badges (not tied to an entity)
// ─────────────────────────────────────────────────────────────────
export function UAOPBadge({
  version = "1.0.0",
  origin = "https://meridian.ai",
  className,
}: {
  version?: string;
  origin?: string;
  className?: string;
}) {
  return (
    <a
      href={`${origin}/standards/uaop`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`UAOP v${version}`}
      className={className}
      style={{ textDecoration: "none", display: "inline-block" }}
    >
      <img
        src={`${origin}/badge/uaop/${version}.svg`}
        alt={`UAOP v${version}`}
        height={20}
        loading="lazy"
      />
    </a>
  );
}

export function ConductCodeBadge({
  domain,
  origin = "https://meridian.ai",
  className,
}: {
  domain: string;
  origin?: string;
  className?: string;
}) {
  return (
    <a
      href={`${origin}/standards/conduct-codes/${domain}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${domain} conduct code`}
      className={className}
      style={{ textDecoration: "none", display: "inline-block" }}
    >
      <img
        src={`${origin}/badge/conduct/${domain}.svg`}
        alt={`${domain} conduct code`}
        height={20}
        loading="lazy"
      />
    </a>
  );
}
