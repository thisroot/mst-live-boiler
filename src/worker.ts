interface Window extends ServiceWorkerGlobalScope {
    workbox: any,
    __precacheManifest: any
}

// declare var self: Window
declare const workbox: typeof import("workbox-sw")



/* global workbox */
/* eslint-disable no-restricted-globals */
const SET_ADDITIONAL_API_CACHED_RESOURCES = 'SET_ADDITIONAL_API_CACHED_RESOURCES'

self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting())
})
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()))

workbox.setConfig({ debug: false })

const md = new RegExp('^((http|https)\://)?(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])\/.*\.md$')

/* injection point for manifest files.  */
workbox.precaching.precacheAndRoute([])
workbox.precaching.precacheAndRoute(self.__precacheManifest)

workbox.routing.registerNavigationRoute(
    workbox.precaching.getCacheKeyForURL('/index.html')
)

const handlerCb = ({ event }) => {
    const cacheFirst = new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'md-files'
        // plugins: [
        //   new workbox.broadcastUpdate.Plugin({
        //     channelName: 'md-update',
        //   }),
        // ]
    })
    return event.respondWith(cacheFirst.makeRequest({ request: event.request }))
}
// селектор md файлов
workbox.routing.registerRoute(md, handlerCb)

self.addEventListener('fetch', (event) => {
    if(event && event.request) {
        if (!event.request.url.includes('chrome-extension://')) {
            const cacheFirst = new workbox.strategies.StaleWhileRevalidate({ cacheName: 'other-caches' })
            event.respondWith(cacheFirst.makeRequest({ request: event.request }))
        }
    }
})

// StaleWhileRevalidate - если есть в кеше запрашиваем из кеша, а по сети обновляем данные кеша, используется,
// когда нет жесткой необходимости в точности данных
// кешируем скрипты
workbox.routing.registerRoute(
    /\.(?:js|css)$/,
    new workbox.strategies.StaleWhileRevalidate({ cacheName: 'static-scripts' })
)

//кешируем статический контент
workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|ico)$/,
    new workbox.strategies.CacheFirst({ cacheName: "static-files" })
)

// // обработчик ошибок возможно понадобится
workbox.routing.setCatchHandler(async ({ event }) => {
    switch (event.request.destination) {
        default:
            // If we don't have a fallback, just return an error response.
            return Response.redirect('./index.md')
    }
})

self.addEventListener('message', (event: any) => {
    if (event.data.message &&
        event.data.message.length > 0) {
        switch (event.data.type) {
            case SET_ADDITIONAL_API_CACHED_RESOURCES:
                const message = JSON.parse(event.data.message)
                if (Array.isArray(message.resources)) {
                    message.resources.forEach((item) => {
                        const url = `${ message.host }/${ item }`
                        event.waitUntil(caches.open('other-caches').then((cache) => cache.add(url)))
                        self.fetch(url).then((result) => {
                            return result.json()
                        }).then(data => {
                            const urls = getURLArray(data).map(url => `${ message.host }${ url }`)
                            event.waitUntil(caches.open('md-files').then((cache) => cache.addAll(urls)))
                        })
                    })
                }
                break
        }
    }
})

// @ts-ignore
function getURLArray(arr: any) {
    const res = []
    if (arr && arr.length > 0) {
        arr.forEach(item => {
            item.url && res.push(item.url)
            if (item.children && item.children.length > 0) {
                res.push(...getURLArray(item.children))
            }
        })
        return res
    }
}
