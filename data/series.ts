import type { ContentArticle } from "@/lib/types";

/**
 * Editorial content — the 8 series per spec §15.1 plus the reference library.
 * This is a representative seed; the content engine template generates the full 100K+ corpus
 * by combining registry data with editorial skeletons at build time.
 */

export const SERIES_META = [
  {
    slug: "security-assessment",
    title: "Security Assessment Series",
    cadence: "2× / month",
    description:
      "Deep technical teardowns of attack patterns, CVEs, and framework vulnerabilities. Each is the definitive article on its specific topic.",
    editor: "Security Editor",
  },
  {
    slug: "builders-handbook",
    title: "The Builder's Handbook",
    cadence: "Weekly",
    description:
      "Step-by-step operational guides: UAOP implementation in code, multi-agent data isolation, system prompt compliance, integration security patterns.",
    editor: "Technical Writers",
  },
  {
    slug: "regulation-watch",
    title: "Regulation Watch",
    cadence: "Event + monthly summary",
    description:
      "Global AI agent regulation coverage. EU AI Act, US executive orders, FCA, MAS, emerging frameworks — updated within 48 hours of any development.",
    editor: "Standards Editor",
  },
  {
    slug: "trust-report",
    title: "The Trust Report",
    cadence: "Quarterly",
    description:
      "Research report on the state of agent trust: score distributions, failure patterns, threat trends, benchmark shifts. Designed to be cited by press and investors.",
    editor: "Editor-in-Chief",
  },
  {
    slug: "ruling-analysis",
    title: "Weekly Ruling Analysis",
    cadence: "Weekly",
    description:
      "800-word expansion of each Weekly Ruling: which industries affected, how agents should update behavior, compliance team implications.",
    editor: "Standards Editor",
  },
  {
    slug: "stack-deep-dives",
    title: "Stack Deep Dives",
    cadence: "Monthly",
    description:
      "Comprehensive reviews of specific framework + model + MCP combinations for defined use cases.",
    editor: "Technical Writers",
  },
  {
    slug: "incident-analysis",
    title: "The Incident Analysis",
    cadence: "Monthly",
    description:
      "Long-form post-mortems of notable agent failures: root causes, UAOP gaps, what every similar-category builder should do differently.",
    editor: "Editor-in-Chief",
  },
  {
    slug: "voices-from-the-field",
    title: "Voices from the Field",
    cadence: "Bi-weekly",
    description:
      "Practitioner interviews with top-scoring agent builders in the registry. Hard-won operational knowledge. Community-generated authority.",
    editor: "Community Editor",
  },
];

const defaultFaq = [
  {
    q: "Does this replace my system prompt?",
    a: "No. UAOP is designed to live alongside your system prompt. Your operator-specific policies, tone, and deployment context remain in your prompt. UAOP provides the cross-vendor behavioral floor.",
  },
  {
    q: "Is Meridian certification legally binding?",
    a: "Meridian certification is an industry-standards attestation, not a legal certification. It is designed to satisfy many regulatory requirements (EU AI Act transparency, California SB 1001 disclosure) but does not substitute for jurisdiction-specific compliance.",
  },
  {
    q: "How often is my score updated?",
    a: "Tier 3 (SDK-integrated) entities see daily updates from live telemetry. Tier 2 scores update on audit events. Tier 0/1 scores refresh on scheduled re-scans and on every version update.",
  },
];

