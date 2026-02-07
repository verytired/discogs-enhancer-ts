import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { initDemandIndex } from './index'

vi.mock('../../utils/storage', () => ({
    getSettings: vi.fn().mockResolvedValue({ demandIndex: true })
}))

describe('Demand Index Logic (v0.1.3)', () => {
    beforeEach(() => {
        document.body.innerHTML = ''
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.clearAllMocks()
    })

    it('Legacy Layout: should inject demand index correctly', async () => {
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

    it('Modern Layout (Anchor tags only): should inject demand index', async () => {
        document.body.innerHTML = `
            <div class="some-container">
                 <a href="/release/stats">Have: 200</a>
                 <a href="/release/stats">Want: 40</a>
            </div>
        `

        await initDemandIndex()
        await vi.advanceTimersByTimeAsync(3100)

        expect(document.querySelector('.discogs-enhancer-demand-container')).not.toBeNull()
        expect(document.querySelector('.discogs-enhancer-demand-container')?.textContent).toContain('0.20')
    })

    it('Live Site Layout (Split Span/Anchor): should inject demand index', async () => {
        // As seen on live site: <li><span>Have:</span><a href="...">3939</a></li>
        document.body.innerHTML = `
            <ul>
                <li>
                    <span>Here is Have:</span>
                    <a href="#">3,939</a>
                </li>
                <li>
                    <span>Here is Want:</span>
                    <a href="#">576</a>
                </li>
            </ul>
        `

        await initDemandIndex()
        await vi.advanceTimersByTimeAsync(3100)

        const container = document.querySelector('.discogs-enhancer-demand-container')
        expect(container).not.toBeNull()
        // 576 / 3939 = 0.146... -> 0.15
        expect(container?.textContent).toContain('0.15')
    })
})
