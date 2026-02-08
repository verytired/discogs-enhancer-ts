import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for E2E testing with Chrome extension
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './e2e',
    fullyParallel: false,  // Extensions need sequential testing
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,  // Single worker for extension testing
    reporter: 'html',
    timeout: 60000,  // 60 second timeout for extension tests

    use: {
        trace: 'on-first-retry',
        video: 'on-first-retry',
        screenshot: 'only-on-failure',
    },

    projects: [
        {
            name: 'chromium-extension',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
    ],
})
