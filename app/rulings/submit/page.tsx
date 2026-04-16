import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Submit a ruling scenario",
  description: "Submit a contested behavioral scenario for consideration as a Weekly Ruling.",
  alternates: { canonical: `${SITE.url}/rulings/submit` },
};

export default function Page() {
  return (
    <div className="container-narrow py-12 md:py-16">
      <PageHeader
        eyebrow="Rulings"
        title="Submit a scenario"
        description="Editorial team curates weekly — we look for scenarios that generalize beyond the specific case and touch unresolved standard questions."
        breadcrumbs={[{ label: "Rulings", href: "/rulings" }, { label: "Submit" }]}
      />
      <Card>
        <CardBody>
          <form className="space-y-5" method="post" action="/v1/rulings/submissions">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Title</label>
              <input
                name="title"
                required
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
                placeholder="One-sentence title describing the behavioral tension"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Scenario (100–250 words)</label>
              <textarea
                name="scenario"
                rows={6}
                required
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
                placeholder="Describe a specific, realistic situation. Strip identifying details."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Why this matters</label>
              <textarea
                name="rationale"
                rows={3}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
                placeholder="Why is this scenario generalizable? Which UAOP articles feel unresolved?"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Submit scenario</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
