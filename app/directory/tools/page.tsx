import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { EntityList } from "@/components/layout/EntityList";
import { listEntities } from "@/data/registry";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tools & Libraries · Directory",
  description: "Every registered AI agent tool or library — LangChain, LlamaIndex, Pydantic AI, Semantic Kernel and more.",
  alternates: { canonical: `${SITE.url}/directory/tools` },
};

export default function Page() {
  const entities = listEntities({ type: "tool" });
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Directory"
        title="Tools & Libraries"
        description={`${entities.length} tools and libraries ranked by dependency security, API surface safety, maintenance health.`}
        breadcrumbs={[{ label: "Directory", href: "/directory" }, { label: "Tools" }]}
      />
      <EntityList entities={entities} />
    </div>
  );
}
