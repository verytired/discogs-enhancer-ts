import { parsePrice } from '../../utils/currency'

export const initSortByTotal = () => {
    // Check if we are on marketplace
    if (!document.querySelector('.marketplace_table')) return

    injectSortButton()
}

const injectSortButton = () => {
    const target = document.querySelector('.pagination.top, .marketplace_pagination')
    if (!target) return

    if (document.getElementById('sort-total-btn')) return

    const btn = document.createElement('button')
    btn.id = 'sort-total-btn'
    // Use Discogs button styles if possible
    btn.className = 'button button_small'
    btn.textContent = 'Sort by Total Price'
    btn.style.marginLeft = '10px'
    btn.style.cursor = 'pointer'
    btn.style.border = '1px solid #ccc'
    btn.style.background = '#f0f0f0'
    btn.style.padding = '4px 8px'
    btn.style.borderRadius = '3px'

    btn.onclick = (e) => {
        e.preventDefault()
        sortItems()
    }

    target.appendChild(btn)
}

const sortItems = () => {
    const table = document.querySelector('.marketplace_table')
    if (!table) return

    const tbody = table.querySelector('tbody') || table
    const rows = Array.from(tbody.querySelectorAll('tr.shortcut_navigable'))

    // Perform sort
    rows.sort((a, b) => {
        const priceA = getTotalPrice(a as HTMLElement)
        const priceB = getTotalPrice(b as HTMLElement)

        // Push unavailable shipping to bottom
        if (priceA === null) return 1
        if (priceB === null) return -1

        return priceA - priceB
    })

    // Re-append rows in sorted order
    // Note: This removes them from their current position and appends them to the end of tbody
    // Effectively reordering them.
    rows.forEach(row => tbody.appendChild(row))
}

const getTotalPrice = (row: HTMLElement): number | null => {
    const priceEl = row.querySelector('.price')
    const shippingEl = row.querySelector('.item_shipping')

    if (!priceEl) return null

    const priceText = priceEl.textContent || ''
    const shippingText = shippingEl?.textContent || ''

    const price = parsePrice(priceText)
    // shipping text often includes "+ " and " shipping", parsePrice handles this
    const shipping = parsePrice(shippingText)

    if (price === null) return null

    // If shipping is unavailable (null from parser), and text says unavailable
    if (shipping === null && shippingText.toLowerCase().includes('unavailable')) {
        return null // Push to bottom
    }

    // If shipping is null (e.g. empty string), treat as 0? Or is it safer to assume blocking?
    // Usually empty string means free or included? Or just missing.
    // Let's assume 0 if not explicitly unavailable
    return price + (shipping || 0)
}
