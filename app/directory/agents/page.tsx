import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { EntityList } from "@/components/layout/EntityList";
import { listEntities } from "@/data/registry";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Agents · Directory",
  description: "Every registered AI agent, ranked by ATP trust score. Filter by capability, domain, tier.",
  alternates: { canonical: `${SITE.url}/directory/agents` },
};

export default function Page() {
  const entities = listEntities({ type: "agent" });
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Directory"
        title="AI Agents"
        description={`${entities.length} registered agents, ranked by ATP composite score.`}
        breadcrumbs={[{ label: "Directory", href: "/directory" }, { label: "Agents" }]}
      />
      <EntityList entities={entities} />
    </div>
  );
}
