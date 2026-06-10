import { Pool } from "pg";
import { loadDatabaseConfig } from "../config.js";

let pool: Pool | undefined;

export function getPool(): Pool {
  if (pool) {
    return pool;
  }

  const databaseConfig = loadDatabaseConfig();
  pool = new Pool({
    host: databaseConfig.host,
    user: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.name,
    max: 10
  });

  return pool;
}