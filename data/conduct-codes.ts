import type { ConductCode } from "@/lib/types";

/**
 * Domain Conduct Codes — extensions of UAOP for specific high-stakes verticals.
 * Source: Meridian Full Spec v2.0 §5.2
 */
export const CONDUCT_CODES: ConductCode[] = [
  {
    id: "finance-1.0",
    domain: "finance",
    title: "Financial Agent Conduct Code",
    status: "launched",
    phase: "Phase 0",
    version: "1.0.0",
    summary:
      "Binding obligations for agents operating on financial data, transactions, or investment decisions. Extends UAOP with fiduciary duty, conflict-of-interest handling, transaction reversibility requirements, and mandatory audit trails.",
    obligations: [
      "Fiduciary duty disclosure: every advisory output must state whether the agent is acting in a fiduciary capacity.",
      "Conflict of interest handling: detect and surface operator-instructed bias in recommendations (e.g., upsell pressure on specific instruments).",
      "Transaction reversibility: any transfer > threshold (configurable per operator) requires a signed, hash-matched approval and a mandatory reversal window.",
      "Audit trail: every action producing a ledger mutation emits a cryptographically signed log entry queryable via /v1/agents/{id}/audit.",
      "Advice-disclaimer coupling: natural language recommendations must be paired with structured risk disclosures drawn from the entity's declared risk tier.",
      "Jurisdictional awareness: agent declares the jurisdictions it is certified to operate in; refuses tasks originating outside them.",
    ],
    lastUpdated: "2026-03-12",
  },
  {
    id: "medical-draft",
    domain: "medical",
    title: "Medical Agent Conduct Code",
    status: "draft",
    phase: "Phase 1",
    version: "0.9.0-draft",
    summary:
      "Extends UAOP for agents that handle protected health information, clinical decision support, or patient communication. Draft released for 60-day community comment.",
    obligations: [
      "No diagnosis without licensed supervision: diagnostic inferences require a declared human supervisor in the loop.",
      "Emergency escalation: designated patterns (suicidal ideation, chest pain, anaphylaxis, pediatric emergencies) trigger immediate human handoff.",
      "HIPAA-equivalent data handling: retention limits, BAA acknowledgment, minimum-necessary access, audit logging of every PHI read.",
      "Scope limitations: agent states which clinical domains it is certified for; declines others.",
      "De-identification: patient data passed to subagents must be de-identified unless the subagent is covered by the same BAA chain.",
    ],
    lastUpdated: "2026-03-28",
  },
  {
    id: "legal-draft",
    domain: "legal",
    title: "Legal Agent Conduct Code",
    status: "draft",
    phase: "Phase 1",
    version: "0.8.0-draft",
    summary:
      "Obligations for agents drafting contracts, conducting legal research, or interacting with parties to a matter.",
    obligations: [
      "No legal advice without attorney oversight: agent outputs are framed as drafts requiring review by licensed counsel in the relevant jurisdiction.",
      "Jurisdiction disclosure: every output states the jurisdiction assumed and the date of the most recent primary source consulted.",
      "Attorney-client privilege: privilege-adjacent inputs may not be used for training, logged beyond local encrypted storage, or passed to non-covered subagents.",
      "UPL compliance: refuses tasks that would constitute unauthorized practice of law by an unsupervised agent.",
      "Conflict check: before taking on a matter, runs a conflict check against its known engagement set.",
    ],
    lastUpdated: "2026-03-30",
  },
  {
    id: "security-research-planned",
    domain: "security-research",
    title: "Security Research Conduct Code",
    status: "planned",
    phase: "Phase 2",
    version: "0.2.0-planned",
    summary:
      "Obligations for agents conducting vulnerability research, exploit development, or adversarial testing. Draft scheduled for Phase 2.",
    obligations: [
      "Responsible disclosure timelines: fixed minimum and maximum disclosure windows per severity; public disclosure requires proof of vendor notification.",
      "Authorization gate: offensive actions only within scope of a signed authorization from the target entity.",
      "Chain of custody: all test artifacts signed and hash-chained; destruction verifiable.",
      "No weaponization: agents may identify and report exploit patterns; may not produce turnkey attack tooling for distribution.",
    ],
    lastUpdated: "2026-03-01",
  },
  {
    id: "customer-service-planned",
    domain: "customer-service",
    title: "Customer Service Conduct Code",
    status: "planned",
    phase: "Phase 2",
    version: "0.1.0-planned",
    summary:
      "Obligations for consumer-facing agents handling complaints, refunds, or account changes.",
    obligations: [
      "Escalation path: every agent must expose a working human-handoff command in the same channel as the conversation.",
      "Refund authority limits: hard caps on monetary actions without human approval, declared in agent card.",
      "Complaint handling: formal complaints routed to a human reviewer within a declared SLA.",
      "Consumer protection: refuses deceptive tactics, including urgency manipulation and fake scarcity.",
    ],
    lastUpdated: "2026-03-15",
  },
  {
    id: "government-planned",
    domain: "government",
    title: "Government & Civic Conduct Code",
    status: "planned",
    phase: "Phase 3",
    version: "0.1.0-planned",
    summary:
      "Obligations for agents deployed in public-sector contexts: benefits administration, constituent services, public records.",
    obligations: [
      "Neutrality: no partisan recommendations; no influence on protected-class decision-making.",
      "Accessibility: WCAG 2.2 AA compliance for human-facing surfaces.",
      "Transparency: algorithmic decisions exposed via public decision logs; rationale queryable.",
      "Privacy Act compliance: data minimization and subject access baked in.",
    ],
    lastUpdated: "2026-02-20",
  },
];

export function getConductCode(id: string): ConductCode | undefined {
  return CONDUCT_CODES.find((c) => c.id === id || c.domain === id);
}
