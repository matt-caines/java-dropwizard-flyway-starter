# TypeScript Express Flyway Starter

This repository is an academy starter project for a small TypeScript service.

It includes:

- an Express API written in TypeScript
- a simple controller -> service -> DAO structure
- PostgreSQL connectivity through `pg`
- Swagger UI for local API exploration
- Flyway migrations for schema changes

## What it does today

- `GET /api/test` connects to PostgreSQL and returns the list of accessible databases
- `GET /healthcheck` runs on the admin port for a lightweight health check
- `GET /swagger` serves the OpenAPI docs in the browser

## Prerequisites

- Node.js 20 or later
- Docker

## Local PostgreSQL with Docker Quickstart

Use this if you want a quick local PostgreSQL instance that matches the sample `.env` values.

Run these commands step by step. Each includes why it is needed.

1. Remove existing container (optional but recommended):

```bash
docker rm -f academy-postgres
```

Why: avoids naming conflicts and ensures you start from a clean PostgreSQL container.

2. Start PostgreSQL in Docker:

```bash
docker run -d --name academy-postgres -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=academy_dev postgres:17-alpine
```

Why: creates the local database service your app connects to.

3. Create your local env file:

```bash
cp .env.example .env
```

Why: keeps local secrets/config separate from committed files.

4. Ensure your `.env` contains:

```text
DB_USERNAME=postgres
DB_PASSWORD=password
DB_HOST=127.0.0.1
DB_NAME=academy_dev
```

Why: these values match the Docker container credentials and DB name from the command above.

5. Run migrations now:

```bash
docker run --rm -v "$PWD/migrations:/flyway/sql" flyway/flyway:11.9.1 -locations=filesystem:/flyway/sql -url="jdbc:postgresql://host.docker.internal/academy_dev" -user=postgres -password=password -baselineOnMigrate=true migrate
```

Why: applies SQL files in `migrations` to your local PostgreSQL before the app runs.

6. Optional check if PostgreSQL is running:

```bash
docker ps --filter name=academy-postgres
```

Why: confirms the container is up before troubleshooting app connection issues.

7. Verify the migration was applied correctly:

```bash
docker exec academy-postgres psql -U postgres -d academy_dev -c "SELECT * FROM flyway_schema_history;"
docker exec academy-postgres psql -U postgres -d academy_dev -c "SELECT * FROM flyway_smoke_test;"
```

Why: the first command shows Flyway's migration history - look for `success = t` against `V1__create_flyway_smoke_table.sql`. The second confirms the smoke test table was created and the seed row (`flyway smoke test migration applied`) is present.

## Quick start

1. Install Node.js 20 or later.
2. Install project dependencies:

```bash
npm install
```

3. Configure `.env` with your database details (or run the Docker quickstart above).
4. Start the service in development mode:

```bash
npm run dev
```

5. Open these URLs:

- `http://localhost:8080/api/test`
- `http://localhost:8080/swagger`
- `http://localhost:8081/healthcheck`

## Environment variables

The app reads these values from your environment or from a local `.env` file:

```text
DB_USERNAME
DB_PASSWORD
DB_HOST
DB_NAME
```

## Useful scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
```

## Project structure

```text
src/
	controllers/   HTTP route handlers
	services/      business logic
	daos/          database-facing queries
	database/      connection setup
	app.ts         express app wiring
	server.ts      application entry point
