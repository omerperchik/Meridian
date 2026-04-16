import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Agent Scanner — Free pre-flight check",
  description:
    "Free self-service scanner. Paste your system prompt, GitHub repo, or agent card — get an estimated ATP score and a priority improvement list in 90 seconds.",
  alternates: { canonical: `${SITE.url}/scanner` },
};

export default function Page() {
  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Pillar 8"
        title="Agent Scanner"
        description="Free pre-flight check before submitting to the registry. Paste your system prompt or repo; get an estimated score and a priority improvement list in 90 seconds."
        breadcrumbs={[{ label: "Scanner" }]}
        meta={<Badge tone="success" dot>Free · No account required</Badge>}
      />

      <DirectAnswer>
        The Meridian Scanner analyzes your system prompt, agent card, and dependencies for UAOP coverage, CVE exposure,
        permission scope issues, disclosure gaps, and cost efficiency. Results are labeled clearly as "estimated"
        until you submit for Tier 1+ review. The lite scanner is free and produces results in under 90 seconds.
      </DirectAnswer>

      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        <Card>
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-4">Run a scan</h2>
            <form className="space-y-4" method="post" action="/v1/scanner/lite">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">System prompt</label>
                <textarea
                  name="systemPrompt"
                  rows={8}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary font-mono focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
                  placeholder="Paste your agent's system prompt..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">GitHub repo URL (optional)</label>
                <input
                  name="repoUrl"
                  type="url"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
                  placeholder="https://github.com/you/agent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">npm / PyPI package name (optional)</label>
                <input
                  name="packageName"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
                  placeholder="@yourco/agent or yourco-agent"
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                <Icon name="zap" size={14} /> Run scan — 90s
              </Button>
            </form>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardBody>
              <h3 className="font-semibold mb-2">What we analyze</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex gap-2"><Icon name="check" size={14} className="text-success mt-0.5 shrink-0" /> UAOP coverage — which of 7 principles are present</li>
                <li className="flex gap-2"><Icon name="check" size={14} className="text-success mt-0.5 shrink-0" /> CVE scan on declared dependencies (OSV database)</li>
                <li className="flex gap-2"><Icon name="check" size={14} className="text-success mt-0.5 shrink-0" /> Permission scope — over-permissioned patterns</li>
                <li className="flex gap-2"><Icon name="check" size={14} className="text-success mt-0.5 shrink-0" /> Disclosure language for Article 6</li>
                <li className="flex gap-2"><Icon name="check" size={14} className="text-success mt-0.5 shrink-0" /> Hardcoded credential / PII detection</li>
                <li className="flex gap-2"><Icon name="check" size={14} className="text-success mt-0.5 shrink-0" /> Cost-per-task estimate vs. category</li>
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h3 className="font-semibold mb-2">What you get</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>• Estimated ATP score (0–100) — clearly labeled as estimated</li>
                <li>• Pass / Warn / Fail list per dimension</li>
                <li>• Priority improvement list, ordered by score impact</li>
                <li>• One-click submit to the registry at Tier 0</li>
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h3 className="font-semibold mb-2">API access</h3>
              <pre className="rounded-md bg-surface-raised p-3 text-xs font-mono text-text-secondary overflow-x-auto">
                <code>POST /v1/scanner/lite{"\n"}Content-Type: application/json{"\n\n"}{"{"} "systemPrompt": "...", "repoUrl": "..." {"}"}</code>
              </pre>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
