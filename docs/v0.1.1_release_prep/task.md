# v0.1.1 Release Preparation & CI Setup

## Status
- [x] Create release branch `release/v0.1.1`
- [x] Fix dependency issues by bumping from `v0.0.0` to `v0.1.1` in `package.json` and `package-lock.json`
- [x] Setup Testing Infrastructure
    - [x] Install Vitest, React Testing Library, Happy DOM
    - [x] Configure `vite.config.ts` for testing
    - [x] Create `src/setupTests.ts`
    - [x] Create initial test `src/utils/storage.test.ts`
- [x] Setup CI Workflow (GitHub Actions)
    - [x] Create `.github/workflows/ci.yml` for tests, lint, and build checks
    - [x] Configure triggers for PRs and push to `master` and `release/*`
- [x] Enable Branch Protection Rules on GitHub (User action complete)
