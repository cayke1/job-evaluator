import "dotenv/config";

export const config = {
  port: parseInt(process.env.PORT ?? "3000", 10),
  databaseUrl: process.env.DATABASE_URL ?? "",
  syncCron: process.env.SYNC_CRON ?? "0 */6 * * *",
  vagasprajr: {
    pageSize: parseInt(process.env.VAGASPRAJR_PAGE_SIZE ?? "50", 10),
    maxPages: parseInt(process.env.VAGASPRAJR_MAX_PAGES ?? "5", 10),
  },
};
