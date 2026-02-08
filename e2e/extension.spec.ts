import { test, expect } from './fixtures'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Read mock HTML file content
 */
function getMockHtml(filename: string): string {
    return fs.readFileSync(path.join(__dirname, 'fixtures', filename), 'utf-8')
}

/**
 * E2E Tests for Discogs Enhancer Chrome Extension
 * 
 * These tests use mock HTML pages that mimic Discogs structure.
 * Real Discogs site testing is blocked by Cloudflare and should be done manually.
 */

test.describe('Extension Loading', () => {
    test('should load extension successfully', async ({ extensionId }) => {
        expect(extensionId).toBeTruthy()
        expect(extensionId.length).toBeGreaterThan(10)
        console.log(`✓ Extension loaded with ID: ${extensionId}`)
    })
})

test.describe('Extension Options Page', () => {
    test('should open options page', async ({ context, extensionId }) => {
        const page = await context.newPage()
        await page.goto(`chrome-extension://${extensionId}/src/options/index.html`)
        await page.waitForLoadState('domcontentloaded')
        await page.waitForTimeout(1000)

        // Check React root is rendered
        const root = page.locator('#root')
        await expect(root).toBeVisible()

        // Check for settings elements
        const labels = page.locator('label')
        const count = await labels.count()
        expect(count).toBeGreaterThan(0)

        await page.close()
    })

    test('should toggle settings', async ({ context, extensionId }) => {
        const page = await context.newPage()
        await page.goto(`chrome-extension://${extensionId}/src/options/index.html`)
        await page.waitForLoadState('networkidle')
        await page.waitForTimeout(1000)

        const checkboxes = page.locator('input[type="checkbox"]')
        const count = await checkboxes.count()

        if (count > 0) {
            const checkbox = checkboxes.first()
            const initialState = await checkbox.isChecked()

            await checkbox.click()
            await page.waitForTimeout(300)
            expect(await checkbox.isChecked()).not.toBe(initialState)

            await checkbox.click()
            await page.waitForTimeout(300)
            expect(await checkbox.isChecked()).toBe(initialState)
        }

        await page.close()
    })
})

test.describe('Demand Index - English Page', () => {
    test('should display Demand Index with correct calculation', async ({ context }) => {
        const page = await context.newPage()
        const mockHtml = getMockHtml('mock-release-en.html')

        await page.route('**/www.discogs.com/release/**', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'text/html',
                body: mockHtml
            })
        })

        await page.goto('https://www.discogs.com/release/22773371-Test-Release')
        await page.waitForTimeout(3000)

        // Check Demand Index container exists
        const demandContainer = page.locator('.discogs-enhancer-demand-container')
        await expect(demandContainer).toBeVisible({ timeout: 5000 })

        // Verify content: Have: 157, Want: 62 -> Demand Index: 62/157 ≈ 0.39
        const text = await demandContainer.textContent()
        expect(text).toContain('Demand Index:')
        expect(text).toMatch(/0\.39|0\.40/)  // Allow for rounding

        await page.close()
    })
})

test.describe('Demand Index - Japanese Page', () => {
    test('should display Demand Index on Japanese page', async ({ context }) => {
        const page = await context.newPage()
        const mockHtml = getMockHtml('mock-release-ja.html')

        await page.route('**/www.discogs.com/ja/release/**', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'text/html',
                body: mockHtml
            })
        })

        await page.goto('https://www.discogs.com/ja/release/22773371-Test-Release')
        await page.waitForTimeout(3000)

        const demandContainer = page.locator('.discogs-enhancer-demand-container')
        await expect(demandContainer).toBeVisible({ timeout: 5000 })

        // Verify: 持っている: 200, 欲しい: 80 -> Demand Index: 80/200 = 0.40
        const text = await demandContainer.textContent()
        expect(text).toContain('Demand Index:')
        expect(text).toMatch(/0\.40/)

        await page.close()
    })
})

test.describe('Settings Integration', () => {
    test('should hide Demand Index when disabled', async ({ context, extensionId }) => {
        // Disable Demand Index
        const optionsPage = await context.newPage()
        await optionsPage.goto(`chrome-extension://${extensionId}/src/options/index.html`)
        await optionsPage.waitForLoadState('networkidle')
        await optionsPage.waitForTimeout(1000)

        // Find Demand Index checkbox
        const labels = optionsPage.locator('label')
        const labelCount = await labels.count()

        for (let i = 0; i < labelCount; i++) {
            const label = labels.nth(i)
            const text = await label.textContent()
            if (text && text.toLowerCase().includes('demand')) {
                const checkbox = label.locator('input[type="checkbox"]')
                if (await checkbox.isChecked()) {
                    await checkbox.uncheck()
                    await optionsPage.waitForTimeout(500)
                }
                break
            }
        }
        await optionsPage.close()

        // Navigate to mock page
        const page = await context.newPage()
        const mockHtml = getMockHtml('mock-release-en.html')

        await page.route('**/www.discogs.com/release/**', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'text/html',
                body: mockHtml
            })
        })

        await page.goto('https://www.discogs.com/release/12345-Test')
        await page.waitForTimeout(3000)

        // Demand Index should NOT be visible
        const demandContainer = page.locator('.discogs-enhancer-demand-container')
        await expect(demandContainer).not.toBeVisible()

        await page.close()

        // Re-enable for other tests
        const optionsPage2 = await context.newPage()
        await optionsPage2.goto(`chrome-extension://${extensionId}/src/options/index.html`)
        await optionsPage2.waitForLoadState('networkidle')
        await optionsPage2.waitForTimeout(1000)

        const labels2 = optionsPage2.locator('label')
        for (let i = 0; i < await labels2.count(); i++) {
            const label = labels2.nth(i)
            const text = await label.textContent()
            if (text && text.toLowerCase().includes('demand')) {
                const checkbox = label.locator('input[type="checkbox"]')
                if (!(await checkbox.isChecked())) {
                    await checkbox.check()
                }
                break
            }
        }
        await optionsPage2.close()
    })
})
