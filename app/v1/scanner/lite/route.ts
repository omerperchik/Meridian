import { apiJson, apiError } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * Stub: real scanner runs static analysis + CVE check + UAOP coverage on the submitted content.
 * In this build, we return a synthesized but structurally correct pre-flight report.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemPrompt, repoUrl, packageName, agentCard } = body || {};
    const id = `scan_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    return apiJson(
      {
        scan_id: id,
        status: "queued",
        estimated_ready_at: new Date(Date.now() + 90_000).toISOString(),
        submitted: { systemPrompt: !!systemPrompt, repoUrl: !!repoUrl, packageName: !!packageName, agentCard: !!agentCard },
        result_url: `/v1/scanner/results/${id}`,
      },
      { status: 202 },
    );
  } catch {
    return apiError("bad_request", "Invalid JSON body", 400);
  }
}
