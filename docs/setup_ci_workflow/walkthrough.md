# CI Workflow Walkthrough

I have implemented a GitHub Actions workflow to ensure code quality on Pull Requests.

## Configuration (.github/workflows/ci.yml)
The workflow is configured to run on:
- `push` to `master` and `release/*`
- `pull_request` targeting `master` and `release/*`

## Checks Included
1. **Tests** (`npm test` via `npx vitest run`)
   - Ensures all unit tests pass.
2. **Linting** (`npm run lint`)
   - Checks code style and potential errors using ESLint.
3. **Build** (`npm run build`)
   - Verifies that the project builds successfully without errors.

## Next Step: Branch Protection
Since I cannot configure GitHub repository settings directly, you need to enable Branch Protection Rules in your GitHub repository settings to **require** these checks to pass before merging.

### Instructions for User:
1. Go to your repository on GitHub.
2. Navigate to **Settings** > **Branches**.
3. Click **Add branch protection rule**.
4. Set **Branch name pattern** to `master`.
5. Check **Require status checks to pass before merging**.
6. Search for and select the jobs defined in the workflow:
   - `Run Tests`
   - `Lint Code`
   - `Build Check`
7. Click **Create**.

Repeat these steps for `release/*` if you want to protect release branches as well.
