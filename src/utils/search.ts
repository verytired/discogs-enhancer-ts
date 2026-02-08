/**
 * Generates a Discogs search URL for the given query.
 * @param query The text to search for
 * @returns The formatted Discogs search URL
 */
export const generateSearchUrl = (query: string): string => {
    const encodedQuery = encodeURIComponent(query.trim())
    return `https://www.discogs.com/search/?q=${encodedQuery}&type=all`
}
