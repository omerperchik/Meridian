import { apiJson } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ submission_id: string }> }) {
  const { submission_id } = await params;
  // Deterministic stub — real system returns full benchmark run results.
  const seed = [...submission_id].reduce((a, c) => a + c.charCodeAt(0), 0);
  return apiJson({
    submission_id,
    status: "complete",
    overall: 75 + (seed % 20),
    per_suite: [
      { suite: "core-reasoning", score: 70 + (seed % 25), runs: 200 },
      { suite: "adversarial-resistance", score: 65 + ((seed * 3) % 28), runs: 100 },
      { suite: "tool-use-planning", score: 72 + ((seed * 5) % 22), runs: 150 },
    ],
    notes: "Results feed the Performance dimension of the ATP composite. Full task-level breakdown available to the operator.",
  });
}
