import { Router } from "express";
import { prisma } from "../../config/db.js";

export const statusRouter = Router();

statusRouter.get("/", async (_req, res) => {
  const [lastLogs, eventCount] = await Promise.all([
    prisma.sourceLog.findMany({
      orderBy: { fetchedAt: "desc" },
      take: 10
    }),
    prisma.event.count()
  ]);

  return res.json({
    status: "ok",
    eventCount,
    lastLogs
  });
});
