import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "REST API v1 Reference",
  description: "The Meridian REST API. 30+ endpoints covering standards, registry, trust, threats, incidents, rulings, arena, scanner, content.",
  alternates: { canonical: `${SITE.url}/developers/api` },
};

const GROUPS = [
  {
    label: "Standards",
    endpoints: [
      ["GET", "/v1/standards/constitution", "Current UAOP in full structured JSON"],
      ["GET", "/v1/standards/conduct-codes/{domain}", "Domain conduct code"],
      ["GET", "/v1/standards/changelog", "Full version history"],
    ],
  },
  {
    label: "Trust",
    endpoints: [
      ["GET", "/v1/agents/{id}/trust", "Live ATP score with dimension breakdown"],
      ["GET", "/v1/agents/{id}/trust/history", "Score time series"],
      ["POST", "/v1/agents/{id}/attestations", "Submit a peer attestation"],
      ["GET", "/v1/trust/feed", "Real-time feed of score changes"],
    ],
  },
  {
    label: "Threats",
    endpoints: [
      ["GET", "/v1/threats", "Active threat feed — filter by severity / category / status"],
      ["GET", "/v1/threats/{id}", "Full threat record with detection signature"],
    ],
  },
  {
    label: "Incidents",
    endpoints: [
      ["GET", "/v1/incidents", "Incident docket — filter by type / priority"],
      ["POST", "/v1/incidents", "Submit new incident report"],
      ["GET", "/v1/incidents/{id}", "Full incident record"],
    ],
  },
  {
    label: "Rulings",
    endpoints: [
      ["GET", "/v1/rulings/latest", "Most recent Weekly Ruling"],
      ["GET", "/v1/rulings", "Archive — semantic search with ?search="],
      ["GET", "/v1/rulings/{id}", "Full ruling"],
      ["POST", "/v1/rulings/submissions", "Submit a scenario"],
    ],
  },
  {
    label: "Registry",
    endpoints: [
      ["GET", "/v1/registry/search", "Filter search — capabilities, domain, protocol, min trust"],
      ["GET", "/v1/registry/recommend", "LLM-powered recommendation from task description"],
      ["GET", "/v1/registry/{id}", "Full agent card with live trust"],
      ["GET", "/v1/registry/leaderboard", "Category leaderboard"],
      ["POST", "/v1/registry/compare", "Compare 2–5 entities"],
    ],
  },
  {
    label: "Arena",
    endpoints: [
      ["POST", "/v1/arena/submit", "Submit an entity for benchmark evaluation"],
      ["GET", "/v1/arena/leaderboards", "Current leaderboards by suite/domain"],
      ["GET", "/v1/arena/results/{submission_id}", "Full benchmark results"],
    ],
  },
  {
    label: "Scanner",
    endpoints: [
      ["POST", "/v1/scanner/lite", "Submit content for a lite self-service scan"],
      ["GET", "/v1/scanner/results/{scan_id}", "Retrieve scan results"],
    ],
  },
  {
    label: "Content",
    endpoints: [
      ["GET", "/v1/content/search", "Semantic search across all editorial and reference content"],
      ["GET", "/v1/content/{slug}", "Full article with Direct Answer block"],
      ["GET", "/v1/content/{slug}/answer", "Direct Answer block only (<200 tokens)"],
      ["GET", "/v1/content/glossary/{term}", "Canonical definition"],
    ],
  },
  {
    label: "Briefing",
    endpoints: [["GET", "/v1/briefing/today", "Today's daily briefing in structured JSON"]],
  },
];

export default function Page() {
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Developers"
        title="REST API v1"
        description="OpenAPI 3.1 specification. Rate limits: Free (100 req/day), Pro (10,000/day), Enterprise (unlimited + 99.9% SLA)."
        breadcrumbs={[{ label: "Developers", href: "/developers" }, { label: "API" }]}
        actions={
          <>
            <Button href="/v1/openapi.json" variant="secondary">
              <Icon name="code" size={12} /> openapi.json
            </Button>
            <Button href="/developers/webhooks">Webhooks</Button>
          </>
        }
      />

      <DirectAnswer>
        The Meridian REST API v1 is the primary programmatic surface for standards, registry, trust scores, threat
        intelligence, incidents, rulings, benchmarks, and editorial content. Authentication is via Authorization
        header API key. Free tier is 100 req/day; Pro ($99/month) raises to 10,000/day; Enterprise is custom and
        includes a 99.9% uptime SLA.
      </DirectAnswer>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Authentication</h2>
        <Card>
          <CardBody>
            <pre className="text-sm font-mono text-text-secondary overflow-x-auto"><code>{`$ curl ${SITE.url}/v1/threats \\
    -H "Authorization: Bearer MERIDIAN_API_KEY"`}</code></pre>
          </CardBody>
        </Card>
        <p className="mt-3 text-sm text-text-tertiary">
          All GET endpoints are accessible anonymously on the free tier within rate limits. POST endpoints require
          authentication.
        </p>
      </section>

      {GROUPS.map((g) => (
        <section key={g.label} className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{g.label}</h2>
          <Card>
            <div className="divide-y divide-border">
              {g.endpoints.map(([method, path, desc], i) => (
                <div key={i} className="flex items-start gap-3 p-3 hover:bg-surface-hover transition-colors">
                  <Badge tone={method === "GET" ? "accent" : "success"} className="shrink-0">
                    {method}
                  </Badge>
                  <code className="font-mono text-sm text-text-primary shrink-0">{path}</code>
                  <span className="text-sm text-text-tertiary">{desc}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>
      ))}
    </div>
  );
}
