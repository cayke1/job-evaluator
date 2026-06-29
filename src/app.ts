import Fastify from "fastify";
import cors from "@fastify/cors";
import { jobsRouter } from "./jobs/jobs.router";

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(cors);
  app.register(jobsRouter);

  return app;
}
