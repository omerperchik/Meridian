import { apiJson } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ scan_id: string }> }) {
  const { scan_id } = await params;
  // Deterministic seed from scan_id — stable demo output.
  const seed = [...scan_id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const score = 55 + (seed % 30);
  return apiJson({
    scan_id,
    status: "complete",
    estimated_score: score,
    disclaimer: "Estimated — not verified by Meridian. Submit for Tier 1+ review to appear in the registry.",
    dimensions: {
      security: {
        score: 60 + (seed % 25),
        pass: ["No hardcoded credentials detected.", "Pinned dependencies."],
        warn: ["No explicit UAOP Article 7 statement in the system prompt."],
        fail: [],
      },
      compliance: {
        score: 55 + (seed % 28),
        pass: ["UAOP Article 2 scope statement present."],
        warn: ["Article 6 disclosure is in prompt text rather than compiled-in runtime."],
        fail: ["Article 3 (Conflict Escalation) not referenced."],
      },
      affordability: {
        score: 60 + (seed % 22),
        pass: ["Context window usage under median for category."],
        warn: ["Token budget per task slightly above category median."],
        fail: [],
      },
    },
    priority_improvements: [
      { item: "Add UAOP Article 3 (Conflict Escalation) handler.", impact: "+6 estimated points" },
      { item: "Compile disclosure into runtime behavior.", impact: "+3 estimated points" },
      { item: "Document irreversible actions per Article 4.", impact: "+2 estimated points" },
    ],
    submit_url: "/get-listed?from=scanner",
  });
}
