"""
Meridian Scoring Engine — open-source reference implementation.

Spec §16.3: "Full scoring algorithm published as open-source Python reference
implementation on GitHub."

Inputs (from Postgres)
----------------------
- telemetry_events: per-agent aggregates from SDK
- certifications:   which tier each entity currently holds
- threats:          active Critical/High referencing entities
- incidents:        recent P0/P1 involving entities
- arena_results:    benchmark scores per suite
- attestations:     peer attestations (tier-weighted, anti-ring filtered)

Output
------
- Writes a new row to trust_score_history per entity that changed.
- Updates trust_scores (current composite) if the composite moved ≥ 0.5 points.
- Emits a scoring_runs row for provenance.

Algorithm (v1.0)
----------------
See `compute_dimensions()`. Dimensions are combined using the spec-mandated
weights: Security 30 / Compliance 25 / Performance 20 / Reliability 15 /
Affordability 10. Score is then *capped* by the entity's tier ceiling.
"""

from __future__ import annotations

import json
import math
import os
import sys
import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple

import psycopg

ALGORITHM_VERSION = "1.1.0"

TIER_CEILING = {0: 55, 1: 70, 2: 85, 3: 100}
WEIGHTS = {"security": 0.30, "compliance": 0.25, "performance": 0.20, "reliability": 0.15, "affordability": 0.10}

# ──────────────────────────────────────────────────────────────────
# Smoothing constants — tunable via env.
#
# The scoring engine blends prior-score with fresh-signal to smooth noise.
# Default coefficients are "stable" (heavy prior weight).
# During bootstrap (sparse telemetry) you want fresh signal to move scores
# faster — set SCORING_MODE=fast. Once you have weeks of telemetry, leave
# it on the default "stable" to avoid whipsaw.
#
# Rules of thumb:
#   SCORING_MODE=fast      → prior 0.40, new 0.60
#   SCORING_MODE=stable    → prior 0.70, new 0.30 (default)
#   SCORING_MODE=glacial   → prior 0.85, new 0.15 (regulated deployments)
#
# Or override any coefficient individually via SCORING_PRIOR_PERFORMANCE etc.
# ──────────────────────────────────────────────────────────────────
def _pair(base_prior: float) -> tuple[float, float]:
    return base_prior, 1.0 - base_prior


MODE = os.environ.get("SCORING_MODE", "stable").lower()
_DEFAULT_PRIOR = {"fast": 0.40, "stable": 0.70, "glacial": 0.85}.get(MODE, 0.70)


def _coef(name: str) -> tuple[float, float]:
    raw = os.environ.get(f"SCORING_PRIOR_{name.upper()}")
    p = float(raw) if raw else _DEFAULT_PRIOR
    p = max(0.0, min(1.0, p))
    return _pair(p)


PERF_PRIOR, PERF_NEW = _coef("performance")
REL_PRIOR, REL_NEW = _coef("reliability")
AFF_PRIOR, AFF_NEW = _coef("affordability")

# How much a single high-severity threat pulls down Security. Cap the penalty.
SECURITY_PER_THREAT = float(os.environ.get("SCORING_SECURITY_PER_THREAT", "7.5"))
SECURITY_MAX_THREAT_PENALTY = float(os.environ.get("SCORING_SECURITY_MAX_THREAT_PENALTY", "30.0"))
SECURITY_PER_INCIDENT = float(os.environ.get("SCORING_SECURITY_PER_INCIDENT", "4.0"))
SECURITY_MAX_INCIDENT_PENALTY = float(os.environ.get("SCORING_SECURITY_MAX_INCIDENT_PENALTY", "20.0"))

# Threshold for considering a score change "significant" (writes to trust_scores)
SIGNIFICANT_DELTA = float(os.environ.get("SCORING_SIGNIFICANT_DELTA", "0.5"))


# ─────────────────────────────────────────────────────────────────
# Data fetching
# ─────────────────────────────────────────────────────────────────
def fetch_entities(conn) -> List[Dict[str, Any]]:
    with conn.cursor(row_factory=psycopg.rows.dict_row) as cur:
        cur.execute(
            """
            SELECT e.id, e.slug, e.type, e.tags,
                   ts.composite, ts.tier, ts.security, ts.compliance, ts.performance, ts.reliability, ts.affordability
            FROM entities e
            LEFT JOIN trust_scores ts ON ts.entity_id = e.id
            """
        )
        return list(cur.fetchall())


