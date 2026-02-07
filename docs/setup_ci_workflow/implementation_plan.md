# CI Implementation Plan

## Overview
Implement a GitHub Actions workflow that runs tests, linting, and build checks on every Pull Request. This ensures that only code passing all checks can be merged.

## Workflow File (`.github/workflows/ci.yml`)

### Triggers
- `pull_request`:
  - `branches`: `[ "master", "release/*" ]` (Run on PRs targeting master or release branches)
- `push`:
  - `branches`: `[ "master", "release/*" ]` (Run on pushes to these branches to keep history green)

### Jobs

#### 1. `test` (Unit Tests)
- **Runs-on**: `ubuntu-latest`
- **Steps**:
  - Checkout code
  - Setup Node.js (v20)
  - Install dependencies (`npm ci`)
  - Run tests (`npm test`) - Note: Need to ensure `npm test` runs once and exits, not watch mode.

#### 2. `lint` (Code Quality)
- **Runs-on**: `ubuntu-latest`
- **Steps**:
  - Checkout & Setup
  - Install dependencies
  - Run lint (`npm run lint`)

#### 3. `build` (Build Check)
- **Runs-on**: `ubuntu-latest`
- **Steps**:
  - Checkout & Setup
  - Install dependencies
  - Run build (`npm run build`) to ensure no build errors.

## Branch Protection (Manual Step)
After pushing this workflow, the user will need to configure Branch Protection Rules on GitHub to *require* these checks to pass before merging. I will provide instructions for this.

## Adjustments
- Update `package.json` script `test` to run in CI mode (single run).
  - Current: `vitest` (runs in watch mode by default in dev, but in CI environments Vitest usually auto-detects. To be safe, use simply `vitest run`).

