import { Router } from "express";
import { runDailyScrape } from "../../jobs/runScrape.js";

export const adminRouter = Router();

adminRouter.post("/scrape", async (_req, res) => {
  try {
    const result = await runDailyScrape(new Date());
    return res.json({
      message: "Scrape finished",
      imported: result.imported
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Scrape failed"
    });
  }
});
