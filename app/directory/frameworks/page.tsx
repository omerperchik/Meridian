import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { EntityList } from "@/components/layout/EntityList";
import { listEntities } from "@/data/registry";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Frameworks · Directory",
  description:
    "Every registered agent framework — LangChain, LangGraph, CrewAI, AutoGen, Haystack — ranked on security defaults, multi-agent handling, governance, community health.",
  alternates: { canonical: `${SITE.url}/directory/frameworks` },
};

export default function Page() {
  const entities = listEntities({ type: "framework" });
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Directory"
        title="Frameworks"
        description={`${entities.length} frameworks ranked on security defaults, multi-agent handling, governance, community health.`}
        breadcrumbs={[{ label: "Directory", href: "/directory" }, { label: "Frameworks" }]}
      />
      <EntityList entities={entities} />
    </div>
  );
}
