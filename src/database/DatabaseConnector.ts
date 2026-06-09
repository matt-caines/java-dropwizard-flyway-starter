import mysql, { type Pool } from "mysql2/promise";
import { loadDatabaseConfig } from "../config.js";

let pool: Pool | undefined;

export function getPool(): Pool {
  if (pool) {
    return pool;
  }

  const databaseConfig = loadDatabaseConfig();
  pool = mysql.createPool({
    host: databaseConfig.host,
    user: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  return pool;
}