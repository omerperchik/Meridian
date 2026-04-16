/**
 * Programmatic "best-of" category definitions. Used by:
 *   - /best-of (index)
 *   - /best-of/[category] (detail)
 *   - sitemap
 */
export const CATEGORIES = [
  { slug: "agents-for-finance", type: "agent", domain: "finance", label: "AI agents for finance", useCase: "regulated financial deployments" },
  { slug: "agents-for-medical", type: "agent", domain: "medical", label: "AI agents for medical", useCase: "HIPAA-aligned clinical workflows" },
  { slug: "agents-for-coding", type: "agent", domain: "general", capability: "code", label: "AI agents for coding", useCase: "code review and generation" },
  { slug: "agents-for-research", type: "agent", domain: "general", capability: "research", label: "AI agents for research", useCase: "deep research with citation grounding" },
  { slug: "mcp-servers-for-filesystem", type: "mcp", capability: "filesystem", label: "MCP servers for filesystem access", useCase: "sandboxed file operations" },
  { slug: "mcp-servers-for-browser", type: "mcp", capability: "web", label: "MCP servers for browser automation", useCase: "web scraping and navigation" },
  { slug: "mcp-servers-for-database", type: "mcp", capability: "sql", label: "MCP servers for databases", useCase: "row-level policy and audit" },
  { slug: "mcp-servers-for-memory", type: "mcp", capability: "memory", label: "MCP servers for long-term memory", useCase: "vector memory with PII redaction" },
  { slug: "frameworks-for-multi-agent", type: "framework", capability: "multi-agent", label: "Frameworks for multi-agent systems", useCase: "orchestrator/subagent architectures" },
  { slug: "frameworks-for-rag", type: "framework", capability: "rag", label: "Frameworks for RAG", useCase: "document-heavy retrieval pipelines" },
  { slug: "frameworks-for-state-machines", type: "framework", capability: "state", label: "Frameworks for stateful workflows", useCase: "durable, human-in-the-loop runs" },
  { slug: "tools-for-observability", type: "tool", capability: "tracing", label: "Tools for agent observability", useCase: "tracing, analytics, incident forensics" },
  { slug: "tools-for-structured-output", type: "tool", capability: "structured", label: "Tools for structured outputs", useCase: "typed schema validation" },
] as const;
