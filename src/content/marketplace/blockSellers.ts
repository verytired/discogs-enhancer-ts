import { $$ } from '../utils/dom'
import { getBlockList, addBlockedSeller } from '../../utils/storage'

export async function initBlockSellers() {
    // Initial run
    const blockList = await getBlockList()
    applyBlockList(blockList)
    addBlockButtons()

    // Observe changes (for pagination or dynamic loading)
    const observer = new MutationObserver(() => {
        // Re-fetch blocklist just in case
        getBlockList().then(list => {
            applyBlockList(list)
            addBlockButtons()
        })
    })

    const table = document.querySelector('.marketplace_table') || document.body
    observer.observe(table, { childList: true, subtree: true })
}

function applyBlockList(blockedSellers: string[]) {
    // Target both table rows (classic) and potential new layouts
    const items = $$('.marketplace_table tr.shortcut_navigable, .mp-items tr')

    items.forEach(row => {
        const sellerLink = row.querySelector('.seller_info a, .seller_block a')
        if (sellerLink) {
            const sellerName = sellerLink.textContent?.trim()
            if (sellerName && blockedSellers.includes(sellerName)) {
                row.style.display = 'none'
            }
        }
    })
}

function addBlockButtons() {
    const items = $$('.marketplace_table tr.shortcut_navigable, .mp-items tr')

    items.forEach(row => {
        // Avoid duplicate buttons
        if (row.querySelector('.discogs-enhancer-block-btn')) return

        const sellerInfo = row.querySelector('.seller_info, .seller_block') as HTMLElement
        if (sellerInfo) {
            const sellerLink = sellerInfo.querySelector('a')
            const sellerName = sellerLink?.textContent?.trim()

            if (sellerName) {
                const btn = document.createElement('button')
                btn.className = 'discogs-enhancer-block-btn'
                btn.textContent = 'Block'
                btn.title = 'Block this seller'
                btn.style.marginLeft = '6px'
                btn.style.fontSize = '9px'
                btn.style.padding = '2px 4px'
                btn.style.lineHeight = '1'
                btn.style.cursor = 'pointer'
                btn.style.border = '1px solid #ccc'
                btn.style.borderRadius = '3px'
                btn.style.backgroundColor = '#f8f8f8'
                btn.style.color = '#333'

                btn.onclick = async (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (confirm(`Are you sure you want to block seller "${sellerName}"?`)) {
                        await addBlockedSeller(sellerName)
                        row.style.display = 'none'
                    }
                }

                // Append after the seller link
                if (sellerLink && sellerLink.nextSibling) {
                    sellerInfo.insertBefore(btn, sellerLink.nextSibling)
                } else {
                    sellerInfo.appendChild(btn)
                }
            }
        }
    })
}
