console.info('Discogs Enhancer: Background script loaded')

chrome.runtime.onInstalled.addListener(() => {
    console.info('Discogs Enhancer: Extension installed')
})
