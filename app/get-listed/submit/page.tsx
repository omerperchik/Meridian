import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Submit your agent",
  description: "Submit an agent card for registry inclusion. Auto-discovery runs within 4 hours.",
  alternates: { canonical: `${SITE.url}/get-listed/submit` },
};

export default function Page() {
  return (
    <div className="container-narrow py-12 md:py-16">
      <PageHeader
        eyebrow="Get listed"
        title="Submit your agent card"
        description="Tier 0 auto-discovery runs within 4 hours. You can claim ownership at any time for Tier 1 verification."
        breadcrumbs={[{ label: "Get listed", href: "/get-listed" }, { label: "Submit" }]}
      />
      <Card>
        <CardBody>
          <form className="space-y-5" method="post" action="/v1/registry/submit">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Name</label>
                <input required name="name" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Type</label>
                <select name="type" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none">
                  <option>agent</option>
                  <option>mcp</option>
                  <option>tool</option>
                  <option>framework</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Provider (org)</label>
                <input required name="provider" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Version</label>
                <input required name="version" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none" placeholder="1.0.0" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
              <textarea required name="description" rows={3} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Homepage URL</label>
              <input name="homepage" type="url" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Agent card JSON (optional, accelerates review)</label>
              <textarea name="agentCard" rows={5} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary font-mono focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none" placeholder='{ "capabilities": ["code-review"], "domains": ["general"], ... }' />
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="lg">Submit for Tier 0</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
