import cron from "node-cron";
import { env } from "../config/env.js";
import { runDailyScrape } from "./runScrape.js";

export function startScheduler(): void {
  const schedule = "0 6,12 * * *";
  cron.schedule(
    schedule,
    async () => {
      try {
        await runDailyScrape(new Date());
      } catch (error) {
        console.error("Scheduled scrape failed:", error);
      }
    },
    { timezone: env.SCRAPER_TIMEZONE }
  );
}
