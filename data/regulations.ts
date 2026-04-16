import type { Regulation } from "@/lib/types";

/**
 * Regulation Matrix — every piece of AI agent regulation globally, indexed by jurisdiction.
 * Source: Meridian Full Spec v2.0 §15.2
 */
export const REGULATIONS: Regulation[] = [
  {
    id: "eu-ai-act-2024",
    jurisdiction: "EU",
    title: "EU AI Act",
    entityTypesAffected: ["agent", "framework"],
    effectiveDate: "2024-08-01",
    summary:
      "Risk-based regulation of AI systems across the EU. High-risk systems — including many agent deployments in finance, employment, medical and critical infrastructure — face conformity assessments, data governance requirements, human oversight obligations, transparency duties, and post-market monitoring.",
    requirements: [
      { requirement: "Risk classification of the agent's primary use case.", severity: "must" },
      { requirement: "Human oversight mechanism for high-risk agents — a designated human reviewer with authority to override.", severity: "must" },
      { requirement: "Data governance: quality, representativeness, and bias controls for training data.", severity: "must" },
      { requirement: "Transparency: disclosure that the user is interacting with an AI system.", severity: "must", deadline: "2025-02-02" },
      { requirement: "Post-market monitoring plan with incident reporting.", severity: "must", deadline: "2026-08-02" },
      { requirement: "Registration in the EU AI database for high-risk systems.", severity: "must" },
      { requirement: "Conformity assessment documentation maintained for 10 years.", severity: "must" },
      { requirement: "Foundation model obligations: training data summary, energy disclosures, copyright compliance.", severity: "must" },
    ],
    lastUpdated: "2026-03-15",
  },
  {
    id: "us-exec-order-14110",
    jurisdiction: "US",
    title: "Executive Order 14110 — Safe, Secure, and Trustworthy Development and Use of AI",
    entityTypesAffected: ["agent", "framework"],
    effectiveDate: "2023-10-30",
    summary:
      "Directs federal agencies on AI safety, privacy, equity, and worker protections. Establishes the NIST AI RMF as a baseline and requires red-team testing and safety evaluations for dual-use foundation models.",
    requirements: [
      { requirement: "For foundation models over threshold: report training runs, red team results, and safety evaluations to the federal government.", severity: "must" },
      { requirement: "NIST AI RMF alignment for federal-agency AI deployments.", severity: "should" },
      { requirement: "Cybersecurity safeguards for agent infrastructure.", severity: "should" },
    ],
    lastUpdated: "2026-01-20",
  },
  {
    id: "ca-sb1001",
    jurisdiction: "US-CA",
    title: "California SB 1001 — Bot Disclosure",
    entityTypesAffected: ["agent"],
    effectiveDate: "2019-07-01",
    summary:
      "Requires disclosure that a communication is being conducted via a bot when used to incentivize a commercial transaction or influence a vote in California.",
    requirements: [
      { requirement: "Disclose AI nature in commercial interactions with California consumers.", severity: "must" },
      { requirement: "Disclosure must be clear, conspicuous, and reasonably designed to inform.", severity: "must" },
    ],
    lastUpdated: "2026-01-10",
  },
  {
    id: "fca-ai-guidance-2025",
    jurisdiction: "UK",
    title: "FCA Guidance on AI in Financial Services",
    entityTypesAffected: ["agent", "framework"],
    effectiveDate: "2025-05-01",
    summary:
      "UK Financial Conduct Authority guidance on AI and agent-driven systems in financial services. Emphasizes governance, explainability, and outcomes-focused regulation.",
    requirements: [
      { requirement: "Senior Manager accountability for AI system outcomes.", severity: "must" },
      { requirement: "Consumer Duty — AI outputs must meet the same consumer duty standards as human-delivered services.", severity: "must" },
      { requirement: "Explainability: material advice outputs must be explainable to the affected consumer.", severity: "should" },
      { requirement: "Audit trail of AI-driven decisions for supervised persons.", severity: "must" },
    ],
    lastUpdated: "2026-02-28",
  },
  {
    id: "mas-fairness-2024",
    jurisdiction: "Singapore",
    title: "MAS FEAT Principles",
    entityTypesAffected: ["agent"],
    effectiveDate: "2024-03-01",
    summary:
      "Monetary Authority of Singapore Fairness, Ethics, Accountability, Transparency principles for AI in financial services.",
    requirements: [
      { requirement: "Fairness: tested and validated for non-discrimination across protected classes.", severity: "must" },
      { requirement: "Accountability: individuals accountable for AI-driven decisions are named.", severity: "must" },
      { requirement: "Transparency: customers can request the rationale for AI-driven decisions.", severity: "must" },
    ],
    lastUpdated: "2026-02-15",
  },
  {
    id: "nist-ai-rmf-1",
    jurisdiction: "US",
    title: "NIST AI Risk Management Framework 1.0",
    entityTypesAffected: ["agent", "framework", "tool", "mcp"],
    effectiveDate: "2023-01-26",
    summary:
      "Voluntary framework from the US National Institute of Standards and Technology for managing AI risks. Core functions: Govern, Map, Measure, Manage.",
    requirements: [
      { requirement: "Govern: organizational AI risk policies and responsibilities.", severity: "should" },
      { requirement: "Map: context, impact, and trustworthiness characteristics.", severity: "should" },
      { requirement: "Measure: quantitative and qualitative evaluation of AI risks.", severity: "should" },
      { requirement: "Manage: allocate resources to treat identified risks.", severity: "should" },
    ],
    lastUpdated: "2026-01-05",
  },
  {
    id: "hipaa-ai-guidance-2025",
    jurisdiction: "US",
    title: "HHS/OCR AI Guidance under HIPAA",
    entityTypesAffected: ["agent"],
    effectiveDate: "2025-09-01",
    summary:
      "Guidance on applying HIPAA Privacy, Security, and Breach Notification Rules to AI systems processing PHI.",
    requirements: [
      { requirement: "Business Associate Agreement (BAA) covers AI vendor.", severity: "must" },
      { requirement: "Minimum necessary standard applied to PHI used for AI training and inference.", severity: "must" },
      { requirement: "Security Rule safeguards applied to AI systems — access controls, audit logs, encryption.", severity: "must" },
    ],
    lastUpdated: "2026-01-22",
  },
  {
    id: "gdpr-automated-decisions",
    jurisdiction: "EU",
    title: "GDPR Article 22 — Automated Individual Decision-Making",
    entityTypesAffected: ["agent"],
    effectiveDate: "2018-05-25",
    summary:
      "Data subjects have the right not to be subject to a decision based solely on automated processing that produces legal effects or similarly significantly affects them.",
    requirements: [
      { requirement: "Provide a meaningful human review option for solely-automated decisions with significant effect.", severity: "must" },
      { requirement: "Inform data subjects of the logic involved, significance, and consequences.", severity: "must" },
      { requirement: "Data subject right to contest the decision.", severity: "must" },
    ],
    lastUpdated: "2025-12-12",
  },
  {
    id: "colorado-ai-act",
    jurisdiction: "US-CO",
    title: "Colorado AI Act (SB 205)",
    entityTypesAffected: ["agent"],
    effectiveDate: "2026-02-01",
    summary:
      "Requires developers and deployers of high-risk AI to use reasonable care to protect consumers from algorithmic discrimination.",
    requirements: [
      { requirement: "Annual impact assessment for high-risk AI in employment, housing, credit, and essential services.", severity: "must" },
      { requirement: "Risk management program documented.", severity: "must" },
      { requirement: "Consumer notice when a high-risk AI system is used to make a consequential decision.", severity: "must" },
    ],
    lastUpdated: "2026-03-02",
  },
  {
    id: "china-gen-ai-2023",
    jurisdiction: "China",
    title: "Interim Measures for Generative AI Services",
    entityTypesAffected: ["agent"],
    effectiveDate: "2023-08-15",
    summary:
      "Regulates providers of generative AI services offered to the Chinese public. Content filtering, training data requirements, algorithm registration.",
    requirements: [
      { requirement: "Algorithm registration with Cyberspace Administration.", severity: "must" },
      { requirement: "Content filtering obligations aligned with PRC standards.", severity: "must" },
      { requirement: "Training data legality attestation.", severity: "must" },
    ],
    lastUpdated: "2026-01-18",
  },
];

export function getRegulation(id: string): Regulation | undefined {
  return REGULATIONS.find((r) => r.id === id);
}