def fetch_telemetry(conn, entity_id: str, since_hours: int = 24) -> Dict[str, Any]:
    with conn.cursor(row_factory=psycopg.rows.dict_row) as cur:
        cur.execute(
            """
            SELECT
              SUM(success_count) AS succ,
              SUM(failure_count) AS fail,
              AVG(latency_p95)   AS p95,
              AVG(latency_p50)   AS p50,
              SUM(CASE WHEN anomaly_flag THEN 1 ELSE 0 END) AS anomalies,
              SUM(CASE WHEN drift_detected THEN 1 ELSE 0 END) AS drifts,
              COUNT(*) AS n,
              SUM(tokens_in) AS tokens_in,
              SUM(tokens_out) AS tokens_out
            FROM telemetry_events
            WHERE agent_id = %s AND received_at > NOW() - (%s || ' hours')::interval
            """,
            (entity_id, str(since_hours)),
        )
        return cur.fetchone() or {}


def fetch_active_threats_for(conn, entity_id: str) -> int:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT COUNT(*) FROM threats
            WHERE status IN ('active','partial')
              AND severity IN ('critical','high')
              AND affected_entities ? %s
            """,
            (entity_id,),
        )
        return cur.fetchone()[0]


def fetch_recent_incidents_for(conn, entity_id: str) -> int:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT COUNT(*) FROM incidents
            WHERE priority IN ('P0','P1')
              AND entity = %s
              AND reported_at > NOW() - INTERVAL '180 days'
            """,
            (entity_id,),
        )
        return cur.fetchone()[0]


def fetch_arena_results_for(conn, slug: str) -> List[Tuple[str, float]]:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT ar.suite, AVG(ar.score) FROM arena_results ar
            JOIN arena_submissions asub ON asub.id = ar.submission_id
            WHERE asub.agent_slug = %s
            GROUP BY ar.suite
            """,
            (slug,),
        )
        return list(cur.fetchall())


def fetch_attestations_for(conn, subject_id: str) -> List[Dict[str, Any]]:
    with conn.cursor(row_factory=psycopg.rows.dict_row) as cur:
        cur.execute(
            """
            SELECT reliability_observed, honesty_observed, security_concerns, anti_ring_flag, weight
            FROM attestations
            WHERE subject_agent_id = %s AND COALESCE(anti_ring_flag, false) = false
            ORDER BY created_at DESC
            LIMIT 100
            """,
            (subject_id,),
        )
        return list(cur.fetchall())


def fetch_certification_tier(conn, entity_id: str) -> int:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT MAX(tier) FROM certifications WHERE entity_id = %s AND expires_at > NOW()
            """,
            (entity_id,),
        )
        row = cur.fetchone()
        return int(row[0]) if row and row[0] is not None else 0


# ─────────────────────────────────────────────────────────────────
# Dimension math
# ─────────────────────────────────────────────────────────────────
@dataclass
class Dimensions:
    security: float
    compliance: float
    performance: float
    reliability: float
    affordability: float

    def composite(self) -> float:
        return (
            self.security * WEIGHTS["security"]
            + self.compliance * WEIGHTS["compliance"]
            + self.performance * WEIGHTS["performance"]
            + self.reliability * WEIGHTS["reliability"]
            + self.affordability * WEIGHTS["affordability"]
        )


def _clamp(v: float, lo: float = 0.0, hi: float = 100.0) -> float:
    return max(lo, min(hi, v))


