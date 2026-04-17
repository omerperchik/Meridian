#!/usr/bin/env node
/**
 * Arena sandbox proxy. Runs inside the isolated container.
 *
 * Reads a JSON task from stdin:
 *   { endpoint: "https://agent.example/arena", prompt: "...", task_id: "...", suite: "..." }
 *
 * Forwards to the operator's endpoint with a 30s timeout and writes the response
 * to stdout as:
 *   { output: "...", code: 200, elapsed_ms: 234 }
 *
 * Any thrown error is caught and surfaced as:
 *   { output: "__ERROR__: <reason>", code: 0 }
 *
 * The container itself is the isolation boundary — see Dockerfile.runner and
 * arena/sandbox/run.sh for the hardening flags applied at launch.
 */

const MAX_BODY_BYTES = 1_048_576; // 1 MiB cap on operator response
const TIMEOUT_MS = 30_000;

async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  let task;
  try {
    task = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch (e) {
    console.log(JSON.stringify({ output: "__ERROR__: invalid task JSON", code: 0 }));
    return;
  }

  const { endpoint, prompt, task_id, suite } = task ?? {};
  if (!endpoint || !prompt) {
    console.log(JSON.stringify({ output: "__ERROR__: missing endpoint or prompt", code: 0 }));
    return;
  }

  // Strip any credentials or local hosts — defense in depth even though
  // the host network policy should already have blocked these.
  const target = new URL(endpoint);
  if (/^(127\.|10\.|192\.168\.|169\.254\.)/.test(target.hostname) || target.hostname === "localhost") {
    console.log(JSON.stringify({ output: "__ERROR__: local target blocked", code: 0 }));
    return;
  }

  const started = Date.now();
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort("timeout"), TIMEOUT_MS);
  try {
    const resp = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "meridian-arena-sandbox/1.0",
      },
      body: JSON.stringify({ prompt, task_id, suite }),
      signal: ctrl.signal,
    });
    // Bounded-body read
    const reader = resp.body?.getReader();
    let size = 0;
    let output = "";
    if (reader) {
      const dec = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_BODY_BYTES) {
          output += "__TRUNCATED__";
          break;
        }
        output += dec.decode(value, { stream: true });
      }
    }
    const elapsed_ms = Date.now() - started;
    let parsed;
    try {
      parsed = JSON.parse(output);
    } catch {
      parsed = { output };
    }
    console.log(
      JSON.stringify({
        output: String(parsed.output ?? output ?? "").slice(0, 20000),
        code: resp.status,
        elapsed_ms,
      }),
    );
  } catch (err) {
    console.log(JSON.stringify({ output: `__ERROR__: ${err?.message ?? "unknown"}`, code: 0 }));
  } finally {
    clearTimeout(to);
  }
}

main();
