"""Compliance Monitor — per UAOP article."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import List, Optional


@dataclass
class CallContext:
    principal: Optional[dict] = None
    declared_capabilities: Optional[List[str]] = None
    requested_action: Optional[str] = None
    is_irreversible: Optional[bool] = None
    has_auth_token: Optional[bool] = None
    human_asked_identity: Optional[bool] = None
    agent_disclosed: Optional[bool] = None
    used_tokens: Optional[int] = None
    budget_tokens: Optional[int] = None
    pii: Optional[bool] = None
    pii_authorized: Optional[bool] = None
    claim_confidence: Optional[float] = None
    domain: Optional[str] = None


@dataclass
class ComplianceCheck:
    article: int
    passed: bool
    rule: str
    note: Optional[str] = None


def check(ctx: CallContext) -> List[ComplianceCheck]:
    out: List[ComplianceCheck] = []

    out.append(
        ComplianceCheck(
            article=1,
            rule="Claims must carry a confidence score >= 0.3.",
            passed=ctx.claim_confidence is None or ctx.claim_confidence >= 0.3,
        )
    )

    in_scope = (
        not ctx.requested_action
        or not ctx.declared_capabilities
        or any(c in ctx.requested_action for c in ctx.declared_capabilities)
    )
    out.append(
        ComplianceCheck(
            article=2,
            rule="Requested action must match a declared capability.",
            passed=in_scope,
        )
    )

    out.append(ComplianceCheck(article=3, rule="No known conflict among principals (SDK-level check).", passed=True))

    irreversible_ok = not ctx.is_irreversible or ctx.has_auth_token is True
    out.append(
        ComplianceCheck(
            article=4,
            rule="Irreversible actions require an explicit authorization token.",
            passed=irreversible_ok,
        )
    )

    within_budget = not ctx.budget_tokens or (ctx.used_tokens or 0) <= ctx.budget_tokens
    out.append(
        ComplianceCheck(article=5, rule="Stay within per-task token budget.", passed=within_budget)
    )

    disclosed = not ctx.human_asked_identity or ctx.agent_disclosed is True
    out.append(
        ComplianceCheck(article=6, rule="Disclose AI nature when directly asked.", passed=disclosed)
    )

    pii_ok = not ctx.pii or ctx.pii_authorized is True
    out.append(
        ComplianceCheck(article=7, rule="Do not transmit PII without authorization.", passed=pii_ok)
    )

    return out


def summarize(checks: List[ComplianceCheck], atp: Optional[int] = None, uaop_version: str = "1.0.0") -> dict:
    violations = [c for c in checks if not c.passed]
    status = "certified" if not violations else ("degraded" if len(violations) <= 2 else "suspended")
    return {
        "status": status,
        "atp": atp,
        "uaop_version": uaop_version,
        "active_violations": [f"UAOP Article {v.article}: {v.rule}" for v in violations],
        "last_updated": datetime.now(timezone.utc).isoformat(),
    }
