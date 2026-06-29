import { buildApp } from "./app";
import { config } from "./config";
import { startSyncCron } from "./sync/sync.cron";
import { db } from "./db";

async function main() {
  const app = buildApp();

  try {
    await app.listen({ port: config.port, host: "0.0.0.0" });
    startSyncCron();
  } catch (err) {
    app.log.error(err);
    await db.$disconnect();
    process.exit(1);
  }
}

main();
