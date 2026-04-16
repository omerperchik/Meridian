/**
 * Minimal inline SVG icons — no external dep.
 * Linear-style: 1.5px stroke, 16px default, rounded.
 */
import { cn } from "@/lib/utils";

const baseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function Icon({ name, className, size = 16 }: { name: string; className?: string; size?: number }) {
  const commonProps = {
    width: size,
    height: size,
    className: cn("shrink-0", className),
    "aria-hidden": true,
    ...baseProps,
  };

  switch (name) {
    case "arrow-right":
      return (
        <svg {...commonProps}>
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      );
    case "arrow-up-right":
      return (
        <svg {...commonProps}>
          <path d="M7 17L17 7M7 7h10v10" />
        </svg>
      );
    case "check":
      return (
        <svg {...commonProps}>
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    case "x":
      return (
        <svg {...commonProps}>
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      );
    case "menu":
      return (
        <svg {...commonProps}>
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      );
    case "search":
      return (
        <svg {...commonProps}>
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      );
    case "shield":
      return (
        <svg {...commonProps}>
          <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" />
        </svg>
      );
    case "zap":
      return (
        <svg {...commonProps}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
    case "alert":
      return (
        <svg {...commonProps}>
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
        </svg>
      );
    case "book":
      return (
        <svg {...commonProps}>
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        </svg>
      );
    case "code":
      return (
        <svg {...commonProps}>
          <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
        </svg>
      );
    case "terminal":
      return (
        <svg {...commonProps}>
          <path d="M4 17l6-6-6-6M12 19h8" />
        </svg>
      );
    case "activity":
      return (
        <svg {...commonProps}>
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      );
    case "users":
      return (
        <svg {...commonProps}>
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      );
    case "award":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="7" />
          <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
        </svg>
      );
    case "compass":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
        </svg>
      );
    case "globe":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      );
    case "github":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={cn("shrink-0", className)} aria-hidden>
          <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 008.01 10.96c.59.11.79-.26.79-.58v-2.23c-3.26.71-3.95-1.39-3.95-1.39-.54-1.36-1.31-1.72-1.31-1.72-1.08-.73.08-.72.08-.72 1.18.08 1.82 1.22 1.82 1.22 1.05 1.8 2.76 1.28 3.43.97.1-.77.41-1.29.75-1.59-2.6-.3-5.34-1.3-5.34-5.79 0-1.28.46-2.33 1.22-3.15-.13-.3-.53-1.51.11-3.14 0 0 .99-.32 3.26 1.2a11.3 11.3 0 015.94 0C17.86 4.99 18.85 5.3 18.85 5.3c.65 1.63.25 2.84.12 3.14.76.82 1.22 1.87 1.22 3.15 0 4.51-2.75 5.49-5.37 5.78.42.36.8 1.08.8 2.18v3.24c0 .32.2.7.8.58A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
        </svg>
      );
    case "logo":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 2v20" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...commonProps}>
          <path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3z" />
        </svg>
      );
    case "external":
      return (
        <svg {...commonProps}>
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
        </svg>
      );
    case "chevron-down":
      return (
        <svg {...commonProps}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      );
    case "chevron-right":
      return (
        <svg {...commonProps}>
          <path d="M9 6l6 6-6 6" />
        </svg>
      );
    default:
      return null;
  }
}