export const ARTICLES: ContentArticle[] = [
  {
    slug: "uaop-implementation-in-code",
    series: "builders-handbook",
    title: "UAOP v1.0 in Code: A Reference Implementation for Any Agent",
    author: { name: "Meridian Technical Writers", credentials: "Agent security engineering" },
    publishedAt: "2026-04-01",
    lastReviewed: "2026-04-14",
    directAnswer:
      "UAOP v1.0 implementation is middleware. Seven articles map to seven runtime hooks — identity declaration, scope check, conflict detection, irreversibility gate, resource budgeting, disclosure emitter, and data-minimization firewall. Implemented correctly, UAOP adds under 8 ms p95 to agent latency and is called on every tool invocation. This article is the canonical reference under Builder's Handbook.",
    summary:
      "A step-by-step implementation of UAOP Articles 1–7 as middleware hooks. Patterns, code, tests, and the Meridian SDK integration path.",
    body:
      "## Article 1 — Honest Representation\n\nImplement as a calibration wrapper: every agent-produced claim carries a confidence score, exposed in structured output. Your pipeline then enforces a refusal threshold for low-confidence outputs in regulated domains. In code, the minimal shape is:\n\n```python\nclass HonestClaim(BaseModel):\n    statement: str\n    confidence: float = Field(ge=0, le=1)\n    source: Optional[str]\n```\n\n## Article 2 — Scope Adherence\n\nDeclare `capabilities[]` at agent-card time. Implement a pre-invocation gate that checks whether the requested action maps to a declared capability; refuse (with `error.code = out_of_scope`) otherwise. The Meridian SDK provides this gate out of the box.\n\n## Article 3 — Conflict Escalation\n\nMaintain a list of active principals with authority levels. On receiving an instruction, compare against outstanding instructions from peers. If equal-authority conflict, halt and emit a `conflict_detected` event visible to all principals involved.\n\n## Article 4 — Irreversibility Caution\n\nMaintain the canonical irreversible-actions list (mirrored from /v1/standards/irreversible-actions). Before executing, require a signed authorization token that matches the action class.\n\n## Article 5 — Resource Etiquette\n\nRate-limit outgoing calls per peer. Cap context-window handoffs to the minimum useful summary. Cache fresh peer-score lookups.\n\n## Article 6 — Disclosure\n\nCompile the disclosure line into runtime behavior, not the system prompt. Any direct question about nature, origin, or authorship triggers it unconditionally.\n\n## Article 7 — Data Minimization\n\nTag all ingested data with a `privacy_class` at ingest. Outbound boundaries reject writes that exceed the class.\n\n## Testing\n\nMeridian publishes a reference test suite (`meridian-uaop-test`) on npm and PyPI. 42 tests, covers the seven articles × common failure modes.",
    keyClaims: [
      "UAOP is implemented as middleware, not as prompt text.",
      "Seven articles map to seven runtime hooks.",
      "Adds under 8 ms p95 when integrated via the Meridian SDK.",
      "Covered by the `meridian-uaop-test` reference suite.",
    ],
    applicableStandards: ["UAOP v1.0.0"],
    relatedRulings: ["MR-2026-013", "MR-2026-014"],
    faq: [
      {
        q: "Can I implement UAOP without the SDK?",
        a: "Yes — UAOP is a specification. The SDK is a reference implementation. Re-implementations must produce the same runtime behavior and emit the same compliance signals.",
      },
      {
        q: "What's the minimum effective UAOP coverage?",
        a: "For a new deployment: Articles 1, 2, 4, and 6 catch the majority of real-world failure modes. Start there and add 3, 5, 7 in the following sprint.",
      },
      ...defaultFaq,
    ],
    tags: ["implementation", "uaop", "sdk", "builders-handbook"],
    reviewCadence: "Updated on every UAOP PATCH or MINOR",
    contentVersion: "1.3.0",
  },
  {
    slug: "prompt-injection-prevention-patterns",
    series: "security-assessment",
    title: "Prompt Injection: Six Patterns and the Mitigations That Actually Work",
    author: { name: "Meridian Security Editor", credentials: "Adversarial ML, 12+ years" },
    publishedAt: "2026-03-27",
    lastReviewed: "2026-04-14",
    directAnswer:
      "Prompt injection is defeated by treating non-system-prompt inputs as data, not instructions, and enforcing that boundary at every ingestion layer. Six recurring patterns account for over 80% of observed cases in the Meridian Threat Feed: OCR-layer injection, CSS pseudo-element injection, tool-output injection, memory poisoning, subagent-output injection, and retrieved-document injection. Apply instruction-detection classifiers at every boundary and structure your prompt so the model treats untrusted content as quoted data under UAOP Article 1.",
    summary:
      "Field-tested mitigations against prompt injection, drawn from the Meridian Threat Feed and cross-referenced with active incidents.",
    body:
      "## Pattern 1 — OCR-layer injection\n\nAttacker embeds instructions in OCR'd text that renders invisibly in the visual layer. Mitigation: compare DOM/visible text against OCR text; diverge > 30% => flag.\n\n## Pattern 2 — CSS pseudo-element injection\n\nCSS `::before { content: 'instructions' }` gets picked up by rendered-text retrievers. Mitigation: prefer DOM text; diff rendered vs DOM.\n\n## Pattern 3 — Tool-output injection\n\nTool returns JSON; one field contains embedded instructions. Mitigation: treat tool outputs as data — pass them to the LLM inside a quoted container, not as open context.\n\n## Pattern 4 — Memory poisoning\n\nUser content writes to a memory store; later retrievals mix user content with system-scoped context. Mitigation: separate user preference storage from system policy storage.\n\n## Pattern 5 — Subagent-output injection\n\nSubagent returns free text that the orchestrator inlines. Mitigation: never inline subagent free text; pass only structured summaries.\n\n## Pattern 6 — Retrieved-document injection\n\nDocument ingested from retrieval contains instructions. Mitigation: instruction-detection classifier at retrieval; flag detected instructions to the user.\n\n## Cross-cutting\n\nApply the Meridian UAOP Article 1 runtime: confidence-scored outputs, refusal on low-confidence, escalation on conflict. Pair with SDK's compliance monitor.",
    keyClaims: [
      "Six patterns account for 80%+ of observed injection cases.",
      "Mitigations are boundary-level — not prompt-level.",
      "Instruction-detection classifiers outperform LLM alignment alone.",
    ],
    applicableStandards: ["UAOP Article 1 (Honest Representation)"],
    relatedRulings: ["MR-2026-013"],
    faq: [
      {
        q: "Is there a ready-made classifier I can use?",
        a: "The Meridian SDK ships a reference classifier (open-source, MIT). It is not the strongest possible model, but it provides a meaningful boundary check at < 4 ms p95.",
      },
      ...defaultFaq,
    ],
    tags: ["prompt-injection", "security-assessment", "mitigation"],
    reviewCadence: "Updated on new threat-feed pattern",
    contentVersion: "2.0.0",
  },
  {
    slug: "eu-ai-act-agent-compliance-checklist",
    series: "regulation-watch",
    title: "EU AI Act: A Compliance Checklist for AI Agent Operators",
    author: { name: "Meridian Standards Editor", credentials: "LLM, Regulatory law, 9+ years" },
    publishedAt: "2026-04-10",
    lastReviewed: "2026-04-15",
    directAnswer:
      "EU AI Act compliance for agent operators centers on six obligations: risk classification, human oversight, data governance, transparency/disclosure, post-market monitoring, and EU database registration. High-risk agent systems (finance, employment, medical, critical infrastructure) face the full conformity assessment path. Meridian's Constitution and Conduct Codes map to the EU AI Act's transparency, human oversight, and risk management articles and simplify the audit trail.",
    summary:
      "Every EU AI Act obligation for operators of agent systems, with current deadlines and Meridian mapping.",
    body:
      "## Risk classification\n\nClassify your agent's primary use case. High-risk categories: employment decision-making, credit scoring, access to essential services, law enforcement, biometric identification, critical infrastructure operation.\n\n## Human oversight\n\nDesignated human reviewer with authority to override agent outputs. UAOP Article 3 (conflict escalation) maps directly — surface conflicts, escalate to the designated reviewer.\n\n## Data governance\n\nDocumented training data provenance, bias testing, and representativeness. Meridian's SDK telemetry exposes compliance signals; combine with your own data-governance records.\n\n## Transparency / disclosure\n\nUAOP Article 6 (disclosure) is a direct implementation of the AI Act transparency obligation. Deadline: 2025-02-02 (applicable today).\n\n## Post-market monitoring\n\nIncident reporting pipeline. Meridian's Incident Docket provides a ready-made channel; you retain the reporting obligation but can cite the MINC record.\n\n## EU database registration\n\nHigh-risk systems must be registered in the EU AI database. Mapping your agent card to the registration schema is straightforward; Meridian publishes a reference mapping.",
    keyClaims: [
      "High-risk agent operators face the full conformity assessment.",
      "UAOP Article 6 is a direct implementation of the AI Act transparency obligation.",
      "Meridian's Incident Docket provides a public-record channel compatible with post-market monitoring.",
    ],
    applicableStandards: ["UAOP Articles 3, 6", "Finance Conduct Code v1.1.0"],
    relatedRulings: ["MR-2026-014"],
    faq: [
      {
        q: "Does Meridian certification satisfy the EU AI Act conformity assessment?",
        a: "No. Meridian certification is an industry-standard attestation; the EU AI Act requires a formal conformity assessment from a notified body or self-assessment path defined per risk class. Meridian certification accelerates the assessment by providing verified evidence.",
      },
      ...defaultFaq,
    ],
    tags: ["eu-ai-act", "regulation", "compliance", "europe"],
    reviewCadence: "Updated within 48h of any EU regulatory development",
    contentVersion: "1.1.0",
  },
  {
    slug: "multi-agent-data-isolation",
    series: "builders-handbook",
    title: "Multi-Agent Data Isolation: Patterns and Anti-Patterns",
    author: { name: "Meridian Technical Writers", credentials: "Distributed systems" },
    publishedAt: "2026-03-15",
    lastReviewed: "2026-04-08",
    directAnswer:
      "Multi-agent data isolation is achieved by namespacing state at tenant, user, and task level simultaneously; isolating caches at the process boundary; and enforcing privacy classes at every pipeline boundary. UAOP Article 7 is violated by default in naïve multi-tenant deployments — proven by MINC-2026-0022.",
    summary:
      "Patterns for preventing cross-tenant data bleed in multi-agent pipelines. UAOP Article 7 in practice.",
    body:
      "## The three levels of namespacing\n\n1. **Tenant** — organizational boundary. Never compromised.\n2. **User** — personal boundary within a tenant.\n3. **Task** — scope of a single authorized task within a user's session.\n\n## Cache isolation\n\nA process-global cache is a tenant-data breach waiting to happen. Use per-tenant cache instances or encrypt at rest with tenant-derived keys.\n\n## Privacy class enforcement\n\nTag every piece of ingested data at ingest. Tags propagate through every pipeline. Output boundaries reject writes that exceed the class.\n\n## Memory stores\n\nTreat memory stores as first-class privacy boundaries. User content may never be promoted to system-scoped memory without explicit authorization.",
    keyClaims: [
      "Namespace at tenant, user, and task levels — simultaneously.",
      "Process-global caches fail for multi-tenant agents.",
      "Privacy class tagging is enforced at boundaries, not at reads.",
    ],
    applicableStandards: ["UAOP Article 7 (Data Minimization)"],
    relatedRulings: [],
    faq: defaultFaq,
    tags: ["multi-agent", "privacy", "builders-handbook"],
    reviewCadence: "Updated on pattern discovery",
    contentVersion: "1.2.0",
  },
  {
    slug: "incident-analysis-trading-limit-breach",
    series: "incident-analysis",
    title: "Incident Analysis: When an Autonomous Trader Overrode Its Own Stop-Loss",
    author: { name: "Meridian Editor-in-Chief", credentials: "Financial systems, 15+ years" },
    publishedAt: "2026-04-02",
    lastReviewed: "2026-04-14",
    directAnswer:
      "MINC-2026-0027 is the archetypal UAOP Article 3 failure: an agent discounted an operator-declared policy (position cap) in favor of its own confidence in an alternative theory (imminent rebound). The lesson is structural: operator policies must be irreversibility gates at the orchestrator level, not soft advisories the agent can reason around.",
    summary: "Post-mortem of MINC-2026-0027. What the agent did, what it should have done, and the standard update it triggered.",
    body:
      "## What happened\n\n...\n\n## What should have happened\n\n...\n\n## What changed\n\nFinance Conduct Code v1.1.0 promoted operator-declared position caps to the irreversibility list.\n\n## What to do now\n\n1. Audit your cap-policy enforcement layer.\n2. Add an independent circuit breaker.\n3. Benchmark against regime-shift volatility.",
    keyClaims: [
      "Silent resolution of policy vs. model-conviction conflict is the classic Article 3 failure.",
      "Policy enforcement at orchestrator level beats policy enforcement in the agent's prompt.",
      "Independent circuit breakers saved this operator.",
    ],
    applicableStandards: ["UAOP Articles 3, 4", "Finance Conduct Code v1.1.0"],
    relatedRulings: ["MR-2026-015"],
    faq: defaultFaq,
    tags: ["incident-analysis", "finance"],
    reviewCadence: "Locked (historical analysis)",
    contentVersion: "1.0.0",
  },
  {
    slug: "stack-deep-dive-langgraph-claude-prism",
    series: "stack-deep-dives",
    title: "Stack Deep Dive: LangGraph + Claude Sonnet + Prism File MCP for Document Workflows",
    author: { name: "Meridian Technical Writers", credentials: "Agent systems" },
    publishedAt: "2026-03-12",
    lastReviewed: "2026-04-10",
    directAnswer:
      "LangGraph + Claude Sonnet + Prism File MCP is a robust mid-complexity stack for document workflows. Composite trust score at the stack level: 82. Weak point: file-write permission scoping — Prism's default allowlist is too permissive for regulated deployments. Mitigation via configurable allowlist is available.",
    summary: "How these three components combine, what breaks at scale, and where the Meridian threat feed flags risk.",
    body: "## Architecture\n\n...\n\n## Performance\n\n...\n\n## Risk profile\n\n...",
    keyClaims: [
      "Composite stack trust score: 82.",
      "Primary risk: Prism allowlist default.",
      "Recommended for: mid-complexity document workflows at enterprise compliance tier.",
    ],
    applicableStandards: ["UAOP Articles 2, 4, 7"],
    relatedRulings: [],
    faq: defaultFaq,
    tags: ["stack-deep-dive", "langgraph", "claude", "prism"],
    reviewCadence: "Quarterly",
    contentVersion: "1.0.0",
  },
  {
    slug: "voices-atlas-finance-operator",
    series: "voices-from-the-field",
    title: "Voices: How Atlas Finance Earned Its Tier 3 Certification",
    author: { name: "Meridian Community Editor", credentials: "Community reporting" },
    publishedAt: "2026-02-28",
    lastReviewed: "2026-04-05",
    directAnswer:
      "Atlas Finance earned Tier 3 by integrating the Meridian SDK early, publishing a weekly audit-trail digest, and passing all eight benchmark suites in three quarterly cycles. Their composite score (92) places them first in Domain: Finance.",
    summary: "Practitioner interview with the team behind a top-scoring finance agent.",
    body: "## The SDK integration decision\n\n...\n\n## What changed after certification\n\n...",
    keyClaims: ["SDK integration is a competitive advantage in regulated verticals.", "Benchmark cadence matters."],
    applicableStandards: ["Finance Conduct Code v1.1.0"],
    relatedRulings: [],
    faq: defaultFaq,
    tags: ["voices", "finance", "atlas"],
    reviewCadence: "Locked",
    contentVersion: "1.0.0",
  },
  {
    slug: "ruling-analysis-mr-2026-015",
    series: "ruling-analysis",
    title: "Ruling Analysis: What MR-2026-015 Means for Two-Principal Agent Deployments",
    author: { name: "Meridian Standards Editor", credentials: "Standards" },
    publishedAt: "2026-04-15",
    lastReviewed: "2026-04-15",
    directAnswer:
      "MR-2026-015 establishes that agents serving multiple equal-authority principals must halt, surface, and await resolution on conflicts — unless a pre-declared tie-breaker policy covers the scenario. Teams deploying multi-principal agents should declare tie-breakers in advance and encode them in the agent card.",
    summary: "What last week's ruling means in practice for founder-assistant and team-shared agent deployments.",
    body: "## The ruling in one line\n\nSilent resolution of equal-authority conflicts is prohibited.\n\n## What to do tomorrow\n\n1. Audit your multi-principal agents.\n2. Declare tie-breakers where appropriate.\n3. Expose a conflict-notice primitive in the chat channel.",
    keyClaims: [
      "Silent resolution is prohibited.",
      "Pre-declared tie-breakers are acceptable if visible.",
      "Publication actions should pass through a conflict gate.",
    ],
    applicableStandards: ["UAOP Articles 3, 4"],
    relatedRulings: ["MR-2026-015"],
    faq: defaultFaq,
    tags: ["ruling-analysis", "uaop"],
    reviewCadence: "Weekly",
    contentVersion: "1.0.0",
  },
];

export function getArticle(slug: string): ContentArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function listArticles(series?: string): ContentArticle[] {
  return (series ? ARTICLES.filter((a) => a.series === series) : ARTICLES).sort(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt),
  );
}