```

## Database migrations

### Local

1. Add your SQL migration file to the `migrations` directory.
2. Install Flyway locally or use the Flyway Docker image.
3. Set the following environment variables:

```bash
export FLYWAY_URL="jdbc:postgresql://YOUR_DB_HOST/YOUR_DB_NAME"
export FLYWAY_USER="YOUR_DB_USERNAME"
export FLYWAY_PASSWORD="YOUR_DB_PASSWORD"
export FLYWAY_BASELINE_ON_MIGRATE=true
```

4. Run Flyway:

```bash
flyway -locations=filesystem:./migrations migrate
```

### Production 

Add these GitHub repository secrets:

```text
DB_USERNAME
DB_PASSWORD
DB_HOST
DB_NAME
```

The production migration workflow (`migration.yml`) is currently manual trigger only (`workflow_dispatch`). Re-enable the `push` trigger for `main` when you want automatic migration runs.

## Deploying to Azure

The `deploy.yml` and `migration.yml` workflows are currently manual trigger only (`workflow_dispatch`) while the academy is in progress. This avoids failed production deployment runs before Azure is ready.

### 1. Create Azure resources

Run these commands in Azure CLI (or use the portal):

```bash
az group create --name academy-rg --location uksouth

az appservice plan create \
  --name academy-plan \
  --resource-group academy-rg \
  --sku B1 \
  --is-linux

az webapp create \
  --name <YOUR_APP_NAME> \
  --resource-group academy-rg \
  --plan academy-plan \
  --runtime "NODE:20-lts"
```

Replace `<YOUR_APP_NAME>` with a globally unique name — this becomes `<YOUR_APP_NAME>.azurewebsites.net`.

### 2. Configure App Settings in Azure

The app listens on port 8080. Tell Azure which port to expect, and provide the database connection values:

```bash
az webapp config appsettings set \
  --name <YOUR_APP_NAME> \
  --resource-group academy-rg \
  --settings \
    WEBSITES_PORT=8080 \
    DB_HOST=<your-db-host> \
    DB_NAME=<your-db-name> \
    DB_USERNAME=<your-db-username> \
    DB_PASSWORD=<your-db-password>
```

### 3. Download the publish profile

In the Azure portal, open your Web App → **Overview** → **Download publish profile**. Keep this file — you will paste its contents into a GitHub secret.

Alternatively with CLI:

```bash
az webapp deployment list-publishing-profiles \
  --name <YOUR_APP_NAME> \
  --resource-group academy-rg \
  --xml
```

### 4. Add GitHub secrets

In the GitHub repository go to **Settings → Secrets and variables → Actions** and add:

| Secret | Value |
|---|---|
| `AZURE_WEBAPP_NAME` | The Web App name you chose |
| `AZURE_WEBAPP_PUBLISH_PROFILE` | Full XML contents of the publish profile |
| `DB_HOST` | Your PostgreSQL host |
| `DB_NAME` | Your database name |
| `DB_USERNAME` | Your database username |
| `DB_PASSWORD` | Your database password |

The last four are shared by both the deploy and migration workflows.

### 5. Trigger the workflows

Both `deploy.yml` and `migration.yml` are set to **manual trigger only** (`workflow_dispatch`). This means they will not run automatically while students are committing to `main` — useful during the academy period before Azure is set up.

To run them manually, go to the GitHub repository → **Actions** → select the workflow → **Run workflow**.

**When Azure is ready and you want automatic runs on every push to `main`**, update the `on:` block in both workflow files:

```yaml
on:
  workflow_dispatch:
  push:
    branches: [ "main" ]
```

After that change, every push to `main` will:

1. Run `migration.yml` — applies any pending Flyway migrations against the target database.
2. Run `deploy.yml` — builds the TypeScript and deploys the app to Azure.

The live app will be at `https://<YOUR_APP_NAME>.azurewebsites.net`.

### Notes

- The admin healthcheck port (8081) is not available on Azure App Service. The `/healthcheck` endpoint is only reachable locally. Use Azure's built-in health check feature under **Monitoring → Health check** if you need liveness checks in production.
- The `config.yml` file is included in the deployment and controls port and Swagger settings.
- Production migrations run when `migration.yml` is triggered. After you re-enable `push` for `main`, they will run automatically on each push.

## Notes for academy work

- Keep controller logic thin and move decision-making into services.
- Put SQL access behind DAOs so it stays isolated and testable.
- Add new migrations instead of editing old ones after they have been applied.
- Keep configuration in `config.yml` and secrets in `.env` or deployment secrets.
