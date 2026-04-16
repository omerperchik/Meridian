import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.author, url: SITE.url }],
  generator: "Next.js",
  keywords: [
    "AI agent standards",
    "AI agent trust score",
    "agent behavioral standard",
    "ATP trust protocol",
    "UAOP",
    "AI agent certification",
    "MCP security",
    "AI agent governance",
    "agent threat intelligence",
    "AI agent compliance",
    "AI agent incident report",
    "AI agent registry",
    "AI agent benchmarks",
    "LangChain security",
    "CrewAI trust",
    "AI safety",
  ],
  referrer: "origin-when-cross-origin",
  creator: SITE.author,
  publisher: SITE.author,
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: SITE.url,
    types: {
      "application/json": `${SITE.url}/v1/openapi.json`,
      "text/plain": `${SITE.url}/llms.txt`,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    locale: "en_US",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE.name} — ${SITE.tagline}` },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    creator: SITE.twitter,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  other: {
    "google-site-verification": "",
    "bing-site-verification": "",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#08090a" },
    { media: "(prefers-color-scheme: light)", color: "#08090a" },
  ],
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ldJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#org`,
        name: SITE.name,
        alternateName: SITE.author,
        url: SITE.url,
        logo: `${SITE.url}/logo.png`,
        description: SITE.description,
        foundingDate: SITE.foundingDate,
        sameAs: [
          `https://github.com/${SITE.github}`,
          `https://twitter.com/${SITE.twitter.replace("@", "")}`,
        ],
        knowsAbout: [
          "AI agent behavioral standards",
          "Agent trust scoring",
          "AI agent compliance",
          "Agent threat intelligence",
          "Agent incident reporting",
          "Model Context Protocol",
          "AI agent benchmarking",
          "AI agent governance",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        publisher: { "@id": `${SITE.url}/#org` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE.url}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="alternate" type="text/plain" title="Agent Conduct" href="/agent-conduct.txt" />
        <link rel="alternate" type="text/plain" title="LLM Summary" href="/llms.txt" />
        <link rel="alternate" type="text/plain" title="LLM Full Corpus" href="/llms-full.txt" />
        <link rel="alternate" type="application/json" title="Registry Index" href="/registry.json" />
        <link rel="alternate" type="application/json" title="Content Index" href="/content-index.json" />
        <link rel="alternate" type="application/json" title="Glossary" href="/glossary.json" />
        <link rel="alternate" type="application/json" title="OpenAPI v1" href="/v1/openapi.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
        />
      </head>
      <body className="antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-surface focus:text-text-primary focus:px-3 focus:py-1.5 focus:rounded-md focus:border focus:border-accent">
          Skip to content
        </a>
        <Nav />
        <main id="main" className="min-h-[60vh]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
