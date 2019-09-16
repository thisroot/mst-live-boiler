let isLocalhost: boolean
if(typeof window !== "undefined") { isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
); } else {
    isLocalhost = true
}


function makeHash(blocks: number = 1): string {
    let hash = ''
    while (blocks) {
        hash += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        --blocks
    }
    return hash
}

/**
 * extend string with params
 * usage:  formatString(string, 'param1', 'param2')
 * @return {String} formatted string | default string | logs a warning message
 */
function formatString(text: string, ...args: any[]): string {
    if (!args.length) return ''// console.warn('No arguments has been specified');
    return text.replace(/{(\d+)}/g, (_match, number) => (
        (typeof args[number] !== 'undefined' && args[number] !== null) ? args[number] : ''
    ))
}

function formatLink(title: string, path: string, key: string = makeHash(4)) {
    return `<Link key="${key}" to="${path}">${title}</Link>`
}

/* token parser */
function parseJwt(token) {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace('-', '+').replace('_', '/')
    return JSON.parse(window.atob(base64))
}

export {
    makeHash,
    formatString,
    formatLink,
    parseJwt,
    isLocalhost
}


