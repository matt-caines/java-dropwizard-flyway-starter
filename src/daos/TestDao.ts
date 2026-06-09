import type { RowDataPacket } from "mysql2";
import { getPool } from "../database/DatabaseConnector.js";

type DatabaseRow = RowDataPacket & {
  Database: string;
};

export class TestDao {
  async testConnection(): Promise<string[]> {
    const [rows] = await getPool().query<DatabaseRow[]>("SHOW DATABASES;");
    return rows.map((row) => row.Database);
  }
}