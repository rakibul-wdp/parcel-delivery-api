"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: zod_1.z.string().default("3000"),
    MONGODB_URI: zod_1.z.string(),
    JWT_SECRET: zod_1.z.string(),
    JWT_EXPIRES_IN: zod_1.z.string().default("7d"),
    FRONTEND_URL: zod_1.z.string().default("http://localhost:3001"),
});
const envResult = envSchema.safeParse(process.env);
if (!envResult.success) {
    console.error("Environment validation failed:", envResult.error.format());
    // Use defaults for production, throw error for development
    if (process.env.NODE_ENV === "production") {
        console.log("Using default values for missing environment variables");
    }
    else {
        throw new Error("Environment validation failed");
    }
}
exports.envVars = envResult.success
    ? envResult.data
    : {
        NODE_ENV: "development",
        PORT: "3000",
        MONGODB_URI: "mongodb://localhost:27017/parcel-delivery",
        JWT_SECRET: "fallback-jwt-secret-change-in-production",
        JWT_EXPIRES_IN: "7d",
        FRONTEND_URL: "http://localhost:3001",
    };
//# sourceMappingURL=env.js.map