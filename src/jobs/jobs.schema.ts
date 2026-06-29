import { FastifySchema } from "fastify";

const jobShape = {
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    company: { type: "string" },
    location: { type: "string" },
    salary: { type: ["string", "null"] },
    url: { type: "string" },
    detailsUrl: { type: ["string", "null"] },
    provider: { type: "string" },
    status: { type: "string", enum: ["NEW", "RECOMMENDED", "IGNORED", "APPLIED"] },
    score: { type: ["integer", "null"] },
    summary: { type: ["string", "null"] },
    reason: { type: ["string", "null"] },
    missingSkills: { type: "array", items: { type: "string" } },
    postedAt: { type: "string" },
    syncedAt: { type: "string" },
    analyzedAt: { type: ["string", "null"] },
    appliedAt: { type: ["string", "null"] },
  },
} as const;

export const listJobsSchema: FastifySchema = {
  querystring: {
    type: "object",
    properties: {
      status: { type: "string", enum: ["NEW", "RECOMMENDED", "IGNORED", "APPLIED"] },
      page: { type: "integer", minimum: 1, default: 1 },
      limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: { type: "array", items: jobShape },
        total: { type: "integer" },
        page: { type: "integer" },
        limit: { type: "integer" },
      },
    },
  },
};

export const updateJobSchema: FastifySchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: { id: { type: "string" } },
  },
  body: {
    type: "object",
    required: ["status"],
    properties: {
      status: { type: "string", enum: ["RECOMMENDED", "IGNORED"] },
      score: { type: "integer", minimum: 0, maximum: 100 },
      summary: { type: "string" },
      reason: { type: "string" },
      missingSkills: { type: "array", items: { type: "string" } },
    },
  },
  response: { 200: jobShape },
};

export const applyJobSchema: FastifySchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: { id: { type: "string" } },
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "string" },
        status: { type: "string" },
        appliedAt: { type: ["string", "null"] },
      },
    },
  },
};

export const syncSchema: FastifySchema = {
  response: {
    200: {
      type: "object",
      properties: {
        created: { type: "integer" },
        updated: { type: "integer" },
        skipped: { type: "integer" },
      },
    },
  },
};
