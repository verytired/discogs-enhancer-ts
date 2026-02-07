# Test Setup Implementation Plan

## Overview
Enable testing in the project using Vitest, which is optimized for Vite projects. This will allow unit and integration testing of React components and utility functions.

## Components

### 1. Dependencies
- `vitest`: The testing framework.
- `@testing-library/react`: For testing React components.
- `@testing-library/jest-dom`: Custom matchers for DOM testing.
- `jsdom`: Simulated DOM environment.
- `@types/jest`: (Optional) for Jest DOM type support.

### 2. Configuration (`vitest.config.ts`)
- Use existing `vite.config.ts` if possible, or extend it.
- Set `environment: 'jsdom'`.
- Set `setupFiles: './src/setupTests.ts'`.

### 3. Setup File (`src/setupTests.ts`)
- Import `@testing-library/jest-dom` to extend Vitest's `expect` with DOM matchers.

### 4. Scripts
- Add `"test": "vitest"` to `package.json`.
- Add `"test:ui": "vitest --ui"` (optional).

## Verification
- Create a simple test file `src/utils/storage.test.ts` or component test `src/popup/App.test.tsx` to verify the setup works.
