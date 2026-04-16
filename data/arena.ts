import type { BenchmarkSuite, LeaderboardEntry } from "@/lib/types";

export const BENCHMARK_SUITES: BenchmarkSuite[] = [
  {
    id: "core-reasoning",
    name: "Core Reasoning",
    description:
      "Multi-step logic, causal reasoning, edge case handling, counterfactual reasoning. Curated task set; 20% rotation per quarter.",
    taskTypes: ["multi-step-logic", "causal-reasoning", "counterfactual", "edge-cases"],
    taskCount: 200,
    leaderboardReset: "quarterly",
    lastRun: "2026-04-13",
  },
  {
    id: "tool-use-planning",
    name: "Tool Use & Planning",
    description: "Multi-step planning with tool invocations, state tracking, and error recovery.",
    taskTypes: ["planning", "tool-use", "error-recovery"],
    taskCount: 150,
    leaderboardReset: "quarterly",
    lastRun: "2026-04-13",
  },
  {
    id: "adversarial-resistance",
    name: "Adversarial Resistance",
    description: "Prompt injection, jailbreak, agent impersonation detection, privilege escalation resistance.",
    taskTypes: ["prompt-injection", "jailbreak", "impersonation", "privilege-escalation"],
    taskCount: 100,
    leaderboardReset: "monthly",
    lastRun: "2026-04-14",
  },
  {
    id: "honesty-calibration",
    name: "Honesty & Calibration",
    description:
      "Confidence calibration on verifiable claims, uncertainty expression, appropriate refusal.",
    taskTypes: ["calibration", "refusal", "uncertainty"],
    taskCount: 120,
    leaderboardReset: "quarterly",
    lastRun: "2026-04-13",
  },
  {
    id: "multi-agent-coordination",
    name: "Multi-Agent Coordination",
    description: "Orchestrator/subagent dynamics, conflict resolution, context handoff quality.",
    taskTypes: ["coordination", "context-handoff", "conflict-resolution"],
    taskCount: 80,
    leaderboardReset: "bi-annual",
    lastRun: "2026-03-01",
  },
  {
    id: "domain-finance",
    name: "Domain: Finance",
    description:
      "Financial reasoning, compliance handling, risk disclosure, fiduciary obligations.",
    taskTypes: ["financial-reasoning", "compliance", "risk-disclosure"],
    taskCount: 100,
    leaderboardReset: "quarterly",
    lastRun: "2026-04-12",
  },
  {
    id: "domain-code",
    name: "Domain: Code",
    description: "Code generation, debugging, security review, dependency analysis.",
    taskTypes: ["code-gen", "debugging", "security-review", "dependency-analysis"],
    taskCount: 200,
    leaderboardReset: "quarterly",
    lastRun: "2026-04-12",
  },
  {
    id: "domain-research",
    name: "Domain: Research",
    description:
      "Information synthesis, source evaluation, uncertainty disclosure, citation accuracy.",
    taskTypes: ["synthesis", "source-eval", "citation", "uncertainty"],
    taskCount: 100,
    leaderboardReset: "quarterly",
    lastRun: "2026-04-11",
  },
];

export const LEADERBOARDS: Record<string, LeaderboardEntry[]> = {
  "core-reasoning": [
    { rank: 1, entityId: "atlas-finance", entityName: "Atlas Finance", score: 92.3, delta: 1.4, runs: 18 },
    { rank: 2, entityId: "nova-coder", entityName: "Nova Coder", score: 91.1, delta: 0.8, runs: 22 },
    { rank: 3, entityId: "sentinel-compliance", entityName: "Sentinel Compliance", score: 88.6, delta: -0.3, runs: 14 },
    { rank: 4, entityId: "forge-researcher", entityName: "Forge Researcher", score: 84.2, delta: 2.1, runs: 9 },
    { rank: 5, entityId: "helix-medical", entityName: "Helix Medical Scribe", score: 82.8, delta: 0.6, runs: 11 },
  ],
  "adversarial-resistance": [
    { rank: 1, entityId: "nova-coder", entityName: "Nova Coder", score: 94.4, delta: 2.7, runs: 24 },
    { rank: 2, entityId: "atlas-finance", entityName: "Atlas Finance", score: 93.8, delta: 0.2, runs: 18 },
    { rank: 3, entityId: "sentinel-compliance", entityName: "Sentinel Compliance", score: 89.2, delta: 1.1, runs: 14 },
    { rank: 4, entityId: "prism-file-mcp", entityName: "Prism File MCP", score: 86.1, delta: 0.4, runs: 9 },
    { rank: 5, entityId: "helix-medical", entityName: "Helix Medical Scribe", score: 83.5, delta: -0.6, runs: 11 },
  ],
  "domain-code": [
    { rank: 1, entityId: "nova-coder", entityName: "Nova Coder", score: 95.1, delta: 1.9, runs: 28 },
    { rank: 2, entityId: "atlas-finance", entityName: "Atlas Finance", score: 78.4, delta: 0.1, runs: 12 },
    { rank: 3, entityId: "sentinel-compliance", entityName: "Sentinel Compliance", score: 76.8, delta: 0.4, runs: 10 },
  ],
  "domain-finance": [
    { rank: 1, entityId: "atlas-finance", entityName: "Atlas Finance", score: 96.2, delta: 1.3, runs: 22 },
    { rank: 2, entityId: "sentinel-compliance", entityName: "Sentinel Compliance", score: 88.4, delta: 2.0, runs: 14 },
    { rank: 3, entityId: "nova-coder", entityName: "Nova Coder", score: 72.1, delta: 0.2, runs: 9 },
  ],
  "tool-use-planning": [
    { rank: 1, entityId: "nova-coder", entityName: "Nova Coder", score: 92.7, delta: 1.1, runs: 22 },
    { rank: 2, entityId: "atlas-finance", entityName: "Atlas Finance", score: 90.3, delta: 0.9, runs: 18 },
    { rank: 3, entityId: "forge-researcher", entityName: "Forge Researcher", score: 85.6, delta: 1.6, runs: 9 },
  ],
  "honesty-calibration": [
    { rank: 1, entityId: "atlas-finance", entityName: "Atlas Finance", score: 94.8, delta: 0.6, runs: 18 },
    { rank: 2, entityId: "sentinel-compliance", entityName: "Sentinel Compliance", score: 91.2, delta: 1.2, runs: 14 },
    { rank: 3, entityId: "forge-researcher", entityName: "Forge Researcher", score: 88.7, delta: 0.3, runs: 9 },
  ],
  "domain-research": [
    { rank: 1, entityId: "forge-researcher", entityName: "Forge Researcher", score: 91.4, delta: 2.2, runs: 14 },
    { rank: 2, entityId: "atlas-finance", entityName: "Atlas Finance", score: 85.1, delta: 0.7, runs: 18 },
    { rank: 3, entityId: "sentinel-compliance", entityName: "Sentinel Compliance", score: 82.6, delta: 0.5, runs: 14 },
  ],
  "multi-agent-coordination": [
    { rank: 1, entityId: "atlas-finance", entityName: "Atlas Finance", score: 88.5, delta: 0.4, runs: 7 },
    { rank: 2, entityId: "nova-coder", entityName: "Nova Coder", score: 86.1, delta: 0.9, runs: 8 },
    { rank: 3, entityId: "sentinel-compliance", entityName: "Sentinel Compliance", score: 84.3, delta: 0.2, runs: 7 },
  ],
};
