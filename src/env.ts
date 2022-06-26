import * as dotenv from "dotenv";
import { getOsEnv, normalizePort } from "./lib/env";
dotenv.config();

/**
 * Environment variables
 */
export const env = {
  node: process.env.APP_ENV || "development",
  isProduction: process.env.APP_ENV === "production",
  isTest: process.env.APP_ENV === "test",
  isDevelopment: process.env.APP_ENV === "development",
  app: {
    name: getOsEnv("APP_NAME"),
    // version: (pkg as any).version,
    // description: (pkg as any).description,
    host: getOsEnv("APP_URL"),
    port: normalizePort(process.env.PORT || getOsEnv("APP_PORT")),
  },
  redis: {
    url:
      getOsEnv("REDIS_USERNAME") || getOsEnv("REDIS_PASSWORD")
        ? `redis://${getOsEnv("REDIS_USERNAME")}:${getOsEnv(
            "REDIS_PASSWORD"
          )}@${getOsEnv("REDIS_HOST")}:${getOsEnv("REDIS_PORT")}`
        : `redis://${getOsEnv("REDIS_HOST")}:${getOsEnv("REDIS_PORT")}`,
    host: getOsEnv("REDIS_HOST"),
    port: getOsEnv("REDIS_PORT"),
    password: getOsEnv("REDIS_PASSWORD"),
    username: getOsEnv("REDIS_USERNAME"),
  },
};
