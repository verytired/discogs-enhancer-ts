import { getSettings, watchSettings } from '../utils/storage'
import './styles/dark-mode.css'
import { initMarketplace } from './marketplace'
import { initDemandIndex } from './demand-index'
import { initAppleMusic, applyAppleMusicState } from './apple-music'

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
})

initMarketplace()
initDemandIndex()
initAppleMusic()

// Watch for changes
watchSettings((changes) => {
    if (changes.darkMode !== undefined) {
        applyDarkMode(changes.darkMode!)
    }
    if (changes.hideAppleMusic !== undefined) {
        applyAppleMusicState(changes.hideAppleMusic!)
    }
})

// Example of interaction
const observer = new MutationObserver(() => {
    // Logic to detect page changes (e.g., AutoPagerize) will go here
})

observer.observe(document.body, {
    childList: true,
    subtree: true,
})
