export const parsePrice = (priceStr: string): number | null => {
    if (!priceStr || priceStr.toLowerCase().includes('unavailable')) return null

    // Remove "+ " prefix if exists (shipping)
    const cleanStr = priceStr.replace(/^\+\s*/, '')

    // Basic cleanup: remove currency symbols and text
    // Handles: "¥3,500", "$10.00", "€15.20", "CA$50.00", "+ £5.00 shipping"

    // Remove all non-numeric chars except dot and comma
    // Also remove everything after "shipping" or similar text just in case (though regex handles it)
    const numericPart = cleanStr.replace(/[^0-9.,]/g, '')
    if (!numericPart) return null

    // Normalize: remove commas (thousands separator)
    // Assumption: Discogs uses comma as thousands separator in most cases for EN/JP users
    const normalized = numericPart.replace(/,/g, '')

    const val = parseFloat(normalized)
    return isNaN(val) ? null : val
}
