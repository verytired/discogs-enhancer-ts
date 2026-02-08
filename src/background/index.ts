import { generateSearchUrl } from '../utils/search'

console.info('Discogs Enhancer: Background script loaded')

chrome.runtime.onInstalled.addListener(() => {
    console.info('Discogs Enhancer: Extension installed')

    // Create context menu for selected text
    chrome.contextMenus.create({
        id: 'search-on-discogs',
        title: 'Search "%s" on Discogs',
        contexts: ['selection'],
    })
})

chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === 'search-on-discogs' && info.selectionText) {
        const url = generateSearchUrl(info.selectionText)
        chrome.tabs.create({ url })
    }
})
