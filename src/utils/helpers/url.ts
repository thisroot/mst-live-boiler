import { REGEXP }from "constants/common"
import { isEmpty } from 'lodash'

/**
 * is current location matches routePattern with subRoutes
 *
 * for example a routePattern is '/compaigns'
 * currentLoaction '/campaigns' => true
 * currentLoaction '/campaigns/' => true
 * currentLoaction '/campaigns/campaignId' => true
 * currentLoaction '/campaignsUser' => false
 */
function testNestedRoutes(routePattern: string, curretLocation: string): boolean {
    /* remove trailing slash */
    const location = curretLocation.replace(/\/$/, '')
    return new RegExp(`^${routePattern}(?=$|/)`, 'i').test(location)
}

function isValidUrl(url: string): boolean {
    return !isEmpty(url.match(REGEXP.urlHostname))
}

function isOuterURL (url: string): boolean {
    let currentHost = typeof window !== "undefined" ? window.location.hostname : process.env.PUBLIC_URL
    if(isValidUrl(url)) {
        return !url.includes(currentHost)
    } else {
        return false
    }
}

function clearUrl(str: string) {
    return str.toString().toLowerCase()
        .replace(/\/\/+/g, '/') // Replace multiple / with single /
        .replace(/^\/+/, '') // Trim / from start of text
        .replace(/\/+$/, '') // Trim / from end of text
}

export {
    testNestedRoutes,
    isValidUrl,
    isOuterURL,
    clearUrl
}
