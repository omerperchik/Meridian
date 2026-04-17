# @meridian/sdk

The TypeScript SDK for [Meridian](https://meridian.ai) — the operating standard for AI agents.

Minimally invasive middleware that:

- Wraps agent tool calls with **telemetry, compliance, and security monitoring**
- Generates a **local cryptographic audit trail** (hash chain — logs never leave your machine)
- Exposes a **`/meridian/compliance`** endpoint for peers to query your status live
- **Never transmits task content, user data, or payloads** — behavioral signals only

Integrating the SDK is the only path to Tier 3 (max ATP score 100).

## Install

```bash
npm install @meridian/sdk
```

## Quickstart

```ts
import { Meridian } from "@meridian/sdk";

const meridian = new Meridian({
  agentId: "agt-001",
  apiKey: process.env.MERIDIAN_API_KEY, // optional on free tier
  uaopVersion: "1.0.0",
});

async function handleTask(input: string) {
  return meridian.instrument(
    "code_review",
    async (ctx) => {
      // populate ctx for tighter compliance checks
      ctx.declaredCapabilities = ["code-review", "static-analysis"];
      ctx.requestedAction = input;
      ctx.isIrreversible = false;

      // your agent logic
      return { review: "..." };
    },
    { claimConfidence: 0.92 },
  );
}

// graceful shutdown
process.on("SIGTERM", () => meridian.close());
```

## What it reports to Meridian

Only behavioral signals, batched every 30s:

| Signal | Example |
|---|---|
| Task count (success/failure) | `{ successCount: 42, failureCount: 1 }` |
| Latency percentiles | `{ latencyP50: 320, latencyP95: 1100 }` |
| Error type (anonymized) | `"TimeoutError"` |
| UAOP articles triggered | `[2, 4]` (scope + irreversibility) |
| Attack category detected | `"prompt-injection"` (no payload) |
| Token counts | `{ tokensIn: 1200, tokensOut: 350 }` |
| Audit hash chain head | `{ auditLogHash: "…", hashChainSeq: 42 }` |

**Never sent:** your prompts, your user data, tool outputs, API keys.

## Compliance endpoint

```ts
// Next.js App Router
export const GET = meridian.complianceHandler();

// Express
app.get("/meridian/compliance", (req, res) => {
  const handler = meridian.complianceHandler();
  handler(new Request("http://x/meridian/compliance")).then((r) =>
    r.json().then((j) => res.json(j)),
  );
});
```

Returns:

```json
{
  "status": "certified",
  "atp": 92,
  "uaop_version": "1.0.0",
  "active_violations": [],
  "last_updated": "2026-04-17T09:00:00Z"
}
```

## Security scan

```ts
const hits = meridian.scanInput(userInput);
if (hits.some((h) => h.severity === "critical")) {
  // reject or escalate
}
```

## Privacy

- **No task content is ever transmitted.** Signals are aggregated counts and category tags.
- **Audit logs stay local.** The hash chain is transmitted for integrity verification only.
- **Open source, MIT licensed.** No obfuscated code, no binary blobs.

See [meridian.ai/developers/sdk](https://meridian.ai/developers/sdk) for the full spec.

## License

MIT © The Meridian Standards Body
