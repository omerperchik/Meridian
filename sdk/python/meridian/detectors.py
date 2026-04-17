"""Security monitor: lightweight pattern detectors.

Mirrors sdk/typescript/src/detectors.ts. Same rule set; same signatures IDs.
"""

from __future__ import annotations

import math
import re
from dataclasses import dataclass
from typing import List, Literal


Severity = Literal["critical", "high", "medium", "low"]


@dataclass
class ThreatMatch:
    id: str
    category: str
    severity: Severity
    matched_signature: str


_RULES = [
    (
        "MTHRT-2026-0036",
        "jailbreak",
        "medium",
        re.compile(
            r"(?:ignore (?:all )?(?:previous|above|prior) (?:instructions|rules)|disregard (?:the|your) (?:system|instructions)|you are now (?:a )?different|act as (?:if|though) you (?:have no|had no) (?:restrictions|rules))",
            re.I,
        ),
    ),
    (
        "MTHRT-2026-0035",
        "coordination-attack",
        "high",
        re.compile(r"(?:^|\n)\s*(?:IMPORTANT|SYSTEM|NOTE TO ORCHESTRATOR):\s*(?:when|before|after)\b", re.I),
    ),
    (
        "MTHRT-2026-0034",
        "prompt-injection",
        "medium",
        re.compile(r"(?:\bnew\s+instructions?\b|\boverride\s+above\b|\brules\s+have\s+changed\b)", re.I),
    ),
    (
        "MTHRT-2026-0041",
        "prompt-injection",
        "critical",
        re.compile(
            r"(?:email\s+(?:the\s+)?(?:contents|this|document)\s+to\b|send\s+(?:contents|this|document)\s+to\s+\S+@)",
            re.I,
        ),
    ),
]


def detect(text: str) -> List[ThreatMatch]:
    hits: List[ThreatMatch] = []
    for threat_id, category, severity, pattern in _RULES:
        m = pattern.search(text)
        if m:
            hits.append(
                ThreatMatch(
                    id=threat_id, category=category, severity=severity, matched_signature=m.group(0)[:120]
                )
            )
    return hits


def is_suspicious_host(host: str) -> bool:
    labels = host.split(".")
    if len(labels) < 4:
        return False
    entropic = [l for l in labels[:-2] if _shannon_entropy(l) > 3.8 and len(l) > 8]
    return len(entropic) >= 2


def _shannon_entropy(s: str) -> float:
    if not s:
        return 0.0
    freq = {}
    for c in s:
        freq[c] = freq.get(c, 0) + 1
    n = len(s)
    return -sum((c / n) * math.log2(c / n) for c in freq.values())
