import { getSettings } from '../../utils/storage'
import { $$ } from '../utils/dom'
import { initBlockSellers } from './blockSellers'

export const initMarketplace = () => {
    console.info('Discogs Enhancer: Marketplace module initialized')

    // Check if we are on the marketplace page
    if (!window.location.href.includes('/sell/list') && !window.location.href.includes('/sell/item') && !document.querySelector('.marketplace-table')) {
        return
    }

    // Initialize Block Sellers feature
    initBlockSellers()

    getSettings().then((settings) => {
        if (settings.marketplaceFilter) {
            applyMarketplaceFilter()
        }
    })
}

const applyMarketplaceFilter = () => {
    console.info('Discogs Enhancer: Applying marketplace filter...')

    // Example: Highlight all rows in the marketplace table
    // Discogs uses various table structures, but commonly .marketplace_table tr
    const rows = $$('.marketplace_table tr')
    if (rows.length === 0) {
        // Fallback for newer react-based layouts if any, or different pages
        const items = $$('.marketplace_item') // hypothetical class
        items.forEach(item => {
            item.style.border = '2px solid green'
        })
    }

    rows.forEach(row => {
        row.style.borderLeft = '5px solid #00f'
    })
}
