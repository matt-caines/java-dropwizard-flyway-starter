# TypeScript Express Flyway Starter

This repository is an academy starter project for a small TypeScript service.

It includes:

- an Express API written in TypeScript
- a simple controller -> service -> DAO structure
- MySQL connectivity through `mysql2`
- Swagger UI for local API exploration
- Flyway migrations for schema changes

## What it does today

- `GET /api/test` connects to MySQL and returns the list of visible databases
- `GET /healthcheck` runs on the admin port for a lightweight health check
- `GET /swagger` serves the OpenAPI docs in the browser

## Quick start

1. Install Node.js 20 or later.
2. Install project dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env` and fill in your database details.
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
export FLYWAY_URL="jdbc:mysql://YOUR_DB_HOST/YOUR_DB_NAME"
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

After a merge to `main`, the GitHub Actions workflow runs Flyway against the configured production database.

## Notes for academy work

- Keep controller logic thin and move decision-making into services.
- Put SQL access behind DAOs so it stays isolated and testable.
- Add new migrations instead of editing old ones after they have been applied.
- Keep configuration in `config.yml` and secrets in `.env` or deployment secrets.

## Local MySQL with Docker Quickstart

Use this if you want a quick local MySQL instance that matches the sample `.env` values.

Run these commands step by step. Each includes why it is needed.

1. Remove existing container (optional but recommended):

```bash
docker rm -f academy-mysql
```

Why: avoids naming conflicts and ensures you start from a clean MySQL container.

1. Start MySQL in Docker:

```bash
docker run -d --name academy-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=mysql mysql:8.4
```

Why: creates the local database service your app connects to.

2. Create your local env file:

```bash
cp .env.example .env
```

Why: keeps local secrets/config separate from committed files.

3. Ensure your `.env` contains:

```text
DB_USERNAME=root
DB_PASSWORD=password
DB_HOST=127.0.0.1
DB_NAME=mysql
```

Why: these values match the Docker container credentials and DB name from the command above.

4. Install dependencies and start the app:

```bash
npm install
npm run dev
```

Why: installs required packages, then boots the API so you can test endpoints locally.

5. Optional check if MySQL is running:

```bash
docker ps --filter name=academy-mysql
```

Why: confirms the container is up before troubleshooting app connection issues.
