import { getSettings, watchSettings } from '../../utils/storage'
import { $$ } from '../utils/dom'
import { initBlockSellers } from './blockSellers'
import { initSortByTotal } from './sort'
import { initInfiniteScroll } from './infiniteScroll'

export const initMarketplace = () => {
    console.info('Discogs Enhancer: Marketplace module initialized')

    // Check if we are on the marketplace page
    if (!window.location.href.includes('/sell/list') && !window.location.href.includes('/sell/item') && !document.querySelector('.marketplace-table')) {
        return
    }

    // Initialize Block Sellers feature
    initBlockSellers()
    initSortByTotal()

    getSettings().then((settings) => {
        if (settings.marketplaceFilter) {
            initMarketplaceFilter()
        }
        initInfiniteScroll(settings.infiniteScroll)
    })

    watchSettings((changes) => {
        if (changes.marketplaceFilter !== undefined) {
            if (changes.marketplaceFilter) {
                initMarketplaceFilter()
            } else {
                removeMarketplaceFilter()
            }
        }
        if (changes.infiniteScroll !== undefined) {
            initInfiniteScroll(changes.infiniteScroll)
        }
    })
}

let marketplaceFilterActive = false

const initMarketplaceFilter = () => {
    if (marketplaceFilterActive) return
    marketplaceFilterActive = true
    console.info('Discogs Enhancer: Applying marketplace filter...')

    // Example: Highlight all rows in the marketplace table
    const rows = $$('.marketplace_table tr')
    rows.forEach(row => {
        row.style.borderLeft = '5px solid #00f'
    })
}

const removeMarketplaceFilter = () => {
    if (!marketplaceFilterActive) return
    marketplaceFilterActive = false
    console.info('Discogs Enhancer: Removing marketplace filter...')

    const rows = $$('.marketplace_table tr')
    rows.forEach(row => {
        row.style.borderLeft = ''
    })
}
