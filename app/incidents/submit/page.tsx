import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Submit an incident report",
  description: "File an incident against an agent or tool. 21-day investigation workflow.",
  alternates: { canonical: `${SITE.url}/incidents/submit` },
};

export default function Page() {
  return (
    <div className="container-narrow py-12 md:py-16">
      <PageHeader
        eyebrow="Incidents"
        title="Submit an incident report"
        description="Every filing is triaged within 24 hours by the editorial team. Severity assigned within 72 hours. Full workflow takes 21 days."
        breadcrumbs={[{ label: "Incidents", href: "/incidents" }, { label: "Submit" }]}
      />

      <Card>
        <CardBody>
          <form className="space-y-5" method="post" action="/v1/incidents">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Title</label>
              <input
                name="title"
                required
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-quaternary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
                placeholder="One-sentence summary of the failure"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Priority</label>
                <select
                  name="priority"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
                >
                  <option>P0 — Immediate harm</option>
                  <option>P1 — Significant harm or near miss</option>
                  <option>P2 — Material failure</option>
                  <option>P3 — Procedural violation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Type</label>
                <select
                  name="type"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
                >
                  <option>misrepresentation</option>
                  <option>unauthorized-action</option>
                  <option>data-breach</option>
                  <option>coordination-failure</option>
                  <option>safety-violation</option>
                  <option>deception</option>
                  <option>availability-failure</option>
                  <option>other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Date occurred</label>
                <input
                  type="date"
                  name="occurred"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
              <textarea
                name="description"
                rows={6}
                required
                minLength={200}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-quaternary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
                placeholder="At least 200 words. Plain-language narrative. What the agent did, what it should have done."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Reporter (required, kept confidential)</label>
              <input
                name="reporter"
                type="email"
                required
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-quaternary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
                placeholder="you@company.com"
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="anonymize" name="anonymize" defaultChecked />
              <label htmlFor="anonymize" className="text-sm text-text-secondary">
                Anonymize affected entity in the public record
              </label>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-text-tertiary flex items-center gap-2">
                <Badge tone="info">Editor review</Badge>
                21-day workflow · P0/P1 go to the full board
              </div>
              <Button type="submit">Submit report</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
