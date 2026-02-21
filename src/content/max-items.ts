export const initMaxItemsPerPage = () => {
    const url = new URL(window.location.href)
    const { pathname } = url

    if (!pathname.startsWith('/artist/') && !pathname.startsWith('/label/')) {
        return
    }

    console.info('Discogs Enhancer: Max Items Per Page activated. Waiting for DOM...')

    // Wait until the <select id="show"> appears on the page
    const trySetSelect = () => {
        const select = document.getElementById('show') as HTMLSelectElement | null;
        if (select && select.name === 'show') {
            if (select.value !== '500') {
                console.info('Discogs Enhancer: Found "show" dropdown. Changing from', select.value, 'to 500.')

                // For React 16+, we need to use the native setter to trigger the React onChange
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLSelectElement.prototype,
                    'value'
                )?.set

                if (nativeInputValueSetter) {
                    nativeInputValueSetter.call(select, '500')
                } else {
                    select.value = '500'
                }

                select.dispatchEvent(new Event('change', { bubbles: true }))
            }
            // Once successfully triggered or already 500, we can stop observing
            observer.disconnect()
        }
    }

    // Observe body for injected React/SPA DOM elements
    const observer = new MutationObserver(() => {
        trySetSelect()
    })

    observer.observe(document.body, { childList: true, subtree: true })

    // Attempt immediately in case it's already there
    trySetSelect()
}
