import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSettings, saveSettings, type UserSettings } from './storage'

// Mock chrome API
const mockStorage = {
    get: vi.fn(),
    set: vi.fn(),
    onChanged: {
        addListener: vi.fn(),
    },
}

global.chrome = {
    storage: {
        local: mockStorage,
    } as unknown as chrome.storage.LocalStorageArea,
} as unknown as typeof chrome

describe('Storage Utils', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('getSettings', () => {
        it('should return settings from storage', async () => {
            const mockSettings: UserSettings = {
                darkMode: true,
                marketplaceFilter: false,
                demandIndex: true,
                hideAppleMusic: false,
            }

            mockStorage.get.mockImplementation((_defaults, callback) => {
                callback(mockSettings)
            })

            const settings = await getSettings()
            expect(settings).toEqual(mockSettings)
            expect(mockStorage.get).toHaveBeenCalled()
        })
    })

    describe('saveSettings', () => {
        it('should save settings to storage', async () => {
            const newSettings = { darkMode: true }

            mockStorage.set.mockImplementation((_items, callback) => {
                callback()
            })

            await saveSettings(newSettings)
            expect(mockStorage.set).toHaveBeenCalledWith(newSettings, expect.any(Function))
        })
    })
})
