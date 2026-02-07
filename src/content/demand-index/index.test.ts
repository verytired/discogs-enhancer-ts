import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { initDemandIndex } from './index'

// Mock storage
vi.mock('../../utils/storage', () => ({
    getSettings: vi.fn().mockResolvedValue({ demandIndex: true })
}))

describe('Demand Index Logic', () => {
    beforeEach(() => {
        document.body.innerHTML = ''
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.clearAllMocks()
    })

    it('Legacy Layout: should inject demand index correctly', async () => {
        // Setup legacy DOM structure
        document.body.innerHTML = `
            <div class="statistics">
                <div class="section_content">
                    <ul>
                        <li>Have: 100</li>
                        <li>Want: 50</li>
                    </ul>
                </div>
            </div>
        `

        await initDemandIndex()
        await vi.advanceTimersByTimeAsync(3100)

        const container = document.querySelector('.discogs-enhancer-demand-container')
        expect(container).not.toBeNull()
        expect(container?.textContent).toContain('0.50')
    })

    it('Modern Layout (Anchor tags): should inject demand index', async () => {
        // Setup modern DOM structure (simulating potential new layout)
        document.body.innerHTML = `
            <div class="some-container">
                 <a href="/release/stats">Have: 200</a>
                 <a href="/release/stats">Want: 40</a>
            </div>
        `

        await initDemandIndex()
        await vi.advanceTimersByTimeAsync(3100)

        const container = document.querySelector('.discogs-enhancer-demand-container')
        expect(container).not.toBeNull()
        expect(container?.textContent).toContain('0.20')
    })

    it('Robustness: Text nodes with noise and varying formats', async () => {
        // Setup unstructured/noisy DOM
        document.body.innerHTML = `
            <div id="wrapper">
                 <div><span>  Have: 1,000  </span><br></div>
                 <section>
                    <div><span>  Want: 500  </span></div>
                 </section>
            </div>
        `

        await initDemandIndex()
        await vi.advanceTimersByTimeAsync(3100)

        // With strict v0.1.1 logic, this will fail.
        // With v0.1.2 robust logic, this *might* pass if common parent finding is good.
        // Actually, deeply nested structures are hard.
        // But let's verify if our fix handles it.

        const container = document.querySelector('.discogs-enhancer-demand-container')
        // In this specific test case, common parent is 'wrapper'.
        // If our logic injects into wrapper, it works.

        // For now, let's just assert it finds something, or fail if not implemented.
        expect(container).not.toBeNull()
        expect(container?.textContent).toContain('0.50')
    })
})
