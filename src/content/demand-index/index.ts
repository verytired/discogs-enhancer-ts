import { $, $$, create } from '../../content/utils/dom'
import { getSettings } from '../../utils/storage'

export const initDemandIndex = () => {
    getSettings().then((settings) => {
        if (settings.demandIndex) {
            applyDemandIndex()
            setTimeout(applyDemandIndex, 1000)
            setTimeout(applyDemandIndex, 3000)
        }
    })
}

export const applyDemandIndex = () => {
    console.info('Discogs Enhancer: Applying Demand Index...')

    // Improved Strategy: Find the "Have:" and "Want:" elements directly.
    // They are usually <a> tags or inside <li>s.
    const anchors = $$('a')
    let haveElement: HTMLElement | null = null
    let wantElement: HTMLElement | null = null

    for (const a of anchors) {
        const text = a.textContent || ''
        if (text.includes('Have:') && !text.includes('Demand Index')) {
            haveElement = a
        } else if (text.includes('Want:')) {
            wantElement = a
        }
    }

    // Fallback: search all elements if not found in anchors (e.g., span, div)
    if (!haveElement || !wantElement) {
        const all = $$('*')
        for (const el of all) {
            // Skip large containers
            if (el.tagName === 'BODY' || el.tagName === 'HTML' || el.scrollHeight > 500) continue

            // Look for direct text content if possible, or very close
            const text = el.textContent || ''
            if (!haveElement && text.includes('Have:') && !text.includes('Demand Index') && el.children.length === 0) {
                haveElement = el
            }
            if (!wantElement && text.includes('Want:') && el.children.length === 0) {
                wantElement = el
            }
        }
    }

    if (!haveElement || !wantElement) {
        // Silent return if not found (don't spam console if page doesn't have stats)
        return
    }

    // Find common parent
    let parent = haveElement.parentElement
    while (parent && (!parent.contains(wantElement))) {
        parent = parent.parentElement
    }

    // If no common parent found (unlikely if on same page), or parent is body
    if (!parent || parent === document.body) {
        return
    }

    const statsSection = parent as HTMLElement
    // console.info('Discogs Enhancer: Found stats section via Have/Want elements:', statsSection)

    // Check if already applied to avoid duplicates
    if ($('.discogs-enhancer-demand-index', statsSection)) return

    // Parse counts from the found elements (or use the old logic if that fails)
    let haveCount = parseCount(haveElement.textContent || '')
    let wantCount = parseCount(wantElement.textContent || '')

    // Fallback parsing if we found containers but not the numbers directly
    if (haveCount === 0 || wantCount === 0) {
        const items = $$('li', statsSection)
        items.forEach(item => {
            const text = item.textContent || ''
            if (text.includes('Have:') && !text.includes('Demand Index')) {
                haveCount = parseCount(text)
            } else if (text.includes('Want:')) {
                wantCount = parseCount(text)
            }
        })
    }

    if (haveCount > 0) {
        const ratio = (wantCount / haveCount).toFixed(2)

        // Check if we already added our container inside the parent
        if ($('.discogs-enhancer-demand-container', parent as HTMLElement)) return

        const demandContainer = create('div', {
            class: 'discogs-enhancer-demand-container',
            style: 'padding: 5px 0; font-size: 13px; margin-top: 5px;'
        }, [
            create('span', { class: 'link_text' }, ['Demand Index: ']),
            create('span', { style: 'font-weight: bold; color: #f00; margin-left: 5px;' }, [ratio])
        ])

        // Insert after the stats section (the found parent)
        // Wait, statsSection IS the parent. We want to append to it, or insert after it?
        // Logic v0.1.2: parent.insertBefore(demandContainer, statsSection.nextSibling)
        // If statsSection == parent, then parent.insertBefore(..., parent.nextSibling) tries to insert OUTSIDE parent.
        // This is safer.

        if (parent.parentNode) {
            parent.parentNode.insertBefore(demandContainer, parent.nextSibling)
            console.info(`Discogs Enhancer: Demand Index (${ratio}) added safely as sibling.`)
        } else {
            // Fallback: append to parent
            parent.appendChild(demandContainer)
        }
    }
}

const parseCount = (text: string): number => {
    // Extract number from string like "Have: 1,234"
    const match = text.match(/[\d,.]+/)
    if (match) {
        return parseInt(match[0].replace(/,/g, ''), 10)
    }
    return 0
}
