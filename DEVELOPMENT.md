# Development Process (v0.2.0+)

We follow a structured development workflow for the next major version release.

## Branching Strategy

1.  **Release Branch (`release/v0.2.0`)**
    *   This is the integration branch for the next version.
    *   All new features and fixes should be merged into this branch via Pull Request.
    *   Do NOT push directly to `master`.

2.  **Feature Branches (`feature/[issue-number]-[feature-name]`)**
    *   Create a separate branch for each Issue.
    *   Example: `feature/11-block-sellers`
    *   Base your branch off `release/v0.2.0`.

## Implementation Requirements

*   **Code Quality**: Follow existing coding standards and lint rules.
*   **Testing**:
    *   Unit Tests (Vitest): Required for logic, utility functions, and component behavior.
    *   E2E Tests (Playwright): Required for major user interactions and UI changes.
    *   Ensure all tests pass (`npm test`, `npm run test:e2e`) before submitting a PR.

## Pull Request Process

1.  Push your feature branch.
2.  Create a Pull Request targeting `release/v0.2.0`.
3.  Ensure CI checks pass (Lint, Unit Tests, Build, E2E Tests).
4.  After review and approval, merge into `release/v0.2.0`.

## Final Release

Once all targeted features are implemented and tested on `release/v0.2.0`:
1.  Perform final integration testing.
2.  Merge `release/v0.2.0` into `master`.
3.  Create a standardized release tag.
