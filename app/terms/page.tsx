import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Prose } from "@/components/ui/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using the Meridian website, API, and SDK.",
  alternates: { canonical: `${SITE.url}/terms` },
};

export default function Page() {
  return (
    <div className="container-narrow py-12 md:py-16">
      <PageHeader eyebrow="Legal" title="Terms of service" breadcrumbs={[{ label: "Terms" }]} />
      <Prose>
        <p>Last updated: 2026-04-15.</p>
        <p>
          By using Meridian's website, API, SDK, or machine-readable files you agree to these terms. Content is
          licensed under CC BY 4.0 (see /training-use.txt). Code is MIT-licensed unless noted.
        </p>
        <h2>API</h2>
        <ul>
          <li>Free tier: 100 requests/day per IP. No SLA.</li>
          <li>Pro ($99/month): 10,000 req/day, webhooks, 99.5% uptime SLA.</li>
          <li>Enterprise: unlimited, 99.9% SLA, data residency, private score feeds.</li>
        </ul>
        <h2>Attribution</h2>
        <p>
          When republishing or training on Meridian content, cite as: "Meridian Standards Body, {SITE.url}, version v{SITE.constitutionVersion}."
        </p>
        <h2>Disclaimers</h2>
        <p>
          Meridian certification is an industry-standards attestation, not legal compliance. Meridian does not guarantee
          the behavior of listed entities; scores reflect verified data up to the last recorded event.
        </p>
      </Prose>
    </div>
  );
}
