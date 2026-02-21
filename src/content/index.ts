import { getSettings, watchSettings } from '../utils/storage'
import './styles/dark-mode.css'
import { initMarketplace } from './marketplace'
import { initDemandIndex, removeDemandIndex } from './demand-index'
import { initAppleMusic, applyAppleMusicState } from './apple-music'
import { initActualDates } from './general/actualDates'
import { initMaxItemsPerPage } from './max-items'

console.info('Discogs Enhancer: Content script loaded')

const applyDarkMode = (isEnabled: boolean) => {
    if (isEnabled) {
        document.body.classList.add('discogs-enhancer-dark-mode')
    } else {
        document.body.classList.remove('discogs-enhancer-dark-mode')
    }
}

// Initial load
getSettings().then((settings) => {
    applyDarkMode(settings.darkMode)

    if (settings.maxItemsPerPage) {
        initMaxItemsPerPage()
    }
})

initMarketplace()
initDemandIndex()
initAppleMusic()
initActualDates()

// Watch for changes
watchSettings((changes) => {
    if (changes.darkMode !== undefined) {
        applyDarkMode(changes.darkMode!)
    }
    if (changes.hideAppleMusic !== undefined) {
        applyAppleMusicState(changes.hideAppleMusic!)
    }
    if (changes.demandIndex !== undefined) {
        if (changes.demandIndex) {
            initDemandIndex()
        } else {
            removeDemandIndex()
        }
    }
})

// Basic debounce to prevent too many calls
let timeoutId: NodeJS.Timeout | undefined
const observer = new MutationObserver(() => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
        // Re-apply demand index on DOM changes (e.g. navigation, lazy load)
        initDemandIndex()
    }, 500)
})

observer.observe(document.body, {
    childList: true,
    subtree: true,
})
