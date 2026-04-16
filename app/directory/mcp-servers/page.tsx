import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { EntityList } from "@/components/layout/EntityList";
import { listEntities } from "@/data/registry";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "MCP Servers · Directory",
  description:
    "Every registered Model Context Protocol server, ranked by ATP score with permission-scope and injection-resistance breakdowns.",
  alternates: { canonical: `${SITE.url}/directory/mcp-servers` },
};

export default function Page() {
  const entities = listEntities({ type: "mcp" });
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Directory"
        title="MCP Servers"
        description={`${entities.length} registered MCP servers, ranked by permission safety and injection resistance.`}
        breadcrumbs={[{ label: "Directory", href: "/directory" }, { label: "MCP Servers" }]}
      />
      <EntityList entities={entities} />
    </div>
  );
}
