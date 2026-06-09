import { createAdminApplication, createApplication } from "./app.js";
import { loadAppConfig } from "./config.js";

const config = loadAppConfig();
const app = createApplication(config);
const adminApp = createAdminApplication();

app.listen(config.server.applicationPort, () => {
  console.log(`Application listening on port ${config.server.applicationPort}`);
});

adminApp.listen(config.server.adminPort, () => {
  console.log(`Admin listening on port ${config.server.adminPort}`);
});