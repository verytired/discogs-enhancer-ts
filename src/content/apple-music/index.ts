import { getSettings } from '../../utils/storage'

let appleMusicStyle: HTMLStyleElement | null = null

export const initAppleMusic = () => {
    getSettings().then((settings) => {
        applyAppleMusicState(settings.hideAppleMusic)
    })
}

export const applyAppleMusicState = (shouldHide: boolean) => {
    // If shouldHide is true, we want to hide it -> Add hiding style
    // If shouldHide is false, we want to see it -> Remove hiding style

    if (shouldHide) {
        if (!appleMusicStyle) {
            appleMusicStyle = document.createElement('style')
            // Selector for Apple Music player/container.
            // Discogs typically embeds Apple Music via iframe or specific div containers.
            // Common selectors: #apple-music-player, .apple-music-player, iframe[src*="apple.com"]
            // Also looking for sidebar implementations.

            appleMusicStyle.textContent = `
                iframe[src*="apple.com"],
                iframe[src*="itunes.apple.com"],
                div[class*="apple-music"],
                #apple-music-player {
                    display: none !important;
                }
            `
            document.head.appendChild(appleMusicStyle)
            console.info('Discogs Enhancer: Apple Music hidden')
        }
    } else {
        if (appleMusicStyle) {
            appleMusicStyle.remove()
            appleMusicStyle = null
            console.info('Discogs Enhancer: Apple Music shown')
        }
    }
}
