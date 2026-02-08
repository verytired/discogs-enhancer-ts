export let isInfiniteScrollEnabled = false
let isLoading = false
let observer: IntersectionObserver | null = null

export function initInfiniteScroll(enabled: boolean) {
    isInfiniteScrollEnabled = enabled

    if (!enabled) {
        if (observer) {
            observer.disconnect()
            observer = null
        }
        return
    }

    // Check if on marketplace list
    const table = document.querySelector('.marketplace_table, .mp-items')
    if (!table) return

    setupObserver()
}

function setupObserver() {
    if (observer) observer.disconnect()

    // Find pagination at bottom
    // Discogs has top and bottom pagination. We want the bottom one to trigger load.
    const pagination = document.querySelector('.pagination.bottom, .marketplace_pagination')
    if (!pagination) return

    observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading) {
            loadNextPage()
        }
    }, { rootMargin: '400px' }) // Start loading well before bottom

    observer.observe(pagination)
}

async function loadNextPage() {
    // Discogs uses .pagination_next for "Next" button
    const nextLink = document.querySelector('a.pagination_next, .pagination_next a') as HTMLAnchorElement
    if (!nextLink) {
        if (observer) observer.disconnect()
        return
    }

    isLoading = true
    const originalText = nextLink.textContent
    nextLink.textContent = 'Loading more items...'
    nextLink.style.opacity = '0.5'

    try {
        const res = await fetch(nextLink.href)
        const html = await res.text()
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')

        // Selector for item rows. Usually 'tr.shortcut_navigable' in standard marketplace table.
        const newRows = doc.querySelectorAll('.marketplace_table tbody tr.shortcut_navigable, .mp-items tr')
        const tbody = document.querySelector('.marketplace_table tbody') || document.querySelector('.mp-items tbody') || document.querySelector('.mp-items')

        if (newRows.length && tbody) {
            newRows.forEach(row => {
                // Import node to ensure it belongs to current document (though appendChild usually handles this)
                tbody.appendChild(row)
            })

            // Update next link for next iteration
            const newNext = doc.querySelector('a.pagination_next, .pagination_next a') as HTMLAnchorElement

            if (newNext) {
                nextLink.href = newNext.href

                // Replace pagination block at bottom to update links
                const newPagination = doc.querySelector('.pagination.bottom, .marketplace_pagination')
                const oldPagination = document.querySelector('.pagination.bottom, .marketplace_pagination')
                if (newPagination && oldPagination) {
                    oldPagination.innerHTML = newPagination.innerHTML
                    // Need to re-observe if element changed? 
                    // No, invalidating innerHTML shouldn't break the observer on the container itself 
                    // unless we replaced the container.
                }

            } else {
                nextLink.remove()
                if (observer) observer.disconnect()
            }
        }
    } catch (err) {
        console.error('Discogs Enhancer: Failed to load next page', err)
    } finally {
        isLoading = false
        if (nextLink) {
            nextLink.textContent = originalText
            nextLink.style.opacity = '1'
        }
    }
}
