import { $, $$, create } from '../../content/utils/dom'
import { getSettings } from '../../utils/storage'

export const initDemandIndex = () => {
    getSettings().then((settings) => {
        if (settings.demandIndex) {
            // Try immediately
            applyDemandIndex()

            // And retry a few times to handle async loading
            setTimeout(applyDemandIndex, 1000)
            setTimeout(applyDemandIndex, 3000)
        }
    })
}

const applyDemandIndex = () => {
    console.info('Discogs Enhancer: Applying Demand Index...')

    // Strategy 1: Legacy Layout (.statistics .section_content)
    let statsSection = $('.statistics .section_content')

    // Strategy 2: Newer Layout (often just .statistics or within a grid)
    if (!statsSection) {
        const allDivs = $$('div')
        const found = allDivs.find(div => {
            const text = div.textContent || ''
            return text.includes('Have:') && text.includes('Want:') && (div.classList.contains('section_content') || div.classList.contains('statistics'))
        })
        if (found) statsSection = found

        // DEBUG: Logic to help identify the structure if still not found
        if (!statsSection) {
            console.log('DEBUG: Stats section not found with class check. Searching all elements with Have/Want...')
            const allElements = $$('*')
            const potentialMatches = allElements.filter(el => {
                return el.children.length > 0 && el.innerText?.includes('Have:') && el.innerText?.includes('Want:')
            })
            console.log('DEBUG: Potential matches found:', potentialMatches)
            if (potentialMatches.length > 0) {
                // Try to catch the smallest container
                statsSection = potentialMatches[potentialMatches.length - 1] // often the last one is the most specific container
                console.log('DEBUG: Selecting most specific container:', statsSection)
            }
        }
    }

    if (!statsSection) {
        console.warn('Discogs Enhancer: Statistics section not found yet.')
        return
    }

    // Check if already applied to avoid duplicates
    if ($('.discogs-enhancer-demand-index', statsSection)) return

    const items = $$('li', statsSection)
    // Fallback if not UL/LI, try searching text nodes or other structures if necessary

    let haveCount = 0
    let wantCount = 0

    items.forEach(item => {
        const text = item.textContent || ''
        if (text.includes('Have:') && !text.includes('Demand Index')) {
            haveCount = parseCount(text)
        } else if (text.includes('Want:')) {
            wantCount = parseCount(text)
        }
    })

    if (haveCount > 0) {
        const ratio = (wantCount / haveCount).toFixed(2)

        // Anti-Crash Strategy:
        // Do NOT append directly to the React-managed 'statsSection' (the <ul>).
        // Instead, find its parent and insert a sibling, or create a safe container.

        // If statsSection is UL, its parent is often div.section_content
        const parent = statsSection.parentNode
        if (parent) {
            // Check if we already added our container
            if ($('.discogs-enhancer-demand-container', parent as HTMLElement)) return

            const demandContainer = create('div', {
                class: 'discogs-enhancer-demand-container',
                style: 'padding: 5px 0; font-size: 13px; margin-top: 5px;'
            }, [
                create('span', { class: 'link_text' }, ['Demand Index: ']),
                create('span', { style: 'font-weight: bold; color: #f00; margin-left: 5px;' }, [ratio])
            ])

            // Insert after the stats section (the UL)
            parent.insertBefore(demandContainer, statsSection.nextSibling)
            console.info(`Discogs Enhancer: Demand Index (${ratio}) added safely as sibling.`)
        } else {
            console.warn('Discogs Enhancer: Parent of stats section not found, cannot safely inject.')
        }
    }
}

const parseCount = (text: string): number => {
    // Extract number from string like "Have: 1,234"
    const match = text.match(/[\d,]+/)
    if (match) {
        return parseInt(match[0].replace(/,/g, ''), 10)
    }
    return 0
}
