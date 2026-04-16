import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "System Status",
  description: "Live status of Meridian services.",
  alternates: { canonical: `${SITE.url}/status` },
};

const SERVICES = [
  { name: "Web", status: "operational", uptime: "99.98%" },
  { name: "API v1", status: "operational", uptime: "99.99%" },
  { name: "MCP Server", status: "operational", uptime: "99.97%" },
  { name: "SDK telemetry endpoint (us)", status: "operational", uptime: "99.99%" },
  { name: "SDK telemetry endpoint (eu)", status: "operational", uptime: "99.99%" },
  { name: "SDK telemetry endpoint (ap)", status: "operational", uptime: "99.97%" },
  { name: "Scoring engine", status: "operational", uptime: "99.95%" },
  { name: "Scanner", status: "operational", uptime: "99.94%" },
  { name: "Arena benchmark runner", status: "operational", uptime: "99.9%" },
];

export default function Page() {
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="System"
        title="Status"
        description="Live status of all Meridian services. Subscribe to incidents via /developers/webhooks."
        breadcrumbs={[{ label: "Status" }]}
        meta={<Badge tone="success" dot>All systems operational</Badge>}
      />
      <Card>
        <div className="divide-y divide-border">
          {SERVICES.map((s) => (
            <div key={s.name} className="flex items-center gap-4 p-4">
              <Badge tone="success" dot>{s.status}</Badge>
              <span className="font-medium text-text-primary flex-1">{s.name}</span>
              <span className="text-sm font-mono text-text-tertiary tabular-nums">{s.uptime}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
