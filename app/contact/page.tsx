import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Meridian team.",
  alternates: { canonical: `${SITE.url}/contact` },
};

export default function Page() {
  return (
    <div className="container-narrow py-12 md:py-16">
      <PageHeader eyebrow="Company" title="Contact" breadcrumbs={[{ label: "Contact" }]} />
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardBody>
            <h3 className="font-semibold mb-2">General inquiries</h3>
            <p className="text-sm text-text-secondary mb-2">
              <a href={`mailto:${SITE.email}`} className="text-accent-hover hover:text-text-primary">
                {SITE.email}
              </a>
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="font-semibold mb-2">Security</h3>
            <p className="text-sm text-text-secondary">Report a vulnerability: <a href="mailto:security@meridian.ai" className="text-accent-hover hover:text-text-primary">security@meridian.ai</a></p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="font-semibold mb-2">Press</h3>
            <p className="text-sm text-text-secondary"><a href="mailto:press@meridian.ai" className="text-accent-hover hover:text-text-primary">press@meridian.ai</a></p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="font-semibold mb-2">Enterprise</h3>
            <p className="text-sm text-text-secondary"><a href="mailto:enterprise@meridian.ai" className="text-accent-hover hover:text-text-primary">enterprise@meridian.ai</a></p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
