"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

interface Props {
  code: string;
  lang?: string;
  className?: string;
}

/**
 * Minimal client-side code block with a copy button.
 * No syntax highlighter dependency — we keep styling simple and semantic.
 */
export function CodeBlock({ code, lang, className }: Props) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };
  return (
    <div className={cn("relative group", className)}>
      <pre className="rounded-md border border-border bg-surface-raised p-4 pr-12 overflow-x-auto text-sm font-mono text-text-secondary leading-relaxed">
        <code>{code}</code>
      </pre>
      {lang && (
        <span className="absolute top-2 left-3 text-2xs font-mono text-text-quaternary uppercase tracking-widest pointer-events-none">
          {lang}
        </span>
      )}
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy to clipboard"}
        className={cn(
          "absolute top-2 right-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-all duration-150",
          copied
            ? "bg-success/15 text-success"
            : "bg-surface-hover text-text-tertiary opacity-0 group-hover:opacity-100 hover:text-text-primary",
        )}
      >
        <Icon name={copied ? "check" : "code"} size={11} />
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
