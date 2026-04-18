import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { DirectAnswer } from "@/components/ui/DirectAnswer";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { SITE } from "@/lib/site";
import { listEntities } from "@/data/registry";

export const metadata: Metadata = {
  title: "Embed Badges — Meridian",
  description:
    "Show your Meridian ATP trust score on your README, website, or pitch deck. Free SVG badges, live HTML widgets, and a React component. Works in GitHub, LinkedIn, Slack, and anywhere else.",
  alternates: { canonical: `${SITE.url}/badges` },
};

export default function Page() {
  // Pick a representative top-tier entity for the snippet examples
  const top = listEntities({})[0];
  const slug = top?.slug ?? "atlas-finance";
  const B = SITE.url; // base url

  const markdown = `[![Meridian ATP](${B}/badge/${slug}.svg)](${B}/directory/${slug})`;
  const markdownTier = `[![Meridian Tier](${B}/badge/${slug}/tier)](${B}/directory/${slug})`;
  const markdownPair = `[![Meridian ATP](${B}/badge/${slug}.svg)](${B}/directory/${slug}) [![Meridian Tier](${B}/badge/${slug}/tier)](${B}/directory/${slug})`;

  const htmlFull = `<a href="${B}/directory/${slug}" target="_blank" rel="noopener">
  <img src="${B}/badge/${slug}/full" alt="Meridian ATP · Tier ${top?.trust.tier ?? 2}" width="380" height="92" />
</a>`;

  const htmlIframe = `<iframe
  src="${B}/embed/${slug}"
  title="Meridian score for ${top?.name ?? slug}"
  width="380" height="92"
  loading="lazy"
  style="border:0;border-radius:10px;color-scheme:dark;"
  referrerpolicy="strict-origin-when-cross-origin">
</iframe>`;

  const react = `// npm install @meridian/badge
import { MeridianBadge } from "@meridian/badge";

export default function Footer() {
  return <MeridianBadge slug="${slug}" variant="full" />;
}`;

  const uaopMd = `![UAOP](${B}/badge/uaop/${SITE.constitutionVersion}.svg)`;
  const financeMd = `![Finance Conduct Code](${B}/badge/conduct/finance.svg)`;

  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow="Developers"
        title="Embed your Meridian badge"
        description="Show your trust score everywhere you show up. Free, live, CDN-cached SVG badges plus a React component and an iframe widget."
        breadcrumbs={[{ label: "Developers", href: "/developers" }, { label: "Badges" }]}
        meta={
          <>
            <Badge tone="success" dot>
              Live
            </Badge>
            <Badge>CDN-cached</Badge>
            <Badge>CORS enabled</Badge>
          </>
        }
        actions={<Button href={`/directory/${slug}`} variant="secondary" size="sm">View example entity</Button>}
      />

      <DirectAnswer>
        Any Meridian-registered entity automatically has badges at{" "}
        <code className="font-mono text-sm bg-surface-raised px-1.5 py-0.5 rounded">
          /badge/&lt;slug&gt;.svg
        </code>
        . The SVG badges are the shields.io-compatible format — drop them into any README. For websites with more
        room, the full composite badge (380×92) and the live HTML widget show the score ring, tier chip, and UAOP
        version. Everything is CDN-cached for 5 minutes and works from any origin.
      </DirectAnswer>

      {/* Live previews */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Preview</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardBody>
              <div className="eyebrow mb-3">Compact · score</div>
              <div className="bg-white p-4 rounded-md flex items-center gap-3">
                <img
                  src={`/badge/${slug}.svg`}
                  alt="Meridian ATP badge"
                  height={20}
                  width={140}
                  loading="lazy"
                />
                <img
                  src={`/badge/${slug}/tier`}
                  alt="Meridian tier badge"
                  height={20}
                  width={190}
                  loading="lazy"
                />
              </div>
              <div className="mt-3 text-xs text-text-tertiary font-mono">20px tall · shields.io format</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="eyebrow mb-3">Composite · full badge</div>
              <img
                src={`/badge/${slug}/full`}
                alt="Meridian full composite badge"
                width={380}
                height={92}
                loading="lazy"
                className="rounded-md"
              />
              <div className="mt-3 text-xs text-text-tertiary font-mono">380×92 · SVG · pitch-deck ready</div>
            </CardBody>
          </Card>
          <Card className="md:col-span-2">
            <CardBody>
              <div className="eyebrow mb-3">Live HTML widget (iframe-embeddable)</div>
              <iframe
                src={`/embed/${slug}`}
                title="Meridian live widget preview"
                width={380}
                height={92}
                style={{ border: 0, borderRadius: 10, colorScheme: "dark" }}
                loading="lazy"
              />
              <div className="mt-3 text-xs text-text-tertiary font-mono">380×92 · HTML · hoverable · linkable</div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Copy-paste snippets */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Drop it in</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">GitHub README / Markdown</h3>
            <CodeBlock lang="markdown" code={markdown} />
            <p className="text-xs text-text-tertiary mt-2">
              For both score + tier side-by-side:
            </p>
            <CodeBlock lang="markdown" code={markdownPair} className="mt-2" />
          </div>

          <div>
            <h3 className="font-semibold mb-2">HTML (website footer, about page)</h3>
            <CodeBlock lang="html" code={htmlFull} />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Live iframe widget</h3>
            <CodeBlock lang="html" code={htmlIframe} />
            <p className="text-xs text-text-tertiary mt-2">
              Pass <code className="font-mono bg-surface-raised px-1.5 py-0.5 rounded">?theme=light</code> to get
              the light variant.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">React component</h3>
            <CodeBlock lang="tsx" code={react} />
            <p className="text-xs text-text-tertiary mt-2">
              See the{" "}
              <a
                href="https://github.com/omerperchik/Meridian/tree/main/sdk/badge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-hover hover:text-text-primary underline"
              >
                @meridian/badge
              </a>{" "}
              package.
            </p>
          </div>
        </div>
      </section>

      {/* Other badge types */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Standards badges</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardBody>
              <div className="eyebrow mb-3">UAOP version</div>
              <div className="bg-white p-3 rounded-md inline-block mb-3">
                <img src={`/badge/uaop/${SITE.constitutionVersion}.svg`} alt="UAOP badge" height={20} />
              </div>
              <CodeBlock lang="markdown" code={uaopMd} />
              <p className="text-xs text-text-tertiary mt-2">
                Show which UAOP version your agent pins in its system prompt.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="eyebrow mb-3">Domain conduct code</div>
              <div className="bg-white p-3 rounded-md inline-block mb-3">
                <img src="/badge/conduct/finance.svg" alt="Finance Conduct Code badge" height={20} />
              </div>
              <CodeBlock lang="markdown" code={financeMd} />
              <p className="text-xs text-text-tertiary mt-2">
                Any conduct code ({"`finance`, `medical`, `legal`, ..."}) works.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Technical details */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Technical details</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <Card>
            <CardBody>
              <h3 className="font-semibold mb-1">Cache & freshness</h3>
              <p className="text-sm text-text-secondary">
                Badges are served with <code className="font-mono bg-surface-raised px-1 rounded">Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=86400</code>.
                Score changes propagate to downstream CDNs within 5 minutes.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h3 className="font-semibold mb-1">CORS & framing</h3>
              <p className="text-sm text-text-secondary">
                <code className="font-mono bg-surface-raised px-1 rounded">Access-Control-Allow-Origin: *</code> and{" "}
                <code className="font-mono bg-surface-raised px-1 rounded">frame-ancestors *</code>. Badges and the
                live widget work in any site, README, Slack, LinkedIn, or pitch-deck tool.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h3 className="font-semibold mb-1">Accessibility</h3>
              <p className="text-sm text-text-secondary">
                Every badge includes proper{" "}
                <code className="font-mono bg-surface-raised px-1 rounded">aria-label</code> and a{" "}
                <code className="font-mono bg-surface-raised px-1 rounded">&lt;title&gt;</code> element so screen
                readers announce the label and value.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h3 className="font-semibold mb-1">Cost</h3>
              <p className="text-sm text-text-secondary">
                Free. Always. No API key required for badges or the iframe widget. If you're on the Free API tier,
                badge traffic does not count toward your rate limit.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      <section>
        <Card>
          <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Not listed yet?</h2>
              <p className="text-sm text-text-secondary">
                Free Tier 0 listing within 4 hours. Tier 1 Claimed is also free.
              </p>
            </div>
            <div className="flex gap-2">
              <Button href="/get-listed">Get listed</Button>
              <Button href="/scanner" variant="secondary">
                <Icon name="zap" size={13} /> Run scanner first
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
