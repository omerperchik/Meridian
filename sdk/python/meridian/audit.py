"""Audit trail: hash-chain log. Entries stored locally; only hash transmitted."""

from __future__ import annotations

import hashlib
import json
import os
import threading
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Dict


def sha256(data: str) -> str:
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


@dataclass
class AuditHead:
    seq: int
    prev_hash: str


class AuditChain:
    """Append-only hash-chained log. Thread-safe."""

    def __init__(self, path: str | None = ".meridian/audit.log"):
        self._path = path
        self._seq = 0
        self._prev = "GENESIS"
        self._lock = threading.Lock()
        if path:
            Path(os.path.dirname(path) or ".").mkdir(parents=True, exist_ok=True)

    def append(self, op: str, meta: Dict[str, Any]) -> Dict[str, Any]:
        with self._lock:
            self._seq += 1
            at = datetime.now(timezone.utc).isoformat()
            payload = json.dumps(
                {"seq": self._seq, "at": at, "prev_hash": self._prev, "op": op, "meta": meta},
                sort_keys=True,
                separators=(",", ":"),
            )
            entry_hash = sha256(payload)
            line = json.dumps(
                {
                    "seq": self._seq,
                    "at": at,
                    "prev_hash": self._prev,
                    "entry_hash": entry_hash,
                    "op": op,
                    "meta": meta,
                },
                separators=(",", ":"),
            )
            if self._path:
                with open(self._path, "a", encoding="utf-8") as f:
                    f.write(line + "\n")
            self._prev = entry_hash
            return {"seq": self._seq, "entry_hash": entry_hash}

    @property
    def head(self) -> AuditHead:
        return AuditHead(seq=self._seq, prev_hash=self._prev)
