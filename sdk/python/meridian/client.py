"""Main client class. See package README for usage."""

from __future__ import annotations

import asyncio
import functools
import inspect
import threading
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Callable, Dict, List, Optional, TypeVar

import httpx

from .audit import AuditChain
from .compliance import CallContext, check as compliance_check, summarize as compliance_summary
from .detectors import ThreatMatch, detect, is_suspicious_host


SDK_VERSION = "2.0.0"

T = TypeVar("T")


@dataclass
class TelemetryEvent:
    agent_id: str
    sdk_lang: str = "py"
    sdk_version: str = SDK_VERSION
    uaop_version: Optional[str] = None
    task_type: Optional[str] = None
    success_count: int = 0
    failure_count: int = 0
    latency_p50: Optional[float] = None
    latency_p95: Optional[float] = None
    error_type: Optional[str] = None
    uaop_articles_triggered: List[int] = field(default_factory=list)
    drift_detected: bool = False
    attack_attempt_category: Optional[str] = None
    anomaly_flag: bool = False
    tokens_in: Optional[int] = None
    tokens_out: Optional[int] = None
    audit_log_hash: Optional[str] = None
    hash_chain_seq: Optional[int] = None


@dataclass
class ComplianceStatus:
    status: str = "uncertified"
    atp: Optional[int] = None
    uaop_version: str = "1.0.0"
    active_violations: List[str] = field(default_factory=list)
    last_updated: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class _LatencyReservoir:
    def __init__(self, cap: int = 512):
        self._buf: List[float] = []
        self._cap = cap

    def observe(self, ms: float) -> None:
        self._buf.append(ms)
        if len(self._buf) > self._cap:
            self._buf.pop(0)

    def percentile(self, p: float) -> Optional[float]:
        if not self._buf:
            return None
        ordered = sorted(self._buf)
        idx = min(len(ordered) - 1, int((p / 100.0) * len(ordered)))
        return ordered[idx]


