import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Machine-Readable Files",
  description: "Static, crawl-friendly, no-API-key-required files served from the Meridian domain root.",
  alternates: { canonical: `${SITE.url}/developers/machine-files` },
};

const FILES = [
  { path: "/agent-conduct.txt", contents: "UAOP summary, conduct code index, API pointers", use: "Agent startup behavioral context — no API key required" },
  { path: "/llms.txt", contents: "4,000-token LLM-optimized standards summary", use: "System prompt injection; training corpus" },
  { path: "/llms-full.txt", contents: "Complete corpus: standards, guides, rulings, incidents", use: "Large-context agents; training source" },
  { path: "/agent-threats.txt", contents: "Daily snapshot of active Critical/High threats", use: "Agent security pre-check at startup" },
  { path: "/registry.json", contents: "Public index of Tier-1+ agents", use: "Programmatic discovery without API key" },
  { path: "/content-index.json", contents: "Index of all content: slug, title, Direct Answer", use: "Building agent knowledge bases on top of Meridian" },
  { path: "/glossary.json", contents: "All glossary terms with canonical definitions", use: "Domain-specific context injection" },
  { path: "/v1/openapi.json", contents: "Full OpenAPI 3.1 spec", use: "SDK generation, API exploration" },
  { path: "/training-use.txt", contents: "CC BY 4.0 license + training-use invitation", use: "Training corpus eligibility signaling" },
];

export default function Page() {
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Developers"
        title="Machine-readable files"
        description="Static, crawl-friendly, no-API-key-required. Served from domain root. CDN-cached for fast parses at agent startup."
        breadcrumbs={[{ label: "Developers", href: "/developers" }, { label: "Machine files" }]}
      />

      <Card>
        <div className="divide-y divide-border">
          {FILES.map((f) => (
            <div key={f.path} className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <a href={f.path} className="font-mono text-sm text-accent-hover hover:text-text-primary">
                  {f.path}
                </a>
                <Badge>{f.path.endsWith(".json") ? "JSON" : "TXT"}</Badge>
              </div>
              <div className="text-sm text-text-secondary mb-1">{f.contents}</div>
              <div className="text-xs text-text-tertiary">Use: {f.use}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
