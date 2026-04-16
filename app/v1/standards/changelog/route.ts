import { apiJson } from "@/lib/utils";

export const dynamic = "force-static";

export async function GET() {
  return apiJson({
    versions: [
      {
        version: "1.0.1",
        kind: "PATCH",
        publishedAt: "2026-04-10",
        summary: "Editorial corrections to Articles 3 and 4 commentary; no substantive change.",
        approvedBy: "Editorial team; board notified",
        diffUrl: "/v1/standards/diff/1.0.0...1.0.1",
      },
      {
        version: "1.0.0",
        kind: "MAJOR",
        publishedAt: "2026-01-15",
        summary:
          "Inaugural publication of UAOP v1.0 with seven articles: Honest Representation, Scope Adherence, Conflict Escalation, Irreversibility Caution, Resource Etiquette, Disclosure, Data Minimization. Co-signed by three AI safety researchers.",
        approvedBy: "Founding board — 9/9 approval",
        diffUrl: null,
      },
    ],
    conductCodes: [
      {
        id: "finance-1.1.0",
        publishedAt: "2026-03-28",
        kind: "MINOR",
        summary: "Finance Conduct Code v1.1.0 — elevate operator position caps to irreversibility treatment. Triggered by MINC-2026-0027.",
      },
      {
        id: "finance-1.0.0",
        publishedAt: "2026-01-30",
        kind: "MAJOR",
        summary: "Finance Conduct Code v1.0.0 published as first domain code under UAOP v1.0.",
      },
    ],
  });
}
