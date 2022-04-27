import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("3000"),
  MONGODB_URI: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("7d"),
  FRONTEND_URL: z.string().default("http://localhost:3001"),
});

const envResult = envSchema.safeParse(process.env);

if (!envResult.success) {
  console.error("Environment validation failed:", envResult.error.format());
  // Use defaults for production, throw error for development
  if (process.env.NODE_ENV === "production") {
    console.log("Using default values for missing environment variables");
  } else {
    throw new Error("Environment validation failed");
  }
}

export const envVars = envResult.success
  ? envResult.data
  : {
      NODE_ENV: "development",
      PORT: "3000",
      MONGODB_URI: "mongodb://localhost:27017/parcel-delivery",
      JWT_SECRET: "fallback-jwt-secret-change-in-production",
      JWT_EXPIRES_IN: "7d",
      FRONTEND_URL: "http://localhost:3001",
    };
