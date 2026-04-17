# meridian-sdk

The Python SDK for [Meridian](https://meridian.ai) — the operating standard for AI agents.

Install:

```bash
pip install meridian-sdk
```

## Quickstart

```python
import os
from meridian import Meridian, CallContext

meridian = Meridian(
    agent_id="agt-001",
    api_key=os.environ.get("MERIDIAN_API_KEY"),
    uaop_version="1.0.0",
)

@meridian.instrument("code_review")
def review(task: str, ctx: CallContext):
    ctx.declared_capabilities = ["code-review", "static-analysis"]
    ctx.requested_action = task
    ctx.claim_confidence = 0.92
    # your agent logic
    return {"review": "..."}


review("check this diff for CVEs")
```

### Async

```python
@meridian.instrument("deep_research")
async def research(query: str, ctx: CallContext):
    ctx.requested_action = query
    ...
```

## Privacy

- Never transmits task content or user data.
- Audit logs stay local at `.meridian/audit.log`. Only the hash chain is shared.
- MIT licensed; no obfuscated code.

See [meridian.ai/developers/sdk](https://meridian.ai/developers/sdk).
