import { describe, it, expect, vi, beforeEach } from 'vitest'
import { addBlockedSeller, getBlockList, removeBlockedSeller } from './storage'

// Mock chrome.storage.local
const storageMock = new Map()

global.chrome = {
    storage: {
        local: {
            get: vi.fn((keys, callback) => {
                const result: any = {}
                if (Array.isArray(keys)) {
                    keys.forEach(k => result[k] = storageMock.get(k))
                } else if (typeof keys === 'string') {
                    result[keys] = storageMock.get(keys)
                } else {
                    // Null/undefined keys -> return all
                    // simplified for this test
                }
                callback(result)
            }),
            set: vi.fn((items, callback) => {
                Object.entries(items).forEach(([k, v]) => storageMock.set(k, v))
                if (callback) callback()
            })
        },
        onChanged: {
            addListener: vi.fn()
        }
    }
} as any

describe('Block List Storage', () => {
    beforeEach(() => {
        storageMock.clear()
        vi.clearAllMocks()
    })

    it('should add a seller to the block list', async () => {
        await addBlockedSeller('BadSeller123')
        const list = await getBlockList()
        expect(list).toContain('BadSeller123')
        expect(list).toHaveLength(1)
    })

    it('should not add duplicate sellers', async () => {
        await addBlockedSeller('BadSeller123')
        await addBlockedSeller('BadSeller123')
        const list = await getBlockList()
        expect(list).toHaveLength(1)
    })

    it('should remove a seller', async () => {
        await addBlockedSeller('SellerA')
        await addBlockedSeller('SellerB')
        await removeBlockedSeller('SellerA')
        const list = await getBlockList()
        expect(list).not.toContain('SellerA')
        expect(list).toContain('SellerB')
    })
})
