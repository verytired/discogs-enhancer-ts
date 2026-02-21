/// <reference types="chrome" />

export interface UserSettings {
    darkMode: boolean
    marketplaceFilter: boolean
    demandIndex: boolean
    hideAppleMusic: boolean
    infiniteScroll: boolean
    maxItemsPerPage: boolean
}

const defaultSettings: UserSettings = {
    darkMode: false,
    marketplaceFilter: false,
    demandIndex: true,
    hideAppleMusic: true, // Hide by default
    infiniteScroll: true,
    maxItemsPerPage: true,
}

export const getSettings = (): Promise<UserSettings> => {
    return new Promise((resolve) => {
        chrome.storage.local.get(defaultSettings as unknown as { [key: string]: unknown }, (items) => {
            resolve(items as unknown as UserSettings)
        })
    })
}

export const saveSettings = (settings: Partial<UserSettings>): Promise<void> => {
    return new Promise((resolve) => {
        chrome.storage.local.set(settings, () => {
            resolve()
        })
    })
}

export const watchSettings = (callback: (changes: Partial<UserSettings>) => void) => {
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local') {
            const newSettings: Partial<UserSettings> = {}
            for (const key in changes) {
                if (Object.prototype.hasOwnProperty.call(changes, key)) {
                    newSettings[key as keyof UserSettings] = changes[key].newValue as boolean | undefined
                }
            }
            callback(newSettings)
        }
    })
}

// Blocklist helpers
export const getBlockList = async (): Promise<string[]> => {
    return new Promise((resolve) => {
        chrome.storage.local.get(['blockedSellers'], (result) => {
            resolve((result.blockedSellers || []) as string[])
        })
    })
}

export const addBlockedSeller = async (sellerName: string): Promise<string[]> => {
    const list = await getBlockList()
    if (!list.includes(sellerName)) {
        const updated = [...list, sellerName]
        await chrome.storage.local.set({ blockedSellers: updated })
        return updated
    }
    return list
}

export const removeBlockedSeller = async (sellerName: string): Promise<string[]> => {
    const list = await getBlockList()
    const updated = list.filter((s) => s !== sellerName)
    await chrome.storage.local.set({ blockedSellers: updated })
    return updated
}
