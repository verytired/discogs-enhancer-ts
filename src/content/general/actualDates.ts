import { $$ } from '../utils/dom'
import { formatToActualDate } from '../../utils/date'

// Selectors for elements containing relative dates
// - .date on release page
// - .m_posted, .posted on marketplace
// - time elements (modern Discogs)
const DATE_SELECTORS = '.date, .m_posted, .posted, time'

export function initActualDates() {
    // Initial run
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => applyDates())
    } else {
        applyDates()
    }

    const observer = new MutationObserver(() => {
        applyDates()
    })

    observer.observe(document.body, { childList: true, subtree: true })
}

function applyDates() {
    const elements = $$(DATE_SELECTORS)

    elements.forEach((el) => {
        // Prevent double processing
        if (el.hasAttribute('data-actual-date-processed')) return

        // Try to find the date string
        let dateStr = el.getAttribute('title') || el.getAttribute('datetime')

        // Check text content if title is missing (sometimes "YYYY-MM-DD" is text)
        // But we want to convert RELATIVE dates, so if text is absolute, we might skip?
        // Let's stick to title/datetime for reliability first.

        if (!dateStr) return

        const formatted = formatToActualDate(dateStr)
        if (!formatted) return

        // Mark as processed BEFORE appending to avoid loops
        el.setAttribute('data-actual-date-processed', 'true')

        // Create actual date element
        const span = document.createElement('span')
        span.className = 'discogs-enhancer-actual-date'
        span.textContent = ` (${formatted})`
        span.style.fontSize = '0.9em'
        span.style.color = 'inherit'
        span.style.opacity = '0.8'
        span.style.marginLeft = '4px'

        // Append
        el.appendChild(span)
    })
}
