import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("3000"),
  MONGODB_URI: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("7d"),
  FRONTEND_URL: z.string().default("http://localhost:3001")
});

const envResult = envSchema.safeParse(process.env);

if (!envResult.success) {
  console.error("Environment validation failed:", envResult.error.format());
  process.exit(1);
}

export const envVars = envResult.data;