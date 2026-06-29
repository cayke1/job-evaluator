import { db } from "../db";
import { config } from "../config";

const API_URL = "https://api.vagasprajr.com.br/jobs/search";

const REMOTE_LOCATIONS = [
  "Remoto",
  "Remoto ou híbrido a consultar",
  "Trabalho remoto",
  "Brasil (Remoto)",
  "Brasil – Remoto",
  "Remoto - Brasil",
];

interface ApiJob {
  id: string;
  title: string;
  company_name: string;
  location: string;
  salary: string;
  url: string;
  job_details_url: string;
  provider: string;
  created_at: string;
  is_closed: boolean;
}

interface ApiResponse {
  Total: number;
  Page: number;
  PerPage: number;
  Data: ApiJob[];
}

async function fetchPage(page: number): Promise<ApiResponse> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "",
      company_name: "",
      location: "",
      salary: "",
      provider: "",
      page,
      pageSize: config.vagasprajr.pageSize,
      isBookmarkedOnly: false,
      job_filter_options: {
        companies: [],
        locations: REMOTE_LOCATIONS,
        salaries: [],
        providers: [],
      },
      is_ascending: false,
      sort: "created_at",
      ids: [],
    }),
  });

  if (!res.ok) {
    throw new Error(`VagasPraJR API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<ApiResponse>;
}

export async function syncJobs(): Promise<{ created: number; updated: number; skipped: number }> {
  let created = 0;
  let updated = 0;
  let skipped = 0;

  const firstPage = await fetchPage(1);
  const totalPages = Math.min(
    Math.ceil(firstPage.Total / config.vagasprajr.pageSize),
    config.vagasprajr.maxPages
  );

  const allPages = [firstPage];
  for (let page = 2; page <= totalPages; page++) {
    allPages.push(await fetchPage(page));
  }

  for (const page of allPages) {
    for (const job of page.Data) {
      if (job.is_closed) {
        skipped++;
        continue;
      }

      const exists = await db.job.findUnique({ where: { id: job.id }, select: { id: true } });

      await db.job.upsert({
        where: { id: job.id },
        create: {
          id: job.id,
          title: job.title,
          company: job.company_name,
          location: job.location,
          salary: job.salary || null,
          url: job.url,
          detailsUrl: job.job_details_url || null,
          provider: job.provider,
          postedAt: new Date(job.created_at),
        },
        update: {
          title: job.title,
          company: job.company_name,
          location: job.location,
          salary: job.salary || null,
          url: job.url,
          detailsUrl: job.job_details_url || null,
        },
      });

      if (exists) {
        updated++;
      } else {
        created++;
      }
    }
  }

  return { created, updated, skipped };
}
