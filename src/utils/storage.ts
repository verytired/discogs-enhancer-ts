/// <reference types="chrome" />

export interface UserSettings {
    darkMode: boolean
    marketplaceFilter: boolean
    demandIndex: boolean
    hideAppleMusic: boolean
    // Add more settings here
}

const defaultSettings: UserSettings = {
    darkMode: false,
    marketplaceFilter: false,
    demandIndex: true,
    hideAppleMusic: true, // Hide by default
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
