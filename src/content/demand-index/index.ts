import { $, $$, create } from '../../content/utils/dom'
import { getSettings } from '../../utils/storage'

export const initDemandIndex = () => {
    getSettings().then((settings) => {
        if (settings.demandIndex) {
            applyDemandIndex()
            setTimeout(applyDemandIndex, 1000)
            setTimeout(applyDemandIndex, 3000)
        } else {
            removeDemandIndex()
        }
    })
}

export const removeDemandIndex = () => {
    const containers = $$('.discogs-enhancer-demand-container')
    containers.forEach(container => container.remove())
    console.info('Discogs Enhancer: Demand Index removed')
}

export const applyDemandIndex = () => {
    console.info('Discogs Enhancer: Applying Demand Index...')

    // Try to find the statistics section to narrow our search scope
    // This prevents picking up "Have" or "Want" from headers, footers, or user menus
    let statsSection = $('#release-stats')

    if (!statsSection) {
        statsSection = $('section[id*="stats"]')
    }

    if (!statsSection) {
        // Try finding by content - look for a section containing both "Have" and "Want"
        const sections = $$('section')
        for (const section of sections) {
            const text = section.textContent || ''
            if ((text.includes('Have') || text.includes('持っている')) &&
                (text.includes('Want') || text.includes('欲しい'))) {
                statsSection = section
                break
            }
        }
    }

    // If still not found, search in the whole document but be more careful
    const searchScope = statsSection || document.body
    console.info('Discogs Enhancer: Search scope:', statsSection ? 'Statistics section found' : 'Using document body')

    // Check if already applied to this section
    if ($('.discogs-enhancer-demand-container', searchScope)) {
        console.info('Discogs Enhancer: Already applied')
        return
    }

    // Helper to check text
    const isHave = (t: string) => (t.includes('Have:') || t.includes('持っている')) && !t.includes('Demand Index')
    const isWant = (t: string) => t.includes('Want:') || t.includes('欲しい')

    // Search within the search scope
    const anchors = $$('a', searchScope)
    let haveElement: HTMLElement | null = null
    let wantElement: HTMLElement | null = null

    for (const a of anchors) {
        const text = a.textContent || ''
        if (isHave(text)) {
            haveElement = a
            console.info('Discogs Enhancer: Found Have in anchor:', text.substring(0, 50))
        } else if (isWant(text)) {
            wantElement = a
            console.info('Discogs Enhancer: Found Want in anchor:', text.substring(0, 50))
        }
    }

    // Fallback: search all elements within search scope (span, div, etc)
    if (!haveElement || !wantElement) {
        // First pass: look for leaf elements (li, span, a, td)
        const leafElements = $$('li, span, a, td, th', searchScope)
        for (const el of leafElements) {
            const text = el.textContent || ''
            if (!haveElement && isHave(text)) {
                haveElement = el
                console.info('Discogs Enhancer: Found Have in leaf element:', el.tagName, text.substring(0, 50))
            }
            if (!wantElement && isWant(text)) {
                wantElement = el
                console.info('Discogs Enhancer: Found Want in leaf element:', el.tagName, text.substring(0, 50))
            }
        }

        // Second pass: if still not found, look for any element with few children
        if (!haveElement || !wantElement) {
            const all = $$('*', searchScope)
            for (const el of all) {
                if (el.tagName === 'BODY' || el.tagName === 'HTML' || el.tagName === 'UL' || el.tagName === 'OL' || el.scrollHeight > 500) continue

                const text = el.textContent || ''
                if (!haveElement && isHave(text) && el.children.length <= 1) {
                    haveElement = el
                    console.info('Discogs Enhancer: Found Have in element:', el.tagName, text.substring(0, 50))
                }
                if (!wantElement && isWant(text) && el.children.length <= 1) {
                    wantElement = el
                    console.info('Discogs Enhancer: Found Want in element:', el.tagName, text.substring(0, 50))
                }
            }
        }
    }

    if (!haveElement || !wantElement) {
        console.info('Discogs Enhancer: Have or Want element not found. Have:', !!haveElement, 'Want:', !!wantElement)
        return
    }

    // Find common parent
    let parent = haveElement.parentElement
    let iterations = 0
    const maxIterations = 20 // Prevent infinite loops

    while (parent && parent !== searchScope && parent !== document.body && iterations < maxIterations) {
        if (parent.contains(wantElement)) {
            break
        }
        parent = parent.parentElement
        iterations++
    }

    if (!parent || parent === document.body) {
        console.info('Discogs Enhancer: Could not find common parent')
        return
    }

    // Parse counts
    // 1. Direct text
    let haveCount = parseCount(haveElement.textContent || '')
    let wantCount = parseCount(wantElement.textContent || '')

    // 2. Parent text (Vital for live site where Have: is in span, number in sibling anchor)
    if (haveCount === 0 && haveElement.parentElement) {
        haveCount = parseCount(haveElement.parentElement.textContent || '')
    }
    if (wantCount === 0 && wantElement.parentElement) {
        wantCount = parseCount(wantElement.parentElement.textContent || '')
    }

    // 3. List Item fallback (Iterate siblings if parent is UL)
    if (haveCount === 0 || wantCount === 0) {
        const items = $$('li', parent)
        items.forEach(item => {
            const text = item.textContent || ''
            if (isHave(text)) haveCount = parseCount(text)
            else if (isWant(text)) wantCount = parseCount(text)
        })
    }

    console.info('Discogs Enhancer: Parsed counts - Have:', haveCount, 'Want:', wantCount)

    if (haveCount > 0) {
        const ratio = (wantCount / haveCount).toFixed(2)

        const demandContainer = create('div', {
            class: 'discogs-enhancer-demand-container',
            style: 'padding: 5px 0; font-size: 13px; margin-top: 5px; color: #555;'
        }, [
            create('span', { class: 'link_text' }, ['Demand Index: ']),
            create('span', { style: 'font-weight: bold; color: #f00; margin-left: 5px;' }, [ratio])
        ])

        // Insert within the statistics section
        // If parent is UL, insert after it; otherwise append to parent
        if (parent.tagName === 'UL' && parent.parentNode && (statsSection ? statsSection.contains(parent.parentNode as Node) : true)) {
            parent.parentNode.insertBefore(demandContainer, parent.nextSibling)
        } else {
            parent.appendChild(demandContainer)
        }

        console.info(`Discogs Enhancer: Demand Index (${ratio}) added successfully`)
    }
}

const parseCount = (text: string): number => {
    // Extract number. Relaxed regex to catch "3,939" in "Have: 3,939"
    const match = text.match(/[\d,.]+/)
    if (match) {
        // Remove commas and dots (if dots are thousands separators? Discogs uses commas).
        // But some locales use dots. safely remove commas. 
        // If it's "1.234" (EU), parseInt(1.234) -> 1.
        // Discogs English uses commas. 
        // We'll strip commas.
        return parseInt(match[0].replace(/,/g, ''), 10)
    }
    return 0
}
