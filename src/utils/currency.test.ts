import { expect, test } from 'vitest'
import { parsePrice } from './currency'

test('parsePrice', () => {
    expect(parsePrice('¥3,500')).toBe(3500)
    expect(parsePrice('€15.00')).toBe(15)
    expect(parsePrice('£2.50')).toBe(2.5)
    expect(parsePrice('CA$50.00')).toBe(50)
    expect(parsePrice('US$1,200.00')).toBe(1200)
    expect(parsePrice('+ £5.00 shipping')).toBe(5)
    expect(parsePrice('Shipping: unavailable')).toBe(null) // Should return null
    expect(parsePrice('About €10.00')).toBe(10)
    expect(parsePrice('total: $15.00')).toBe(15)
})
