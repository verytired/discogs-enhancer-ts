export const formatToActualDate = (dateString: string): string => {
    if (!dateString) return ''

    // Clean up input if necessary (e.g. remove "Updated: ")
    const cleanStr = dateString.replace(/^Updated: /, '').replace(/^Posted: /, '')

    const d = new Date(cleanStr)

    if (isNaN(d.getTime())) {
        // If date parsing fails, return empty or original?
        // Let's return empty to be safe
        return ''
    }

    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}
