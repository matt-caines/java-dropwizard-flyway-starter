import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import yaml from "js-yaml";

dotenv.config();

type RawConfig = {
  server?: {
    applicationPort?: number;
    adminPort?: number;
  };
  swagger?: {
    title?: string;
    version?: string;
    path?: string;
  };
};

export type AppConfig = {
  server: {
    applicationPort: number;
    adminPort: number;
  };
  swagger: {
    title: string;
    version: string;
    path: string;
  };
};

export type DatabaseConfig = {
  host: string;
  name: string;
  username: string;
  password: string;
};

const defaultConfigPath = path.resolve(process.cwd(), "config.yml");

export function loadAppConfig(configPath = defaultConfigPath): AppConfig {
  const fileContents = fs.readFileSync(configPath, "utf8");
  const parsed = (yaml.load(fileContents) as RawConfig | undefined) ?? {};

  return {
    server: {
      applicationPort: parsed.server?.applicationPort ?? 8080,
      adminPort: parsed.server?.adminPort ?? 8081
    },
    swagger: {
      title: parsed.swagger?.title ?? "Test API",
      version: parsed.swagger?.version ?? "1.0.0",
      path: parsed.swagger?.path ?? "/swagger"
    }
  };
}

export function loadDatabaseConfig(): DatabaseConfig {
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  const host = process.env.DB_HOST;
  const name = process.env.DB_NAME;

  if (!username || !password || !host || !name) {
    throw new Error(
      "Add the following environment variables: DB_USERNAME, DB_PASSWORD, DB_HOST and DB_NAME"
    );
  }

  return {
    host,
    name,
    username,
    password
  };
}