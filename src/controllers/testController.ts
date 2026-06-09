import { Router } from "express";
import { TestService } from "../services/TestService.js";

export function createTestController(testService: TestService): Router {
  const router = Router();

  router.get("/api/test", async (_request, response) => {
    try {
      const databases = await testService.testConnection();
      response.json(databases);
    } catch {
      response.sendStatus(500);
    }
  });

  return router;
}