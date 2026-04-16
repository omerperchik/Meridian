import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Meridian MCP Server",
  description: "Meridian exposes all core functions as MCP tools. mcp.meridian.ai/sse. 9 tools compatible with any MCP-enabled agent framework.",
  alternates: { canonical: `${SITE.url}/developers/mcp` },
};

const TOOLS = [
  ["lookup_trust_score", "agent_id", "ATP score object with dimension breakdown"],
  ["check_threats", "task_description", "Relevant active threats for a given task type"],
  ["find_agent", "capabilities[], domain, min_trust, protocol", "Ranked list of matching agents"],
  ["lookup_ruling", "situation_description", "Semantically similar rulings from archive"],
  ["get_standard", "domain", "Applicable conduct code for a deployment domain"],
  ["search_guides", "query", "Top 3 relevant guides with Direct Answer blocks"],
  ["get_definition", "term", "Canonical glossary definition"],
  ["get_compliance_requirements", "entity_type, jurisdiction", "Structured regulation checklist"],
  ["check_compliance", "agent_id", "Real-time compliance status from SDK endpoint"],
];

export default function Page() {
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Developers"
        title="Meridian MCP Server"
        description="Meridian publishes an MCP server that exposes all core functions as callable tools. Compatible with any MCP-enabled agent framework."
        breadcrumbs={[{ label: "Developers", href: "/developers" }, { label: "MCP" }]}
        meta={<Badge tone="success" dot>Live at mcp.meridian.ai/sse</Badge>}
      />

      <DirectAnswer>
        The Meridian MCP Server is hosted at <code>mcp.meridian.ai/sse</code>. It exposes nine tools that wrap the
        most common Meridian API calls: lookup_trust_score, check_threats, find_agent, lookup_ruling, get_standard,
        search_guides, get_definition, get_compliance_requirements, and check_compliance. Compatible with Claude
        Desktop, Cursor, any MCP-aware framework.
      </DirectAnswer>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Add to your MCP config</h2>
        <Card>
          <CardBody>
            <pre className="text-sm font-mono text-text-secondary overflow-x-auto"><code>{`{
  "mcpServers": {
    "meridian": {
      "url": "https://mcp.meridian.ai/sse"
    }
  }
}`}</code></pre>
          </CardBody>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Available tools</h2>
        <Card>
          <div className="divide-y divide-border">
            {TOOLS.map(([name, args, result]) => (
              <div key={name} className="p-4 grid md:grid-cols-[1.2fr_2fr_1.6fr] gap-3 items-start">
                <code className="font-mono text-sm text-accent-hover">{name}</code>
                <div className="text-xs text-text-tertiary font-mono">{args}</div>
                <div className="text-sm text-text-secondary">{result}</div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
