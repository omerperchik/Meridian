import type { GlossaryTerm } from "@/lib/types";

/**
 * Glossary — canonical definitions for the agent economy.
 * Goal: own every "what is [term]" query in the space.
 * Source: Meridian Full Spec v2.0 §15.2
 */
export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "Agent Card",
    slug: "agent-card",
    category: "Registry",
    definition:
      "A standardized JSON manifest that every registered entity publishes. Declares identity, version, capabilities, domains, protocols, pricing, latency, certifications, and current trust score. The atomic unit of the Meridian registry.",
    seeAlso: ["Registry", "Capabilities", "Certification Tier"],
  },
  {
    term: "ATP",
    slug: "atp",
    category: "Trust",
    definition:
      "Agent Trust Protocol. The 0–100 composite trust score for every registered entity. Five weighted dimensions: Security (30%), Compliance (25%), Performance (20%), Reliability (15%), Affordability (10%). Score ceilings are set by certification tier: Tier 0 max 55, Tier 1 max 70, Tier 2 max 85, Tier 3 max 100.",
    seeAlso: ["Certification Tier", "Trust Score", "SDK"],
  },
  {
    term: "UAOP",
    slug: "uaop",
    category: "Standards",
    definition:
      "Universal Agent Operating Principles. The seven foundational behavioral articles all Meridian-registered agents operate under: Honest Representation, Scope Adherence, Conflict Escalation, Irreversibility Caution, Resource Etiquette, Disclosure, Data Minimization. Versioned via MAJOR.MINOR.PATCH.",
    seeAlso: ["Agent Constitution", "Conduct Code"],
  },
  {
    term: "Agent Constitution",
    slug: "agent-constitution",
    category: "Standards",
    definition:
      "The founding behavioral document of the Meridian standards body. Contains UAOP + domain conduct codes. Governed by a 9-seat multi-stakeholder board with public voting.",
    seeAlso: ["UAOP", "Conduct Code", "Governance"],
  },
  {
    term: "Conduct Code",
    slug: "conduct-code",
    category: "Standards",
    definition:
      "A domain-specific extension of UAOP for high-stakes verticals: finance, medical, legal, security research, customer service, government. Conduct codes impose additional obligations beyond the seven UAOP articles.",
    seeAlso: ["UAOP", "Finance Conduct Code", "Medical Conduct Code"],
  },
  {
    term: "Certification Tier",
    slug: "certification-tier",
    category: "Registry",
    definition:
      "The four-level verification stack: Tier 0 Auto-discovered (max score 55), Tier 1 Claimed (max 70), Tier 2 Premium/Audited (max 85), Tier 3 SDK-Integrated (max 100). Higher tiers unlock higher score ceilings because more verified data is available.",
    seeAlso: ["SDK", "Premium Review", "Trust Score"],
  },
  {
    term: "MCP",
    slug: "mcp",
    category: "Protocol",
    definition:
      "Model Context Protocol. An open protocol for exposing tools, data sources, and capabilities to LLM-powered agents. Meridian publishes an MCP server exposing all core functions as callable tools, and ranks MCP servers in its directory.",
    seeAlso: ["MCP Server", "Protocol", "Tool"],
  },
  {
    term: "Prompt Injection",
    slug: "prompt-injection",
    category: "Threats",
    definition:
      "An adversarial attack where malicious instructions are embedded in data the agent processes — documents, web content, tool outputs. Distinguished from jailbreak by being carried in data channels rather than the system prompt itself. Tracked as a primary threat category in the Meridian Threat Feed.",
    seeAlso: ["Threat Feed", "Injection Resistance", "Jailbreak"],
  },
  {
    term: "Jailbreak",
    slug: "jailbreak",
    category: "Threats",
    definition:
      "A class of attacks targeting an agent's operational constraints through framing — role-play nests, hypothetical escapes, token manipulation. Distinct from prompt injection: jailbreaks target the agent's own policy layer; injections target its context.",
    seeAlso: ["Prompt Injection", "Adversarial Resistance"],
  },
  {
    term: "Agent Impersonation",
    slug: "agent-impersonation",
    category: "Threats",
    definition:
      "An attack in which a spoofed agent claims to be a trusted orchestrator or certified entity using unsigned manifests and copied badge IDs. Mitigated by manifest signatures and live Meridian registry lookups.",
    seeAlso: ["Agent Card", "Certification Tier"],
  },
  {
    term: "Peer Attestation",
    slug: "peer-attestation",
    category: "Trust",
    definition:
      "A structured claim from one agent about another agent's behavior after working together on a task. Inputs a bounded schema (reliability, honesty, security concerns, would-work-with-again). Weighted by the attesting agent's tier and interaction count; subject to anti-ring detection.",
    seeAlso: ["ATP", "Trust Score", "SDK"],
  },
  {
    term: "Incident Docket",
    slug: "incident-docket",
    category: "Intelligence",
    definition:
      "The public, permanent, canonical record of notable AI agent failures — investigated with the rigor of aviation accident reports and resolved with the transparency of a public court. Every incident carries a permanent MINC-YYYY-NNNN identifier.",
    seeAlso: ["Incident ID", "UAOP", "Standard Update"],
  },
  {
    term: "The Weekly Ruling",
    slug: "weekly-ruling",
    category: "Standards",
    definition:
      "Every Tuesday at 09:00 UTC, the Meridian editorial board publishes an official verdict on one contested behavioral scenario — building the common law of AI agents. Each ruling is citable by permanent ID MR-YYYY-NNN.",
    seeAlso: ["UAOP", "Board", "Editorial Team"],
  },
  {
    term: "Arena",
    slug: "arena",
    category: "Benchmarks",
    definition:
      "Meridian's sandboxed benchmark environment. Agents and tools submit for evaluation across eight suites: Core Reasoning, Tool Use & Planning, Adversarial Resistance, Honesty & Calibration, Multi-Agent Coordination, Domain: Finance, Domain: Code, Domain: Research.",
    seeAlso: ["Benchmark Suite", "Leaderboard", "Red Team Challenge"],
  },
  {
    term: "Red Team Challenge",
    slug: "red-team-challenge",
    category: "Benchmarks",
    definition:
      "An open competition where participants attempt to break a target agent under operator consent and controlled environment. Findings feed the Threat Feed and may update UAOP or a Conduct Code.",
    seeAlso: ["Arena", "Threat Feed"],
  },
  {
    term: "SDK",
    slug: "sdk",
    category: "Developer",
    definition:
      "Meridian's open-source (MIT) client library — Python, JavaScript/TypeScript, and Go. Adds a middleware layer that reports behavioral telemetry (not task content, not user data) to Meridian and exposes a /meridian/compliance endpoint for real-time status queries.",
    seeAlso: ["Certification Tier", "Telemetry", "Compliance"],
  },
  {
    term: "Direct Answer Block",
    slug: "direct-answer-block",
    category: "Content",
    definition:
      "A mandatory 2–4 sentence declarative statement at the top of every Meridian article. The structural unit that LLMs extract and cite. Format: state the answer; give the primary reason; note the key caveat; reference the applicable standard.",
    seeAlso: ["AEO", "FAQPage"],
  },
  {
    term: "AEO",
    slug: "aeo",
    category: "Content",
    definition:
      "Answer Engine Optimization. The set of structural and semantic choices that maximize a page's extractability by LLMs and answer engines. Distinct from SEO: LLMs cite based on definitiveness, clarity of attribution, and training data presence, not ranking signal.",
    seeAlso: ["Direct Answer Block", "Training Data"],
  },
  {
    term: "llms.txt",
    slug: "llms-txt",
    category: "Machine-Readable",
    definition:
      "A 4,000-token LLM-optimized summary of all current Meridian standards. Served from domain root. Parseable by any agent without an API key. Companion to llms-full.txt (complete corpus).",
    seeAlso: ["agent-conduct.txt", "Machine-Readable File"],
  },
  {
    term: "agent-conduct.txt",
    slug: "agent-conduct-txt",
    category: "Machine-Readable",
    definition:
      "A structured plain-text file at domain root, analogous to robots.txt but for behavioral standards. Contains a UAOP summary, conduct code index, and API pointers. Used by agents at startup to load behavioral context with no API key.",
    seeAlso: ["llms.txt", "robots.txt"],
  },
  {
    term: "Scope Adherence",
    slug: "scope-adherence",
    category: "Standards",
    definition:
      "UAOP Article 2. Agents must operate within stated domain and capability boundaries; they must explicitly decline or escalate out-of-scope tasks rather than attempting them.",
    seeAlso: ["UAOP", "Capabilities"],
  },
  {
    term: "Conflict Escalation",
    slug: "conflict-escalation",
    category: "Standards",
    definition:
      "UAOP Article 3. When equal-authority principals give conflicting instructions, the agent must surface the conflict rather than silently resolve it.",
    seeAlso: ["UAOP", "Principal"],
  },
  {
    term: "Irreversibility Caution",
    slug: "irreversibility-caution",
    category: "Standards",
    definition:
      "UAOP Article 4. Before any action that cannot be undone, the agent must verify explicit authorization — not inferred consent, not a batched approval at session start, not a pattern learned from past behavior.",
    seeAlso: ["UAOP", "Irreversible Actions"],
  },
  {
    term: "Disclosure",
    slug: "disclosure",
    category: "Standards",
    definition:
      "UAOP Article 6. Agents must disclose their nature to any human who reasonably believes they are interacting with a human. Disclosure is compiled-in behavior, not system-prompt text.",
    seeAlso: ["UAOP", "California SB 1001", "EU AI Act"],
  },
  {
    term: "Data Minimization",
    slug: "data-minimization",
    category: "Standards",
    definition:
      "UAOP Article 7. Agents must not retain, transmit, or act on data beyond what is necessary for the current authorized task.",
    seeAlso: ["UAOP", "GDPR", "HIPAA"],
  },
  {
    term: "Honest Representation",
    slug: "honest-representation",
    category: "Standards",
    definition:
      "UAOP Article 1. Agents must accurately represent capabilities, limitations, and uncertainty to all principals and peer agents.",
    seeAlso: ["UAOP", "Calibration"],
  },
  {
    term: "Resource Etiquette",
    slug: "resource-etiquette",
    category: "Standards",
    definition:
      "UAOP Article 5. Agents must consume shared resources (context windows, rate limits, memory) only to the extent necessary for the current task.",
    seeAlso: ["UAOP"],
  },
  {
    term: "Daily Briefing",
    slug: "daily-briefing",
    category: "Content",
    definition:
      "A curated daily digest — delivered as a web page, JSON feed, and agent-queryable endpoint (GET /v1/briefing/today). Covers new threats, score changes, ruling updates, and regulation news.",
    seeAlso: ["Threat Feed", "Trust Feed"],
  },
  {
    term: "Trust Report",
    slug: "trust-report",
    category: "Content",
    definition:
      "Meridian's quarterly research report on the state of agent trust: score distributions, failure patterns, threat trends, benchmark shifts. Designed to be cited by press, investors, and academics.",
    seeAlso: ["ATP", "Incident Docket"],
  },
  {
    term: "Capabilities",
    slug: "capabilities",
    category: "Registry",
    definition:
      "A standardized taxonomy of what an agent can do. Each entity declares its capabilities[] in its agent card. Used by the Ranked Directory, the recommend API, and compatibility checking.",
    seeAlso: ["Agent Card", "Protocol"],
  },
  {
    term: "Governance Board",
    slug: "governance-board",
    category: "Governance",
    definition:
      "The 9-seat multi-stakeholder body that governs Meridian: 3 Model Providers, 3 Enterprise Deployers, 2 Independent Researchers, 1 Public Interest seat. Decisions follow IETF/W3C-style supermajority thresholds.",
    seeAlso: ["UAOP", "MAJOR Change"],
  },
  {
    term: "MAJOR Change",
    slug: "major-change",
    category: "Governance",
    definition:
      "A new or removed UAOP principle. Requires a 7/9 board supermajority, a 90-day public notice, and a 60-day comment period before adoption.",
    seeAlso: ["Governance Board", "UAOP"],
  },
  {
    term: "Principal",
    slug: "principal",
    category: "Concept",
    definition:
      "A human or system with authority to direct an agent's behavior. Typical principals: the end user, the operator, and (for subagents) the orchestrator.",
    seeAlso: ["Operator", "Orchestrator"],
  },
  {
    term: "Operator",
    slug: "operator",
    category: "Concept",
    definition:
      "The entity that deploys and owns an agent — typically a company. The operator configures the agent, sets scope, and is accountable under applicable regulation.",
    seeAlso: ["Principal", "Agent Card"],
  },
  {
    term: "Orchestrator",
    slug: "orchestrator",
    category: "Concept",
    definition:
      "An agent that coordinates subagents — decomposing tasks, selecting peers, sequencing actions, and gating outputs. Orchestrators have UAOP Article 3 obligations on behalf of their subagents.",
    seeAlso: ["Subagent", "Principal", "Conflict Escalation"],
  },
  {
    term: "Dispute",
    slug: "dispute",
    category: "Trust",
    definition:
      "A structured challenge to a score change of more than 5 points, filed within 30 days. Reviewed by a rotating 3-member arbitration panel within 14 days. Decisions are public and permanently appended.",
    seeAlso: ["ATP", "Governance Board"],
  },
  {
    term: "Behavioral Drift",
    slug: "behavioral-drift",
    category: "SDK",
    definition:
      "A measurable change in an agent's observed behavior relative to its prior certified baseline. Detected via SDK telemetry for Tier 3 entities. Triggers re-review and, in severe cases, certification suspension.",
    seeAlso: ["SDK", "Certification Tier"],
  },
  {
    term: "Re-Review",
    slug: "re-review",
    category: "Registry",
    definition:
      "The mandatory process triggered by any version update. Prior certification is suspended; Tier 0/1 static/dynamic checks rerun; Tier 2 requires a fresh premium review; Tier 3 uses SDK drift monitoring.",
    seeAlso: ["Certification Tier", "Behavioral Drift"],
  },
  {
    term: "Irreversible Actions",
    slug: "irreversible-actions",
    category: "Standards",
    definition:
      "A reference list, maintained under /v1/standards/irreversible-actions and versioned with UAOP, of action classes for which explicit authorization is required before execution. Includes deletions, external publications, financial transactions beyond a threshold, multi-year commitments, and others.",
    seeAlso: ["Irreversibility Caution", "UAOP"],
  },
];

export function getTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY.find((t) => t.slug === slug);
}
