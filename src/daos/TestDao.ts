import { getPool } from "../database/DatabaseConnector.js";

type DatabaseRow = {
  datname: string;
};

export class TestDao {
  async testConnection(): Promise<string[]> {
    const result = await getPool().query<DatabaseRow>(
      "SELECT datname FROM pg_database WHERE datistemplate = false;"
    );
    return result.rows.map((row) => row.datname);
  }
}