import { JobStatus } from "@prisma/client";
import { db } from "../db";

interface ListJobsParams {
  status?: JobStatus;
  page: number;
  limit: number;
}

export async function listJobs({ status, page, limit }: ListJobsParams) {
  const where = status ? { status } : {};
  const [data, total] = await Promise.all([
    db.job.findMany({
      where,
      orderBy: { postedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.job.count({ where }),
  ]);
  return { data, total, page, limit };
}

interface UpdateJobParams {
  id: string;
  status: "RECOMMENDED" | "IGNORED";
  score?: number;
  summary?: string;
  reason?: string;
  missingSkills?: string[];
}

export async function updateJob({ id, status, score, summary, reason, missingSkills }: UpdateJobParams) {
  const job = await db.job.findUnique({ where: { id } });
  if (!job) return null;

  const allowedTransitions: Record<JobStatus, JobStatus[]> = {
    NEW: ["RECOMMENDED", "IGNORED"],
    RECOMMENDED: ["IGNORED"],
    IGNORED: [],
    APPLIED: [],
  };

  if (!allowedTransitions[job.status].includes(status as JobStatus)) {
    throw new Error(`Cannot transition from ${job.status} to ${status}`);
  }

  return db.job.update({
    where: { id },
    data: {
      status,
      score,
      summary,
      reason,
      missingSkills: missingSkills ?? [],
      analyzedAt: new Date(),
    },
  });
}

export async function applyJob(id: string) {
  const job = await db.job.findUnique({ where: { id } });
  if (!job) return null;

  if (job.status !== "RECOMMENDED") {
    throw new Error(`Cannot apply to a job with status ${job.status}. Must be RECOMMENDED.`);
  }

  return db.job.update({
    where: { id },
    data: {
      status: "APPLIED",
      appliedAt: new Date(),
    },
    select: { id: true, status: true, appliedAt: true },
  });
}
