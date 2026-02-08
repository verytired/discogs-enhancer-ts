/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, chromium, type BrowserContext } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Custom test fixture that launches Chrome with the extension loaded
 */
export const test = base.extend<{
    context: BrowserContext
    extensionId: string
}>({
    // eslint-disable-next-line no-empty-pattern
    context: async ({ }, use) => {
        const pathToExtension = path.join(__dirname, '..', 'dist')
        const context = await chromium.launchPersistentContext('', {
            headless: false,  // Extensions require headed mode
            args: [
                `--disable-extensions-except=${pathToExtension}`,
                `--load-extension=${pathToExtension}`,
                '--no-first-run',
                '--disable-default-apps',
                '--disable-popup-blocking',
            ],
        })
        await use(context)
        await context.close()
    },
    extensionId: async ({ context }, use) => {
        // Get extension ID from service worker
        let [background] = context.serviceWorkers()
        if (!background) {
            background = await context.waitForEvent('serviceworker')
        }
        const extensionId = background.url().split('/')[2]
        await use(extensionId)
    },
})

export const expect = test.expect
