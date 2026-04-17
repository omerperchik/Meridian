/**
 * Meridian MCP server — SSE transport.
 *
 * Implements the Model Context Protocol over Server-Sent Events:
 *   GET  /mcp/sse        — opens an SSE stream, emits session_id + sends messages
 *   POST /mcp/sse        — client posts JSON-RPC messages; responses are pushed via SSE
 *
 * This is a minimal, working implementation that speaks:
 *   initialize, notifications/initialized, tools/list, tools/call, ping
 */
import { TOOLS, callTool } from "@/lib/mcp-tools";

export const dynamic = "force-dynamic";

const SERVER_INFO = { name: "meridian", version: "2.0.0" };
const PROTOCOL_VERSION = "2025-03-26";

// In-process session registry. One Node instance ⇒ fine for a single edge region
// and for self-hosted deployments. At scale we'd use Redis pub/sub.
interface Session {
  id: string;
  enqueue: (msg: unknown) => void;
  close: () => void;
}
const SESSIONS: Map<string, Session> = (globalThis as any).__meridian_mcp_sessions ??= new Map();

function jsonResult(id: number | string | null, result: unknown) {
  return { jsonrpc: "2.0", id, result };
}
function jsonError(id: number | string | null, code: number, message: string) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

// ──────────────────────────────────────────────────────────
// GET — open SSE stream
// ──────────────────────────────────────────────────────────
export async function GET() {
  const sessionId = `mcp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const enqueue = (msg: unknown) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(msg)}\n\n`));
        } catch {
          /* closed */
        }
      };
      const close = () => {
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };
      SESSIONS.set(sessionId, { id: sessionId, enqueue, close });

      // First event: session id + the POST endpoint for the client to use.
      enqueue({ type: "session", sessionId, endpoint: `/mcp/sse?session=${sessionId}` });

      // Heartbeat
      const hb = setInterval(() => enqueue({ type: "ping", ts: Date.now() }), 20_000);
      // Cleanup on stream cancel
      (controller as any)._onClose = () => {
        clearInterval(hb);
        SESSIONS.delete(sessionId);
      };
    },
    cancel() {
      SESSIONS.delete(sessionId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      "Meridian-Session": sessionId,
    },
  });
}

// ──────────────────────────────────────────────────────────
// POST — JSON-RPC message intake (handled synchronously; response in HTTP body)
// ──────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session");
  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify(jsonError(null, -32700, "parse error")), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const handle = async (msg: any) => {
    const id = msg?.id ?? null;
    const method = String(msg?.method ?? "");
    const params = msg?.params ?? {};
    try {
      switch (method) {
        case "initialize":
          return jsonResult(id, {
            protocolVersion: PROTOCOL_VERSION,
            capabilities: { tools: {} },
            serverInfo: SERVER_INFO,
          });
        case "notifications/initialized":
          return null; // notification — no response
        case "ping":
          return jsonResult(id, {});
        case "tools/list":
          return jsonResult(id, { tools: TOOLS });
        case "tools/call": {
          const name = params.name;
          const args = params.arguments ?? {};
          const out = await callTool(name, args);
          return jsonResult(id, {
            content: [{ type: "text", text: JSON.stringify(out, null, 2) }],
            isError: Boolean((out as any)?.error),
          });
        }
        default:
          return jsonError(id, -32601, `method not found: ${method}`);
      }
    } catch (err: any) {
      return jsonError(id, -32603, err?.message ?? "internal error");
    }
  };

  const messages = Array.isArray(body) ? body : [body];
  const responses = (await Promise.all(messages.map(handle))).filter(Boolean);

  // If the client is in SSE mode and gave us a session, push responses there.
  if (sessionId && SESSIONS.has(sessionId)) {
    for (const r of responses) SESSIONS.get(sessionId)!.enqueue(r);
    return new Response(JSON.stringify({ ok: true, pushed: responses.length }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Fallback: direct request/response for clients that don't use SSE.
  const payload = Array.isArray(body) ? responses : responses[0] ?? null;
  return new Response(JSON.stringify(payload), {
    headers: { "Content-Type": "application/json" },
  });
}
