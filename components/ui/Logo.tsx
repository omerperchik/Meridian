import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, withText = true }: { className?: string; withText?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2 group", className)} aria-label="Meridian home">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden>
        <defs>
          <linearGradient id="mer-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7170ff" />
            <stop offset="100%" stopColor="#5e6ad2" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" stroke="url(#mer-grad)" strokeWidth="1.75" />
        <path d="M12 2v20M2 12h20" stroke="url(#mer-grad)" strokeWidth="1.25" strokeOpacity="0.5" />
        <circle cx="12" cy="12" r="2.5" fill="url(#mer-grad)" />
      </svg>
      {withText && (
        <span className="text-[15px] font-semibold tracking-tight text-text-primary group-hover:text-text-primary transition-colors">
          Meridian
        </span>
      )}
    </Link>
  );
}
