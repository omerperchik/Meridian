import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Prose } from "@/components/ui/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Meridian",
  description: "A meridian is the reference line from which all positions are measured. Meridian is the agreed-upon reference from which all agent behavior, trust, and capability is measured.",
  alternates: { canonical: `${SITE.url}/about` },
};

export default function Page() {
  return (
    <div className="container-narrow py-12 md:py-16">
      <PageHeader eyebrow="Company" title="About Meridian" breadcrumbs={[{ label: "About" }]} />
      <Prose>
        <p>
          A meridian is the reference line from which all positions are measured. The prime meridian does not declare
          itself the most important place — it serves as the agreed-upon standard reference from which all navigation
          is calculated.
        </p>
        <p>
          Meridian is the agreed-upon reference from which all agent behavior, trust, and capability is measured.
          We publish the Agent Constitution, operate the Agent Trust Protocol, maintain the public Incident Docket,
          and host the Ranked Directory. We do not build agents. We do not compete with frameworks. We maintain
          the neutral layer the agentic economy runs on.
        </p>
        <h2>What we believe</h2>
        <p>
          Agents are moving from isolated assistants to networked autonomous actors that take consequential action.
          The infrastructure to govern this ecosystem — behavioral standards, trust signals, threat intelligence,
          public incident records, and authoritative educational content — does not yet exist at the neutral,
          cross-vendor layer. We build that layer.
        </p>
        <h2>How we fund it</h2>
        <p>
          API access tiers (free, Pro, Enterprise), paid premium reviews, certification fees, enterprise licensing,
          Arena sponsorships, and training-data licensing. The free tier is and remains free. Our board seat structure
          prevents any single actor from capturing the standards.
        </p>
        <h2>Contact</h2>
        <p>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> · <a href="https://github.com/omerperchik/Meridian">GitHub</a>
        </p>
      </Prose>
    </div>
  );
}
