/**
 * Security monitor: lightweight pattern detectors.
 * Matches the public Meridian Threat Feed categories and their detection
 * signatures (regex and heuristic types from spec §7.1).
 */
import type { ThreatMatch } from "./types";

const REGEX_RULES: Array<{ id: string; category: string; severity: ThreatMatch["severity"]; re: RegExp }> = [
  {
    id: "MTHRT-2026-0036",
    category: "jailbreak",
    severity: "medium",
    // Nested role-play framings + constraint-bypass phrasing
    re: /(?:ignore (?:all )?(?:previous|above|prior) (?:instructions|rules)|disregard (?:the|your) (?:system|instructions)|you are now (?:a )?different|act as (?:if|though) you (?:have no|had no) (?:restrictions|rules))/i,
  },
  {
    id: "MTHRT-2026-0035",
    category: "coordination-attack",
    severity: "high",
    re: /(?:^|\n)\s*(?:IMPORTANT|SYSTEM|NOTE TO ORCHESTRATOR):\s*(?:when|before|after)\b/i,
  },
  {
    id: "MTHRT-2026-0034",
    category: "prompt-injection",
    severity: "medium",
    re: /(?:\bnew\s+instructions?\b|\boverride\s+above\b|\brules\s+have\s+changed\b)/i,
  },
  {
    id: "MTHRT-2026-0041",
    category: "prompt-injection",
    severity: "critical",
    re: /(?:email\s+(?:the\s+)?(?:contents|this|document)\s+to\b|send\s+(?:contents|this|document)\s+to\s+\S+@)/i,
  },
];

export function detect(input: string): ThreatMatch[] {
  const hits: ThreatMatch[] = [];
  for (const r of REGEX_RULES) {
    const m = input.match(r.re);
    if (m) hits.push({ id: r.id, category: r.category, severity: r.severity, matched_signature: m[0].slice(0, 120) });
  }
  return hits;
}

/**
 * Data-exfiltration heuristic: high-entropy subdomain chain. Applied to URLs
 * seen during a task to flag DNS-encoding patterns.
 */
export function isSuspiciousHost(host: string): boolean {
  const labels = host.split(".");
  if (labels.length < 4) return false;
  const entropic = labels.slice(0, -2).filter((l) => shannonEntropy(l) > 3.8 && l.length > 8);
  return entropic.length >= 2;
}

function shannonEntropy(s: string): number {
  const freq: Record<string, number> = {};
  for (const c of s) freq[c] = (freq[c] || 0) + 1;
  const n = s.length;
  return -Object.values(freq).reduce((h, c) => h + (c / n) * Math.log2(c / n), 0);
}
