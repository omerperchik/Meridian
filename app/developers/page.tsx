import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Developers — API, SDK, MCP, machine-readable files",
  description: "Everything you need to build on Meridian: REST API v1, MCP server, SDK v2 (Python/TS/Go), static machine-readable files.",
  alternates: { canonical: `${SITE.url}/developers` },
};

export default function Page() {
  const surfaces = [
    { title: "REST API v1", desc: "OpenAPI 3.1. 30+ endpoints. Rate limits: 100/day free, 10k/day Pro, unlimited Enterprise.", href: "/developers/api", icon: "terminal" as const },
    { title: "MCP Server", desc: "mcp.meridian.ai/sse. 9 tools: lookup_trust_score, check_threats, find_agent, lookup_ruling, more.", href: "/developers/mcp", icon: "compass" as const },
    { title: "SDK v2.0", desc: "Python · TypeScript · Go. MIT. Telemetry middleware. /meridian/compliance endpoint.", href: "/developers/sdk", icon: "code" as const },
    { title: "Machine-readable files", desc: "agent-conduct.txt, llms.txt, llms-full.txt, registry.json, glossary.json.", href: "/developers/machine-files", icon: "globe" as const },
    { title: "Webhooks", desc: "Subscribe to score changes, new threats, incident filings, ruling publications.", href: "/developers/webhooks", icon: "activity" as const },
    { title: "Scanner API", desc: "POST /v1/scanner/lite — automate pre-submission checks in CI.", href: "/scanner", icon: "zap" as const },
  ];
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Pillar 9"
        title="Developer surfaces"
        description="Meridian is infrastructure, not a website that also has an API. Every human feature has a machine-callable equivalent."
        breadcrumbs={[{ label: "Developers" }]}
      />

      <div className="grid md:grid-cols-3 gap-4">
        {surfaces.map((s) => (
          <Card key={s.title} href={s.href} className="group">
            <CardBody>
              <div className="flex items-center gap-2 mb-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-accent-muted text-accent-hover">
                  <Icon name={s.icon} size={16} />
                </div>
                <h3 className="font-semibold">{s.title}</h3>
              </div>
              <p className="text-sm text-text-tertiary leading-relaxed">{s.desc}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs text-accent-hover group-hover:text-text-primary">
                Explore <Icon name="arrow-right" size={10} />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
