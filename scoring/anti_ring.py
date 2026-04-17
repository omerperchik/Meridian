"""
Anti-ring detection for peer attestations.

Goal: flag mutual-attestation rings where a small cluster of agents keep
attesting favorably about each other without evidence of real interaction.

Algorithm (heuristic, transparent):
  1. Build a directed graph G where an edge A→B exists iff A has posted
     a recent (<180d) positive attestation about B.
  2. Find strongly-connected components (SCCs) of size >= 2.
  3. For each SCC, count the "positive-only" edges (reliability+honesty >= 8).
  4. Flag every attestation in an SCC where:
       - component size >= 2
       - edge density >= 0.75  (almost everyone attests to almost everyone)
       - average observed interactions (via SDK telemetry) < 3
       - component has fewer external-out edges than internal edges
  5. Write `anti_ring_flag = true` on matching attestations. The scoring
     engine ignores flagged attestations automatically (WHERE anti_ring_flag = false).

Output: a summary JSON printed to stdout for the workflow log.

Reference: MR-2026-010 ruling on attestation weighting.
"""

from __future__ import annotations

import json
import os
import sys
from collections import defaultdict
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Set, Tuple

import psycopg

POSITIVE_THRESHOLD = 8  # reliability + honesty sum
RECENT_WINDOW_DAYS = 180
DENSITY_THRESHOLD = 0.75
MIN_INTERACTIONS = 3


def tarjan_scc(nodes: Set[str], adj: Dict[str, Set[str]]) -> List[Set[str]]:
    """Tarjan's SCC algorithm. Returns components as sets."""
    idx: Dict[str, int] = {}
    low: Dict[str, int] = {}
    on_stack: Set[str] = set()
    stack: List[str] = []
    components: List[Set[str]] = []
    counter = [0]

    def visit(v: str):
        idx[v] = counter[0]
        low[v] = counter[0]
        counter[0] += 1
        stack.append(v)
        on_stack.add(v)
        for w in adj.get(v, ()):
            if w not in idx:
                visit(w)
                low[v] = min(low[v], low[w])
            elif w in on_stack:
                low[v] = min(low[v], idx[w])
        if low[v] == idx[v]:
            comp: Set[str] = set()
            while True:
                w = stack.pop()
                on_stack.discard(w)
                comp.add(w)
                if w == v:
                    break
            components.append(comp)

    for v in nodes:
        if v not in idx:
            visit(v)
    return components


def count_interactions(conn, a: str, b: str) -> int:
    """Best-effort: count telemetry events where `a` invoked a tool offered by `b`.
    We don't track peer invocation directly in telemetry_events; as a proxy, we
    count telemetry events from `a` with `task_type` containing `b`'s slug.
    """
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT COUNT(*) FROM telemetry_events
            WHERE agent_id = %s
              AND received_at > NOW() - INTERVAL '180 days'
              AND task_type ILIKE %s
            """,
            (a, f"%{b}%"),
        )
        row = cur.fetchone()
        return int(row[0]) if row else 0


def main() -> int:
    url = os.environ.get("DATABASE_URL")
    if not url:
        print("DATABASE_URL not set — nothing to do.", file=sys.stderr)
        return 0

    flagged = 0
    unflagged = 0
    components_flagged = 0

    with psycopg.connect(url, autocommit=False) as conn:
        # Pull recent, un-flagged, positive attestations.
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, attesting_agent_id, subject_agent_id,
                       reliability_observed, honesty_observed, created_at
                FROM attestations
                WHERE created_at > NOW() - (%s || ' days')::interval
                  AND COALESCE(anti_ring_flag, false) = false
                """,
                (RECENT_WINDOW_DAYS,),
            )
            rows = cur.fetchall()

        if not rows:
            print(json.dumps({"components_flagged": 0, "attestations_flagged": 0}))
            return 0

        # Build edge set of positive-only directed edges.
        nodes: Set[str] = set()
        edges: Dict[Tuple[str, str], List[int]] = defaultdict(list)  # edge -> list of attestation ids
        for att_id, a, b, rel, hon, _ in rows:
            nodes.add(a)
            nodes.add(b)
            if int(rel) + int(hon) >= POSITIVE_THRESHOLD:
                edges[(a, b)].append(int(att_id))

        adj: Dict[str, Set[str]] = defaultdict(set)
        for (a, b) in edges:
            adj[a].add(b)

        components = [c for c in tarjan_scc(nodes, adj) if len(c) >= 2]

        flag_ids: List[int] = []
        for comp in components:
            comp_list = list(comp)
            # Internal edges
            internal = 0
            external_out = 0
            for a in comp_list:
                for b in adj.get(a, ()):
                    if b in comp:
                        internal += 1
                    else:
                        external_out += 1
            possible = len(comp_list) * (len(comp_list) - 1)
            density = internal / possible if possible else 0
            # Heuristic gate: dense, inward-pointing cluster
            if density < DENSITY_THRESHOLD or internal <= external_out:
                continue

            # Check interaction counts for the most telling pair
            low_interaction = True
            for a in comp_list:
                for b in adj.get(a, ()):
                    if b not in comp:
                        continue
                    if count_interactions(conn, a, b) >= MIN_INTERACTIONS:
                        low_interaction = False
                        break
                if not low_interaction:
                    break
            if not low_interaction:
                continue

            # Flag every edge inside the component
            components_flagged += 1
            for a in comp_list:
                for b in adj.get(a, ()):
                    if b in comp:
                        flag_ids.extend(edges.get((a, b), []))

        if flag_ids:
            with conn.cursor() as cur:
                cur.execute(
                    "UPDATE attestations SET anti_ring_flag = true WHERE id = ANY(%s)",
                    (flag_ids,),
                )
                flagged = cur.rowcount or 0
            conn.commit()

        # Also consider auto-unflagging: if an attestation is no longer part of
        # a ring (because component shrank or interactions grew), we could reset.
        # Conservative default: only flag; never auto-unflag. Disputes are the
        # correct mechanism for restoring flagged attestations.

    out = {
        "components_evaluated": len(components),
        "components_flagged": components_flagged,
        "attestations_flagged": flagged,
        "attestations_unflagged": unflagged,
        "window_days": RECENT_WINDOW_DAYS,
        "density_threshold": DENSITY_THRESHOLD,
    }
    print(json.dumps(out))
    return 0


if __name__ == "__main__":
    sys.exit(main())
