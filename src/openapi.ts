import type { AppConfig } from "./config.js";

export function buildOpenApiDocument(config: AppConfig) {
  return {
    openapi: "3.0.3",
    info: {
      title: config.swagger.title,
      version: config.swagger.version
    },
    paths: {
      "/api/test": {
        get: {
          summary: "List visible databases",
          responses: {
            "200": {
              description: "A JSON array of database names.",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "string"
                    }
                  }
                }
              }
            },
            "500": {
              description: "Database connection failed."
            }
          }
        }
      },
      "/healthcheck": {
        get: {
          summary: "Service health check",
          responses: {
            "200": {
              description: "Service is healthy."
            }
          }
        }
      }
    }
  };
}