import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "SDK v2 — Python · TypeScript · Go",
  description:
    "The Meridian SDK — open source (MIT), zero cost, minimally invasive middleware. Reports behavioral signals to Meridian. No task content. No user data. Audit logs stay local.",
  alternates: { canonical: `${SITE.url}/developers/sdk` },
};

const MODULES = [
  { name: "Telemetry", func: "Aggregated runtime performance metrics — no task content, no user data.", reports: "Task count, success/failure rate, latency p50/p95, error types (anonymized)" },
  { name: "Compliance Monitor", func: "Checks declared compliance against observed runtime behavior — flags drift.", reports: "Compliance signal per UAOP article (triggered/not triggered), drift alerts" },
  { name: "Security Monitor", func: "Detects anomalous input patterns consistent with known attack vectors from Threat Feed.", reports: "Attack attempt category, anomaly flag, permission boundary events — no payload" },
  { name: "Audit Trail", func: "Generates local immutable cryptographically signed log of all tool actions — Meridian receives hash chain only.", reports: "Hash of each log entry (integrity verification only) — log stays local" },
  { name: "Compliance Endpoint", func: "Exposes /meridian/compliance that any agent can query for real-time status.", reports: "Status: certified/degraded/suspended; current ATP score; active violations" },
  { name: "Durability Monitor", func: "Tracks graceful degradation behavior under load and malformed inputs.", reports: "Graceful failure events, timeout handling patterns, fallback signals" },
  { name: "Cost Tracker", func: "Measures actual cost per task type — feeds the Affordability dimension with real data.", reports: "Aggregated token consumption per task category, latency-to-cost ratio" },
];

export default function Page() {
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Developers"
        title="Meridian SDK v2.0"
        description="Open source (MIT). Zero cost. Minimally invasive middleware. Ships in Python, TypeScript, and Go."
        breadcrumbs={[{ label: "Developers", href: "/developers" }, { label: "SDK" }]}
      />

      <DirectAnswer>
        The Meridian SDK is open source (MIT), zero cost, and minimally invasive. It adds a middleware layer that
        reports behavioral signals to Meridian — no task content, no user data, no user-level observation. Integrating
        the SDK unlocks Tier 3 certification (max ATP score 100). The compliance endpoint at /meridian/compliance lets
        any peer agent verify your status in real time.
      </DirectAnswer>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Install</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <Card>
            <CardBody>
              <Badge tone="info" className="mb-2">Python</Badge>
              <pre className="text-xs font-mono text-text-secondary"><code>pip install meridian-sdk</code></pre>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Badge tone="accent" className="mb-2">TypeScript</Badge>
              <pre className="text-xs font-mono text-text-secondary"><code>npm i @meridian/sdk</code></pre>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Badge tone="success" className="mb-2">Go</Badge>
              <pre className="text-xs font-mono text-text-secondary"><code>go get github.com/meridian-standards/sdk-go</code></pre>
            </CardBody>
          </Card>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Quickstart</h2>
        <Card>
          <CardBody>
            <pre className="text-sm font-mono text-text-secondary overflow-x-auto">
              <code>{`from meridian import Meridian

mer = Meridian(api_key="…", agent_id="agt-123")

@mer.instrument(uaop_version="1.0.0")
def handle_task(task):
    # Your agent logic.
    # Meridian wraps this call with:
    #   - telemetry (latency, success/failure)
    #   - compliance monitor (UAOP article checks)
    #   - security monitor (threat pattern detection)
    #   - cost tracker (token accounting)
    return result

# Expose compliance status to peer agents
mer.expose_compliance_endpoint(port=8080)
# GET http://localhost:8080/meridian/compliance ->
# { "status": "certified", "atp": 92, "uaop_version": "1.0.0", "violations": [] }`}</code>
            </pre>
          </CardBody>
        </Card>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Modules</h2>
        <div className="space-y-3">
          {MODULES.map((m) => (
            <Card key={m.name}>
              <CardBody>
                <h3 className="font-semibold mb-1">{m.name}</h3>
                <p className="text-sm text-text-secondary mb-2">{m.func}</p>
                <div className="text-xs text-text-tertiary">
                  <span className="font-medium text-text-secondary">Reports to Meridian:</span> {m.reports}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Privacy guarantees</h2>
        <ul className="space-y-2.5">
          {[
            "No task content ever transmitted — behavioral signals only.",
            "No user data transmitted — operates at tool level, never user level.",
            "Audit logs stay local — only hash chain transmitted for integrity verification.",
            "Full source code on GitHub — no obfuscated code, no binary blobs.",
            "GDPR and SOC 2 compliant by design; multi-region telemetry endpoint; operator chooses region.",
          ].map((p, i) => (
            <li key={i} className="flex gap-3 text-text-secondary">
              <Icon name="shield" size={14} className="text-success mt-1 shrink-0" />
              <span className="leading-relaxed">{p}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
