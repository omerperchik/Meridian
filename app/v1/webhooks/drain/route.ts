/**
 * Drain pending webhook deliveries. Intended to be pinged on a cron (e.g., every 1m via GitHub Actions).
 * Protected by ADMIN_TOKEN to prevent abuse.
 */
import { drain } from "@/lib/webhooks";
import { apiError } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const token = process.env.ADMIN_TOKEN;
  if (!token || req.headers.get("x-admin-token") !== token) {
    return apiError("forbidden", "Invalid X-Admin-Token", 403);
  }
  const limit = Number(new URL(req.url).searchParams.get("limit") || 50);
  const report = await drain(Math.min(500, Math.max(1, limit)));
  return new Response(JSON.stringify(report), { headers: { "Content-Type": "application/json" } });
}
