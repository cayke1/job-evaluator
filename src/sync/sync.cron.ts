import cron from "node-cron";
import { config } from "../config";
import { syncJobs } from "./sync.service";

export function startSyncCron(): void {
  cron.schedule(config.syncCron, async () => {
    console.log(`[sync] Starting scheduled sync — ${new Date().toISOString()}`);
    try {
      const result = await syncJobs();
      console.log(`[sync] Done — created: ${result.created}, updated: ${result.updated}, skipped: ${result.skipped}`);
    } catch (err) {
      console.error("[sync] Failed:", err);
    }
  });

  console.log(`[sync] Cron scheduled: ${config.syncCron}`);
}
