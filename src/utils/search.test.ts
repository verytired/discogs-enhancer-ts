import { describe, it, expect } from 'vitest'
import { generateSearchUrl } from './search'

describe('Search Utils', () => {
    it('should generate a valid Discogs search URL', () => {
        expect(generateSearchUrl('Beatles')).toBe('https://www.discogs.com/search/?q=Beatles&type=all')
    })

    it('should encode special characters in query', () => {
        expect(generateSearchUrl('AC/DC')).toBe('https://www.discogs.com/search/?q=AC%2FDC&type=all')
    })

    it('should trim whitespace', () => {
        expect(generateSearchUrl('  Daft Punk  ')).toBe('https://www.discogs.com/search/?q=Daft%20Punk&type=all')
    })
})
