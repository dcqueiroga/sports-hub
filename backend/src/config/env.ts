import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string().url(),
  SCRAPER_TIMEZONE: z.string().default("America/Sao_Paulo")
});

export const env = envSchema.parse(process.env);
