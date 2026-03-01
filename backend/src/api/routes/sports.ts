import { Router } from "express";
import { prisma } from "../../config/db.js";

export const sportsRouter = Router();

sportsRouter.get("/", async (_req, res) => {
  const sports = await prisma.sport.findMany({
    orderBy: { name: "asc" }
  });
  return res.json({ total: sports.length, sports });
});
