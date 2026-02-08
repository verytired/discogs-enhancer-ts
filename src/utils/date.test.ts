import { expect, test } from 'vitest'
import { formatToActualDate } from './date'

test('formatToActualDate', () => {
    expect(formatToActualDate('2023-01-01 12:00:00')).toBe('2023-01-01')
    expect(formatToActualDate('2022-12-31')).toBe('2022-12-31')
    expect(formatToActualDate('Posted: 2023/10/05')).toBe('2023-10-05')
    expect(formatToActualDate('invalid')).toBe('')
    expect(formatToActualDate('')).toBe('')
})
