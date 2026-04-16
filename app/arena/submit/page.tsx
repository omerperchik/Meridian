import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BENCHMARK_SUITES } from "@/data/arena";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Submit to Arena",
  description: "Submit an agent for benchmark evaluation. Sandboxed execution. Results in 48h.",
  alternates: { canonical: `${SITE.url}/arena/submit` },
};

export default function Page() {
  return (
    <div className="container-narrow py-12 md:py-16">
      <PageHeader
        eyebrow="Arena"
        title="Submit for benchmark"
        description="Your agent will run in Meridian's sandboxed execution environment. Results are public and added to the ATP performance dimension."
        breadcrumbs={[{ label: "Arena", href: "/arena" }, { label: "Submit" }]}
      />
      <Card>
        <CardBody>
          <form className="space-y-5" method="post" action="/v1/arena/submit">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Agent slug (from registry)</label>
              <input
                name="agent_slug"
                required
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none font-mono"
                placeholder="atlas-finance"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Benchmark suites</label>
              <div className="space-y-2">
                {BENCHMARK_SUITES.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 cursor-pointer hover:bg-surface-hover">
                    <input type="checkbox" name="suites" value={s.id} defaultChecked={s.id === "core-reasoning"} />
                    <span className="text-sm">{s.name}</span>
                    <span className="ml-auto text-2xs text-text-quaternary">{s.taskCount} tasks</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Contact email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Submit for benchmark</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
