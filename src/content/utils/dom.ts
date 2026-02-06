export const $ = (selector: string, parent: ParentNode = document): HTMLElement | null => {
    return parent.querySelector(selector) as HTMLElement
}

export const $$ = (selector: string, parent: ParentNode = document): HTMLElement[] => {
    return Array.from(parent.querySelectorAll(selector)) as HTMLElement[]
}

export const create = (tag: string, attrs: { [key: string]: string } = {}, children: (string | Node)[] = []): HTMLElement => {
    const el = document.createElement(tag)
    Object.keys(attrs).forEach(key => el.setAttribute(key, attrs[key]))
    children.forEach(child => {
        if (typeof child === 'string') {
            el.appendChild(document.createTextNode(child))
        } else {
            el.appendChild(child)
        }
    })
    return el
}
