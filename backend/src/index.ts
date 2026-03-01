import cors from "cors";
import express from "express";
import { prisma } from "./config/db.js";
import { env } from "./config/env.js";
import { adminRouter } from "./api/routes/admin.js";
import { eventsRouter } from "./api/routes/events.js";
import { servicesRouter } from "./api/routes/services.js";
import { sportsRouter } from "./api/routes/sports.js";
import { statusRouter } from "./api/routes/status.js";
import { startScheduler } from "./jobs/scheduler.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/events", eventsRouter);
app.use("/api/services", servicesRouter);
app.use("/api/sports", sportsRouter);
app.use("/api/status", statusRouter);
app.use("/admin", adminRouter);

app.listen(Number(env.PORT), () => {
  console.log(`Sports Hub backend running on port ${env.PORT}`);
  startScheduler();
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
