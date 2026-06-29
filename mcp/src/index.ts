import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { z } from "zod";

const BASE_URL = process.env.JOB_EVALUATOR_URL;
if (!BASE_URL) throw new Error("JOB_EVALUATOR_URL env var is required");

function buildMcpServer(): McpServer {
  const mcp = new McpServer({ name: "job-evaluator", version: "1.0.0" });

  mcp.tool(
    "list_jobs",
    "List job postings from the job-evaluator API. Filter by status (NEW, RECOMMENDED, IGNORED, APPLIED) and paginate with page/limit.",
    {
      status: z.enum(["NEW", "RECOMMENDED", "IGNORED", "APPLIED"]).optional(),
      page: z.number().int().min(1).optional(),
      limit: z.number().int().min(1).max(100).optional(),
    },
    async ({ status, page, limit }) => {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (page) params.set("page", String(page));
      if (limit) params.set("limit", String(limit));
      const res = await fetch(`${BASE_URL}/jobs?${params}`);
      const data = await res.json();
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  mcp.tool(
    "update_job",
    "Evaluate a job posting. Set status to RECOMMENDED or IGNORED. Optionally provide a score (0-100), summary of the role, reason for the decision, and list of missing skills.",
    {
      id: z.string().describe("Job ID"),
      status: z.enum(["RECOMMENDED", "IGNORED"]),
      score: z.number().int().min(0).max(100).optional(),
      summary: z.string().optional(),
      reason: z.string().optional(),
      missingSkills: z.array(z.string()).optional(),
    },
    async ({ id, ...body }) => {
      const res = await fetch(`${BASE_URL}/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  mcp.tool(
    "apply_job",
    "Mark a job as APPLIED. Use this after deciding to apply to a RECOMMENDED job.",
    {
      id: z.string().describe("Job ID"),
    },
    async ({ id }) => {
      const res = await fetch(`${BASE_URL}/jobs/${id}/apply`, { method: "POST" });
      const data = await res.json();
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  mcp.tool(
    "sync_jobs",
    "Trigger a manual sync of job listings from the VagasPraJR external API. Returns counts of created, updated, and skipped jobs.",
    {},
    async () => {
      const res = await fetch(`${BASE_URL}/sync`, { method: "POST" });
      const data = await res.json();
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  mcp.tool(
    "health_check",
    "Check the health of the job-evaluator API and its database connection.",
    {},
    async () => {
      const res = await fetch(`${BASE_URL}/health`);
      const data = await res.json();
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  return mcp;
}

async function handleMcp(req: IncomingMessage, res: ServerResponse) {
  const chunks: Buffer[] = [];
  req.on("data", (chunk) => chunks.push(chunk));
  await new Promise<void>((resolve) => req.on("end", resolve));

  const rawBody = Buffer.concat(chunks).toString();
  const body = rawBody ? JSON.parse(rawBody) : undefined;

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless — new instance per request
  });
  const mcp = buildMcpServer();
  await mcp.connect(transport);
  await transport.handleRequest(req, res, body);
}

const port = process.env.PORT ?? 3001;

createServer((req, res) => {
  const url = req.url ?? "";
  const method = req.method ?? "";

  if (url === "/mcp" && ["GET", "POST", "DELETE"].includes(method)) {
    handleMcp(req, res).catch((err) => {
      console.error("MCP handler error:", err);
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: String(err) }));
      }
    });
  } else if (url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(port, () => {
  console.log(`job-evaluator MCP server listening on port ${port}`);
});
