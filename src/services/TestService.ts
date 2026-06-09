import { TestDao } from "../daos/TestDao.js";

export class TestService {
  public constructor(private readonly testDao: TestDao) {}

  async testConnection(): Promise<string[]> {
    return this.testDao.testConnection();
  }
}