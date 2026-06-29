import { FastifyInstance, FastifyRequest } from "fastify";
import { JobStatus } from "@prisma/client";
import { applyJob, listJobs, updateJob } from "./jobs.service";
import { applyJobSchema, listJobsSchema, syncSchema, updateJobSchema } from "./jobs.schema";
import { syncJobs } from "../sync/sync.service";
import { db } from "../db";

interface ListQuery {
  status?: JobStatus;
  page: number;
  limit: number;
}

interface JobParams {
  id: string;
}

interface UpdateBody {
  status: "RECOMMENDED" | "IGNORED";
  score?: number;
  summary?: string;
  reason?: string;
  missingSkills?: string[];
}

export async function jobsRouter(app: FastifyInstance) {
  app.get<{ Querystring: ListQuery }>(
    "/jobs",
    { schema: listJobsSchema },
    async (req) => {
      return listJobs(req.query);
    }
  );

  app.patch<{ Params: JobParams; Body: UpdateBody }>(
    "/jobs/:id",
    { schema: updateJobSchema },
    async (req, reply) => {
      try {
        const job = await updateJob({ id: req.params.id, ...req.body });
        if (!job) return reply.status(404).send({ error: "Job not found" });
        return job;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return reply.status(400).send({ error: message });
      }
    }
  );

  app.post<{ Params: JobParams }>(
    "/jobs/:id/apply",
    { schema: applyJobSchema },
    async (req, reply) => {
      try {
        const result = await applyJob(req.params.id);
        if (!result) return reply.status(404).send({ error: "Job not found" });
        return result;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return reply.status(409).send({ error: message });
      }
    }
  );

  app.post("/sync", { schema: syncSchema }, async (_req, reply) => {
    try {
      return await syncJobs();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return reply.status(502).send({ error: message });
    }
  });

  app.get("/health", async () => {
    try {
      await db.$queryRaw`SELECT 1`;
      return { status: "ok", db: "connected" };
    } catch {
      return { status: "degraded", db: "disconnected" };
    }
  });
}