class Meridian:
    """
    Python SDK entrypoint.

    Parameters
    ----------
    agent_id : str
        Your Meridian-registered agent id (e.g., 'agt-001').
    api_key : Optional[str]
        Optional Meridian API key. Free tier works without one.
    uaop_version : str
        UAOP version your agent operates under.
    endpoint : str
        Base API URL. Defaults to https://meridian.ai/v1
    audit_log_path : Optional[str]
        Local file for the append-only audit log. Pass ``None`` to disable.
    flush_interval_s : float
        Telemetry flush cadence. Default 30s.
    batch_size : int
        Max events buffered before forcing a flush. Default 50.
    offline : bool
        If ``True`` telemetry is buffered in memory but never transmitted.
    """

    def __init__(
        self,
        agent_id: str,
        api_key: Optional[str] = None,
        uaop_version: str = "1.0.0",
        endpoint: str = "https://meridian.ai/v1",
        audit_log_path: Optional[str] = ".meridian/audit.log",
        flush_interval_s: float = 30.0,
        batch_size: int = 50,
        offline: bool = False,
    ):
        self.agent_id = agent_id
        self.api_key = api_key
        self.uaop_version = uaop_version
        self.endpoint = endpoint.rstrip("/")
        self.flush_interval_s = flush_interval_s
        self.batch_size = batch_size
        self.offline = offline
        self.audit = AuditChain(audit_log_path)
        self.status = ComplianceStatus(uaop_version=uaop_version)
        self._latency = _LatencyReservoir()
        self._succ = 0
        self._fail = 0
        self._tokens_in = 0
        self._tokens_out = 0
        self._buffer: List[TelemetryEvent] = []
        self._lock = threading.Lock()
        self._stop = threading.Event()
        self._flush_thread: Optional[threading.Thread] = None
        if not offline:
            self._start_flush_loop()

    # ──────────────────────────────────────────────────────────
    # Instrumentation
    # ──────────────────────────────────────────────────────────
    def instrument(self, task_type: str):
        """Decorator or context-manager factory."""

        def decorator(fn: Callable[..., T]) -> Callable[..., T]:
            if inspect.iscoroutinefunction(fn):

                @functools.wraps(fn)
                async def awrapper(*args, **kwargs):
                    ctx = kwargs.pop("ctx", None) or CallContext()
                    kwargs["ctx"] = ctx
                    return await self._run(task_type, ctx, lambda: fn(*args, **kwargs), awaitable=True)

                return awrapper

            @functools.wraps(fn)
            def wrapper(*args, **kwargs):
                ctx = kwargs.pop("ctx", None) or CallContext()
                kwargs["ctx"] = ctx
                return self._run(task_type, ctx, lambda: fn(*args, **kwargs), awaitable=False)

            return wrapper

        return decorator

    def _run(self, task_type: str, ctx: CallContext, fn: Callable[[], Any], awaitable: bool):
        start = time.perf_counter()
        attack_hits: List[ThreatMatch] = []
        if ctx.requested_action:
            attack_hits = detect(ctx.requested_action)

        success = True
        error_type: Optional[str] = None
        try:
            if awaitable:
                coro = fn()
                return self._finalize_awaitable(task_type, ctx, coro, start, attack_hits)
            return fn()
        except Exception as e:  # noqa: BLE001
            success = False
            error_type = type(e).__name__
            raise
        finally:
            if not awaitable:
                self._finalize(task_type, ctx, start, success, error_type, attack_hits)

    async def _finalize_awaitable(self, task_type, ctx, coro, start, attack_hits):
        success = True
        error_type: Optional[str] = None
        try:
            return await coro
        except Exception as e:  # noqa: BLE001
            success = False
            error_type = type(e).__name__
            raise
        finally:
            self._finalize(task_type, ctx, start, success, error_type, attack_hits)

    def _finalize(self, task_type, ctx, start, success, error_type, attack_hits):
        elapsed_ms = (time.perf_counter() - start) * 1000
        self._latency.observe(elapsed_ms)
        with self._lock:
            if success:
                self._succ += 1
            else:
                self._fail += 1

        checks = compliance_check(ctx)
        violations = [c.article for c in checks if not c.passed]
        self.status = ComplianceStatus(**compliance_summary(checks, atp=self.status.atp, uaop_version=self.uaop_version))

        head = self.audit.append(
            task_type,
            {
                "success": success,
                "elapsed_ms": elapsed_ms,
                "violations": violations,
                "attack_hits": [h.id for h in attack_hits],
            },
        )

        ev = TelemetryEvent(
            agent_id=self.agent_id,
            uaop_version=self.uaop_version,
            task_type=task_type,
            success_count=1 if success else 0,
            failure_count=0 if success else 1,
            latency_p50=self._latency.percentile(50),
            latency_p95=self._latency.percentile(95),
            error_type=error_type,
            uaop_articles_triggered=violations,
            attack_attempt_category=attack_hits[0].category if attack_hits else None,
            anomaly_flag=bool(attack_hits),
            tokens_in=self._tokens_in or None,
            tokens_out=self._tokens_out or None,
            audit_log_hash=head["entry_hash"],
            hash_chain_seq=head["seq"],
        )
        with self._lock:
            self._buffer.append(ev)
            if len(self._buffer) >= self.batch_size:
                threading.Thread(target=self._flush, daemon=True).start()

    # ──────────────────────────────────────────────────────────
    # Direct APIs
    # ──────────────────────────────────────────────────────────
    def scan_input(self, text: str) -> List[ThreatMatch]:
        return detect(text)

    def flag_suspicious_host(self, host: str) -> bool:
        return is_suspicious_host(host)

    def record_tokens(self, tokens_in: int, tokens_out: int) -> None:
        with self._lock:
            self._tokens_in += tokens_in
            self._tokens_out += tokens_out

    def compliance_status(self) -> Dict[str, Any]:
        return {
            "status": self.status.status,
            "atp": self.status.atp,
            "uaop_version": self.status.uaop_version,
            "active_violations": list(self.status.active_violations),
            "last_updated": self.status.last_updated,
        }

    # ──────────────────────────────────────────────────────────
    # Flush loop
    # ──────────────────────────────────────────────────────────
    def _start_flush_loop(self) -> None:
        def loop():
            while not self._stop.wait(self.flush_interval_s):
                self._flush()

        self._flush_thread = threading.Thread(target=loop, daemon=True)
        self._flush_thread.start()

    def _flush(self) -> None:
        if self.offline:
            return
        with self._lock:
            batch = self._buffer
            self._buffer = []
        if not batch:
            return
        payload = {"events": [self._event_to_dict(e) for e in batch]}
        headers = {"User-Agent": f"meridian-sdk-py/{SDK_VERSION}"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        try:
            httpx.post(f"{self.endpoint}/telemetry", json=payload, headers=headers, timeout=10.0)
        except Exception:
            with self._lock:
                # Re-queue so we retry on the next flush.
                self._buffer[:0] = batch

    @staticmethod
    def _event_to_dict(ev: TelemetryEvent) -> Dict[str, Any]:
        d = {
            "agentId": ev.agent_id,
            "sdkLang": ev.sdk_lang,
            "sdkVersion": ev.sdk_version,
            "uaopVersion": ev.uaop_version,
            "taskType": ev.task_type,
            "successCount": ev.success_count,
            "failureCount": ev.failure_count,
            "latencyP50": ev.latency_p50,
            "latencyP95": ev.latency_p95,
            "errorType": ev.error_type,
            "uaopArticlesTriggered": ev.uaop_articles_triggered,
            "driftDetected": ev.drift_detected,
            "attackAttemptCategory": ev.attack_attempt_category,
            "anomalyFlag": ev.anomaly_flag,
            "tokensIn": ev.tokens_in,
            "tokensOut": ev.tokens_out,
            "auditLogHash": ev.audit_log_hash,
            "hashChainSeq": ev.hash_chain_seq,
        }
        return {k: v for k, v in d.items() if v is not None}

    def close(self) -> None:
        self._stop.set()
        self._flush()
