import { Router } from "express";
import { prisma } from "../../config/db.js";

export const servicesRouter = Router();

servicesRouter.get("/", async (_req, res) => {
  const services = await prisma.streamingService.findMany({
    orderBy: { name: "asc" }
  });
  return res.json({ total: services.length, services });
});