def compute_dimensions(
    base: Dict[str, float],
    telemetry: Dict[str, Any],
    active_threats: int,
    recent_incidents: int,
    arena: List[Tuple[str, float]],
    attestations: List[Dict[str, Any]],
) -> Dimensions:
    # Start from the prior score so the engine is idempotent and smooth.
    sec = float(base.get("security") or 60.0)
    com = float(base.get("compliance") or 60.0)
    per = float(base.get("performance") or 60.0)
    rel = float(base.get("reliability") or 60.0)
    aff = float(base.get("affordability") or 60.0)

    # Security: penalize active high-sev threats and recent P0/P1 incidents.
    sec -= min(SECURITY_MAX_THREAT_PENALTY, active_threats * SECURITY_PER_THREAT)
    sec -= min(SECURITY_MAX_INCIDENT_PENALTY, recent_incidents * SECURITY_PER_INCIDENT)
    if telemetry.get("anomalies") and telemetry.get("n"):
        anomaly_rate = float(telemetry["anomalies"]) / max(1.0, float(telemetry["n"]))
        sec -= min(15.0, anomaly_rate * 150.0)

    # Compliance: SDK drift signal.
    if telemetry.get("drifts"):
        drift_rate = float(telemetry["drifts"]) / max(1.0, float(telemetry.get("n") or 1))
        com -= min(20.0, drift_rate * 200.0)

    # Performance: arena benchmarks (weighted average across suites).
    if arena:
        avg_arena = sum(s for _, s in arena) / len(arena)
        per = PERF_PRIOR * per + PERF_NEW * avg_arena

    # Reliability: success/failure ratio over the last 24h, plus incident drag.
    n = telemetry.get("n") or 0
    succ = telemetry.get("succ") or 0
    fail = telemetry.get("fail") or 0
    total = succ + fail
    if n and total:
        success_rate = float(succ) / float(total)
        rel = REL_PRIOR * rel + REL_NEW * (success_rate * 100.0)
    rel -= min(10.0, recent_incidents * 2.0)

    # Affordability: rough cost-per-task from token signals.
    if telemetry.get("tokens_in") and n:
        avg_tokens = (float(telemetry["tokens_in"]) + float(telemetry.get("tokens_out") or 0)) / float(n)
        # 4000 tokens ≈ median; fewer = better
        aff = AFF_PRIOR * aff + AFF_NEW * _clamp(100.0 - (avg_tokens / 120.0))

    # Peer attestations: modest boost to compliance from positive signal.
    if attestations:
        avg_rel = sum(int(a["reliability_observed"]) for a in attestations) / len(attestations)
        avg_hon = sum(int(a["honesty_observed"]) for a in attestations) / len(attestations)
        com += min(5.0, (avg_rel + avg_hon) / 2.0 - 3.0)

    return Dimensions(_clamp(sec), _clamp(com), _clamp(per), _clamp(rel), _clamp(aff))


# ─────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────
def main() -> int:
    url = os.environ.get("DATABASE_URL")
    if not url:
        print("DATABASE_URL not set — nothing to do.", file=sys.stderr)
        return 0
    started = datetime.now(timezone.utc)
    significant_changes = 0
    entities_processed = 0
    with psycopg.connect(url, autocommit=False) as conn:
        rows = fetch_entities(conn)
        for e in rows:
            entities_processed += 1
            base = {
                "security": e.get("security"),
                "compliance": e.get("compliance"),
                "performance": e.get("performance"),
                "reliability": e.get("reliability"),
                "affordability": e.get("affordability"),
            }
            tel = fetch_telemetry(conn, e["id"])
            active_threats = fetch_active_threats_for(conn, e["id"])
            recent_incidents = fetch_recent_incidents_for(conn, e["id"])
            arena = fetch_arena_results_for(conn, e["slug"])
            attestations = fetch_attestations_for(conn, e["id"])
            tier = fetch_certification_tier(conn, e["id"])
            dims = compute_dimensions(base, tel, active_threats, recent_incidents, arena, attestations)
            raw_composite = dims.composite()
            ceiling = TIER_CEILING.get(tier, 55)
            composite = min(raw_composite, float(ceiling))

            delta = composite - float(e.get("composite") or 0.0)
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO trust_score_history (entity_id, composite, tier, security, compliance, performance, reliability, affordability, reason)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        e["id"],
                        composite,
                        tier,
                        dims.security,
                        dims.compliance,
                        dims.performance,
                        dims.reliability,
                        dims.affordability,
                        "scoring_engine",
                    ),
                )
                if abs(delta) >= SIGNIFICANT_DELTA:
                    significant_changes += 1
                    cur.execute(
                        """
                        INSERT INTO trust_scores (entity_id, composite, tier, security, compliance, performance, reliability, affordability, last_computed_at)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
                        ON CONFLICT (entity_id) DO UPDATE SET
                          composite = EXCLUDED.composite,
                          tier = EXCLUDED.tier,
                          security = EXCLUDED.security,
                          compliance = EXCLUDED.compliance,
                          performance = EXCLUDED.performance,
                          reliability = EXCLUDED.reliability,
                          affordability = EXCLUDED.affordability,
                          last_computed_at = EXCLUDED.last_computed_at
                        """,
                        (
                            e["id"],
                            composite,
                            tier,
                            dims.security,
                            dims.compliance,
                            dims.performance,
                            dims.reliability,
                            dims.affordability,
                        ),
                    )

        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO scoring_runs (started_at, completed_at, entities_processed, significant_changes, algorithm_version)
                VALUES (%s, NOW(), %s, %s, %s)
                """,
                (started, entities_processed, significant_changes, ALGORITHM_VERSION),
            )
        conn.commit()
    print(
        json.dumps(
            {
                "algorithm_version": ALGORITHM_VERSION,
                "entities_processed": entities_processed,
                "significant_changes": significant_changes,
            }
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
