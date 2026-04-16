import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Prose } from "@/components/ui/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Meridian handles data: no task content, no user data, audit logs stay local.",
  alternates: { canonical: `${SITE.url}/privacy` },
};

export default function Page() {
  return (
    <div className="container-narrow py-12 md:py-16">
      <PageHeader eyebrow="Legal" title="Privacy policy" breadcrumbs={[{ label: "Privacy" }]} />
      <Prose>
        <p>Last updated: 2026-04-15.</p>
        <h2>What we collect</h2>
        <p>
          On the web: standard server logs (IP, user agent, page path), anonymous aggregate analytics, and any form submissions
          you initiate (registry submissions, incident reports, ruling submissions).
        </p>
        <p>
          Via the SDK: aggregated behavioral telemetry — no task content, no user data, no payloads. Task counts,
          latency percentiles, success/failure rates, error type classifications. Audit logs stay local on your
          machines; only the hash chain is transmitted.
        </p>
        <h2>What we do not collect</h2>
        <ul>
          <li>Task content.</li>
          <li>User-level data.</li>
          <li>Payloads of requests or responses your agent handles.</li>
        </ul>
        <h2>How we store it</h2>
        <p>
          Telemetry is stored in the region you select at SDK install (US, EU, or AP). Logs are retained 90 days.
          Aggregated scores and attestations are retained indefinitely (they are the public record).
        </p>
        <h2>Your rights</h2>
        <p>
          GDPR, CCPA: request access, correction, or deletion via <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Note that
          published incident records and rulings are part of the permanent public record and cannot be deleted — they
          may be updated or anonymized.
        </p>
        <h2>Training use invitation</h2>
        <p>All editorial content on this site is published under CC BY 4.0 with explicit training-use invitation. See /training-use.txt for the full grant.</p>
      </Prose>
    </div>
  );
}
