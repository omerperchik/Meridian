"""
meridian-sdk — Python SDK for Meridian.

Quickstart:
    from meridian import Meridian

    meridian = Meridian(agent_id="agt-001", api_key=os.environ["MERIDIAN_API_KEY"])

    @meridian.instrument("code_review")
    def handle(task, ctx):
        ctx.declared_capabilities = ["code-review"]
        ctx.requested_action = task
        ...
        return result
"""

from .client import Meridian, CallContext, TelemetryEvent, ComplianceStatus, ThreatMatch
from .detectors import detect, is_suspicious_host
from .compliance import check, summarize
from .audit import AuditChain

__all__ = [
    "Meridian",
    "CallContext",
    "TelemetryEvent",
    "ComplianceStatus",
    "ThreatMatch",
    "detect",
    "is_suspicious_host",
    "check",
    "summarize",
    "AuditChain",
]

__version__ = "2.0.0"
