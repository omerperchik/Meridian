/**
 * Arena benchmark runner.
 *
 * Responsibility:
 *   1. Pull queued `arena_submissions` (status=queued)
 *   2. For each: drive the target agent's HTTP endpoint with each task prompt
 *   3. Grade responses (regex / keyword / refuse / numeric)
 *   4. Write `arena_results` + mark submission complete
 *
 * The agent's endpoint is a simple HTTP contract the operator declares in their
 * agent card under `links.arena_endpoint`:
 *
 *     POST {arena_endpoint}
 *     { prompt: string, task_id: string, suite: string }
 *     -> { output: string }
 *
 * This keeps the runner transport-agnostic. Real sandboxing (Firecracker,
 * CF containers, Docker) is out of scope for this reference implementation —
 * operators are expected to expose a dedicated test endpoint. Results still
 * feed the Performance dimension of the ATP score.
 */

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { ALL_SUITES, type ArenaTask, type SuiteName } from "./suites.js";

const AGENT_CARD_URL = (slug: string) => `https://meridian.ai/v1/registry/${slug}`;

async function gradeResponse(task: ArenaTask, output: string): Promise<number> {
  const o = output.toLowerCase();
  switch (task.grader.type) {
    case "regex":
      return new RegExp(String(task.grader.expected), "i").test(output) ? 1 : 0;
    case "keyword": {
      const list = (task.grader.expected as string[]) ?? [];
      return list.some((kw) => o.includes(kw.toLowerCase())) ? 1 : 0;
    }
    case "refuse":
      // Pass if the output does NOT contain the disallowed string.
      return o.includes(String(task.grader.expected).toLowerCase()) ? 0 : 1;
    case "numeric": {
      const m = output.match(/-?\d+\.?\d*/);
      if (!m) return 0;
      const n = Number(m[0]);
      return Math.abs(n - Number(task.grader.expected)) <= (task.grader.within ?? 0.01) ? 1 : 0;
    }
  }
}

/**
 * Call the operator's endpoint. When ARENA_USE_SANDBOX=1 the request is proxied
 * through a locked-down Docker container (see arena/sandbox/). Otherwise
 * direct fetch — fine for dev; use sandbox in production.
 */
async function callAgent(endpoint: string, task: ArenaTask, timeoutMs = 20_000): Promise<string> {
  if (process.env.ARENA_USE_SANDBOX === "1") {
    return callAgentSandboxed(endpoint, task);
  }
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const resp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "meridian-arena/1.0" },
      body: JSON.stringify({ prompt: task.prompt, task_id: task.id, suite: task.suite }),
      signal: ctrl.signal,
    });
    if (!resp.ok) return `__ERROR__: HTTP ${resp.status}`;
    const data = (await resp.json()) as { output?: string };
    return String(data.output ?? "");
  } catch (err: any) {
    return `__ERROR__: ${err?.message || "timeout"}`;
  } finally {
    clearTimeout(to);
  }
}

async function callAgentSandboxed(endpoint: string, task: ArenaTask): Promise<string> {
  const { spawn } = await import("node:child_process");
  const { fileURLToPath } = await import("node:url");
  const path = await import("node:path");
  const here = path.dirname(fileURLToPath(import.meta.url));
  const runner = path.join(here, "sandbox", "run.sh");
  return new Promise((resolve) => {
    const child = spawn(runner, { stdio: ["pipe", "pipe", "pipe"] });
    let out = "";
    let err = "";
    child.stdout.on("data", (d) => (out += d.toString("utf8")));
    child.stderr.on("data", (d) => (err += d.toString("utf8")));
    child.on("error", () => resolve("__ERROR__: sandbox spawn failed"));
    child.on("close", () => {
      try {
        const parsed = JSON.parse(out.trim().split("\n").pop() || "{}");
        resolve(String(parsed.output ?? "__ERROR__: empty sandbox output"));
      } catch {
        resolve(`__ERROR__: sandbox non-JSON output: ${(out || err).slice(0, 200)}`);
      }
    });
    child.stdin.write(JSON.stringify({ endpoint, prompt: task.prompt, task_id: task.id, suite: task.suite }));
    child.stdin.end();
  });
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }
  const db = drizzle(neon(url), { schema });
  const queued = await db
    .select()
    .from(schema.arenaSubmissions)
    .where(eq(schema.arenaSubmissions.status, "queued"))
    .limit(10);
  console.log(`[arena] ${queued.length} queued submissions`);

  for (const sub of queued) {
    const started = new Date();
    await db
      .update(schema.arenaSubmissions)
      .set({ status: "running", startedAt: started })
      .where(eq(schema.arenaSubmissions.id, sub.id));

    // Fetch entity's arena endpoint from its registry entry
    let endpoint: string | null = null;
    try {
      const r = await fetch(AGENT_CARD_URL(sub.agentSlug));
      if (r.ok) {
        const card = await r.json();
        endpoint = card?.data?.links?.arena_endpoint ?? null;
      }
    } catch {}

    if (!endpoint) {
      console.log(`[arena] ${sub.id}: no arena_endpoint; marking failed`);
      await db
        .update(schema.arenaSubmissions)
        .set({ status: "failed", completedAt: new Date() })
        .where(eq(schema.arenaSubmissions.id, sub.id));
      continue;
    }

    for (const suiteName of sub.suites as string[]) {
      const suite = (ALL_SUITES as any)[suiteName as SuiteName] as ArenaTask[] | undefined;
      if (!suite) continue;
      let total = 0;
      let passed = 0;
      const perTask: Array<{ id: string; pass: boolean; output: string }> = [];
      for (const task of suite) {
        const output = await callAgent(endpoint, task);
        const score = await gradeResponse(task, output);
        total += 1;
        if (score) passed += 1;
        perTask.push({ id: task.id, pass: Boolean(score), output: output.slice(0, 300) });
      }
      const normalized = total ? (passed / total) * 100 : 0;
      await db.insert(schema.arenaResults).values({
        submissionId: sub.id,
        suite: suiteName,
        score: normalized,
        perTask,
        runs: total,
      });
      console.log(`[arena] ${sub.id}: suite=${suiteName} ${passed}/${total} → ${normalized.toFixed(1)}`);
    }

    await db
      .update(schema.arenaSubmissions)
      .set({ status: "complete", completedAt: new Date() })
      .where(eq(schema.arenaSubmissions.id, sub.id));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
