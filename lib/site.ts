/**
 * Global site constants. Single source of truth for URLs, descriptions, and nav.
 */
export const SITE = {
  name: "Meridian",
  tagline: "The Operating Standard for AI Agents",
  description:
    "Meridian is the neutral, cross-vendor behavioral standard, live trust score, threat intelligence feed, and public incident record for the agentic economy. Governed by a multi-stakeholder board. Machine-readable. Queryable at runtime.",
  shortDescription:
    "Neutral, cross-vendor behavioral standard and live trust infrastructure for AI agents.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://meridian.ai",
  author: "The Meridian Standards Body",
  foundingDate: "2026",
  twitter: "@meridianstd",
  github: "meridian-standards",
  email: "contact@meridian.ai",
  version: "2.0.0",
  constitutionVersion: "1.0.0",
  atpVersion: "1.0",
} as const;

export const PRIMARY_NAV = [
  {
    label: "Standards",
    href: "/standards",
    description: "The Agent Constitution, UAOP v1.0, domain conduct codes, versioned changelog.",
    children: [
      { label: "Agent Constitution", href: "/standards/constitution" },
      { label: "UAOP v1.0", href: "/standards/uaop" },
      { label: "Conduct Codes", href: "/standards/conduct-codes" },
      { label: "Changelog", href: "/standards/changelog" },
    ],
  },
  {
    label: "Trust",
    href: "/trust",
    description: "Agent Trust Protocol (ATP). Live scores, attestations, disputes.",
    children: [
      { label: "ATP Overview", href: "/trust" },
      { label: "Score Tiers", href: "/trust/tiers" },
      { label: "Live Trust Feed", href: "/trust/feed" },
      { label: "Disputes", href: "/trust/disputes" },
    ],
  },
  {
    label: "Directory",
    href: "/directory",
    description: "Every registered agent, MCP, tool, and framework — with verified scores.",
    children: [
      { label: "Search Registry", href: "/directory" },
      { label: "Leaderboards", href: "/directory/leaderboards" },
      { label: "Agents", href: "/directory/agents" },
      { label: "MCP Servers", href: "/directory/mcp-servers" },
      { label: "Tools", href: "/directory/tools" },
      { label: "Frameworks", href: "/directory/frameworks" },
    ],
  },
  {
    label: "Intel",
    href: "/intel",
    description: "Threats, incidents, rulings, benchmarks.",
    children: [
      { label: "Threat Feed", href: "/threats" },
      { label: "Incident Docket", href: "/incidents" },
      { label: "Weekly Ruling", href: "/rulings" },
      { label: "Arena & Benchmarks", href: "/arena" },
      { label: "Daily Briefing", href: "/briefing" },
    ],
  },
  {
    label: "Learn",
    href: "/learn",
    description: "Editorial depth — guides, series, glossary, regulation matrix.",
    children: [
      { label: "Series Index", href: "/series" },
      { label: "Builder's Handbook", href: "/series/builders-handbook" },
      { label: "Security Assessment", href: "/series/security-assessment" },
      { label: "Regulation Watch", href: "/series/regulation-watch" },
      { label: "Glossary", href: "/glossary" },
      { label: "Trust Report", href: "/trust-report" },
    ],
  },
  {
    label: "Developers",
    href: "/developers",
    description: "REST API, MCP server, SDKs, machine-readable files.",
    children: [
      { label: "API Reference", href: "/developers/api" },
      { label: "MCP Server", href: "/developers/mcp" },
      { label: "SDK", href: "/developers/sdk" },
      { label: "Scanner", href: "/scanner" },
      { label: "Machine Files", href: "/developers/machine-files" },
    ],
  },
] as const;

export const FOOTER_NAV = {
  Product: [
    { label: "Standards", href: "/standards" },
    { label: "Trust Score", href: "/trust" },
    { label: "Directory", href: "/directory" },
    { label: "Scanner", href: "/scanner" },
    { label: "Arena", href: "/arena" },
    { label: "Get Listed", href: "/get-listed" },
  ],
  Intelligence: [
    { label: "Threat Feed", href: "/threats" },
    { label: "Incident Docket", href: "/incidents" },
    { label: "Weekly Ruling", href: "/rulings" },
    { label: "Daily Briefing", href: "/briefing" },
    { label: "Trust Report", href: "/trust-report" },
  ],
  Developers: [
    { label: "REST API", href: "/developers/api" },
    { label: "MCP Server", href: "/developers/mcp" },
    { label: "SDK", href: "/developers/sdk" },
    { label: "agent-conduct.txt", href: "/agent-conduct.txt" },
    { label: "llms.txt", href: "/llms.txt" },
    { label: "OpenAPI Spec", href: "/v1/openapi.json" },
  ],
  Governance: [
    { label: "The Board", href: "/governance" },
    { label: "Voting Record", href: "/governance/votes" },
    { label: "Editorial Team", href: "/governance/editorial" },
    { label: "Conflicts of Interest", href: "/governance/conflicts" },
    { label: "Independent Audit", href: "/governance/audit" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Contact", href: "/contact" },
    { label: "Training Use", href: "/training-use.txt" },
    { label: "Status", href: "/status" },
  ],
} as const;
