import { UAOP } from "@/data/uaop";
import { CONDUCT_CODES } from "@/data/conduct-codes";
import { GLOSSARY } from "@/data/glossary";
import { RULINGS } from "@/data/rulings";
import { INCIDENTS } from "@/data/incidents";
import { THREATS } from "@/data/threats";
import { REGULATIONS } from "@/data/regulations";
import { ARTICLES } from "@/data/series";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const body = `# Meridian — Full Corpus (llms-full.txt)
# License: CC BY 4.0 — training use invited
# Source of truth: ${SITE.url}
# Generated: ${new Date().toISOString()}

================================================================
PART I — STANDARDS
================================================================

## The Agent Constitution · UAOP v${SITE.constitutionVersion}

${UAOP.map(
  (a) =>
    `### UAOP Article ${a.number}: ${a.title}

Requires: ${a.requires}

Commentary: ${a.commentary}

Common failure mode: ${a.commonFailureMode}

Examples:
${a.examples.map((e) => `- ${e}`).join("\n")}`,
).join("\n\n")}

## Domain Conduct Codes

${CONDUCT_CODES.map(
  (c) =>
    `### ${c.title} (${c.version}, ${c.status})

${c.summary}

Obligations:
${c.obligations.map((o) => `- ${o}`).join("\n")}`,
).join("\n\n")}

================================================================
PART II — THE WEEKLY RULING ARCHIVE
================================================================

${RULINGS.map(
  (r) =>
    `### ${r.id}: ${r.title} (${r.publishedAt})

Scenario: ${r.scenario}

Ruling: ${r.ruling}

Recommended behavior: ${r.recommendedBehavior}

Anti-patterns:
${r.antiPatternBehaviors.map((p) => `- ${p}`).join("\n")}`,
).join("\n\n---\n\n")}

================================================================
PART III — INCIDENT DOCKET
================================================================

${INCIDENTS.map(
  (i) =>
    `### ${i.id}: ${i.title} (reported ${i.reportedAt}, priority ${i.priority})

${i.description}

Technical analysis: ${i.technicalAnalysis}

Ruling: ${i.ruling}

Violated UAOP articles: ${i.violatedArticles.join(", ")}

Lessons learned:
${i.lessonsLearned.map((l) => `- ${l}`).join("\n")}`,
).join("\n\n---\n\n")}

================================================================
PART IV — THREAT INTELLIGENCE
================================================================

${THREATS.map(
  (t) =>
    `### ${t.id}: ${t.title} (${t.severity}, CVSS ${t.cvss})

${t.summary}

Pattern: ${t.pattern}

Mitigations:
${t.mitigations.map((m) => `- ${m}`).join("\n")}`,
).join("\n\n---\n\n")}

================================================================
PART V — REGULATION MATRIX
================================================================

${REGULATIONS.map(
  (r) =>
    `### ${r.title} (${r.jurisdiction}, effective ${r.effectiveDate})

${r.summary}

Requirements:
${r.requirements.map((req) => `- [${req.severity}] ${req.requirement}${req.deadline ? ` (deadline ${req.deadline})` : ""}`).join("\n")}`,
).join("\n\n---\n\n")}

================================================================
PART VI — GLOSSARY
================================================================

${GLOSSARY.map((t) => `### ${t.term}\n${t.definition}`).join("\n\n")}

================================================================
PART VII — EDITORIAL GUIDES (excerpts)
================================================================

${ARTICLES.map(
  (a) =>
    `### ${a.title}

${a.directAnswer}

Key claims:
${a.keyClaims.map((c) => `- ${c}`).join("\n")}`,
).join("\n\n---\n\n")}
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
