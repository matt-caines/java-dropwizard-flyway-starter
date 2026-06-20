# Setting Up Biome for the Academy Starter

This guide walks you through adding Biome (a fast formatter and linter) to the academy starter project.

## What is Biome?

Biome is an all-in-one linter and formatter for JavaScript, TypeScript, JSON, and CSS. It replaces ESLint and Prettier with a single, faster tool. It includes:
- 340+ linting rules
- Automatic code formatting
- Import organization
- Clear error messages

## Step 1: Install Biome

Add Biome as a dev dependency:

```bash
npm install --save-dev @biomejs/biome
```

## Step 2: Create `biome.json` Configuration

Create a new file called `biome.json` in the project root with the following content:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  }
}
```

This config:
- Enables the linter with recommended rules
- Enables the formatter with 2-space indentation
- Organizes imports automatically

## Step 3: Add Scripts to `package.json`

Open `package.json` and update the `scripts` section. Find this:

```json
"scripts": {
  "build": "tsc -p tsconfig.json",
  "dev": "tsx watch src/server.ts",
  "start": "node dist/server.js",
  "typecheck": "tsc --noEmit -p tsconfig.json"
},
```

And add two new scripts for linting and formatting:

```json
"scripts": {
  "build": "tsc -p tsconfig.json",
  "dev": "tsx watch src/server.ts",
  "start": "node dist/server.js",
  "typecheck": "tsc --noEmit -p tsconfig.json",
  "lint": "biome check src/",
  "format": "biome format --write src/"
},
```

## Step 4: Update the GitHub Actions Workflow

Open `.github/workflows/linter.yml` and update the workflow. Change the name and add a linting step:

**Old version:**
```yaml
name: Type Checks

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Run type checks
        run: npm run typecheck
```

**New version:**
```yaml
name: Linting and Type Checks

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Run linter
        run: npm run lint
      - name: Run type checks
        run: npm run typecheck
```

The key changes:
- Name updated to `Linting and Type Checks`
- Added `Run linter` step that runs `npm run lint`

## Step 5: Test Locally

Install dependencies and test the new scripts:

```bash
npm install
npm run lint     # Check for linting issues
npm run format   # Auto-fix formatting issues
```

## What Happens Next

- On every push or PR, GitHub Actions will run `npm run lint` and `npm run typecheck`
- If there are any linting or type errors, the workflow fails and shows the errors
- Students can run `npm run format` locally to auto-fix many issues before pushing

## Useful Commands

```bash
npm run lint              # Check for issues
npm run format            # Auto-fix formatting
npm run format -- --check # Check formatting without modifying files
```

## VS Code Integration (Optional)

Install the Biome extension for VS Code for real-time linting and formatting:
- Search for "Biome" in the VS Code Extensions marketplace
- Or visit https://biomejs.dev/reference/vscode/

Once installed, you can:
- See linting errors inline
- Format on save
- Quick fixes on hover

## References

- [Biome Documentation](https://biomejs.dev)
- [Biome Configuration Reference](https://biomejs.dev/reference/configuration/)
