import express from "express";
import swaggerUi from "swagger-ui-express";
import { createTestController } from "./controllers/testController.js";
import { type AppConfig } from "./config.js";
import { TestDao } from "./daos/TestDao.js";
import { buildOpenApiDocument } from "./openapi.js";
import { TestService } from "./services/TestService.js";

export function createApplication(config: AppConfig) {
  const app = express();
  const testService = new TestService(new TestDao());
  const openApiDocument = buildOpenApiDocument(config);

  app.use(express.json());
  app.use(createTestController(testService));
  app.use(config.swagger.path, swaggerUi.serve, swaggerUi.setup(openApiDocument));

  return app;
}

export function createAdminApplication() {
  const adminApp = express();

  adminApp.get("/healthcheck", (_request, response) => {
    response.json({ status: "ok" });
  });

  return adminApp;
}