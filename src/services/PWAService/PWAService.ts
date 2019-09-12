import { SingletonClass } from 'models'
import { isLocalhost } from 'utils'
import { get } from 'lodash'
import { SERVICE_WORKER_STATE, PWAMessages } from 'constants/common'
import { logger as console } from 'utils/logger'

interface PWAConfig {
    onSuccess?: (pwa: PWAService) => void,
    onUpdate?: (registration: ServiceWorkerRegistration) => void
}

interface PWAMessage {
    type: PWAMessages,
    message: string | Array<string>
}

class PWAService extends SingletonClass {
    private worker: ServiceWorker | null
    private navigator: Navigator | null

    public init() {
        this.register()
        // console.log('CREATE-PWA')
        // const pwa = new PWAService()
        // pwa.register()
        // return pwa
    }

    constructor() {
        super()
        this.worker = null
        this.navigator = null
    }

    public  get workerState(): string {
        return get(this, 'worker.state', SERVICE_WORKER_STATE.DISABLED)
    }

    public messageUpdateCache = () => {
        this.sendMessage({
            type: PWAMessages.SET_ADDITIONAL_API_CACHED_RESOURCES,
            message: JSON.stringify({
                host: process.env.BASEURL,
                resources: [
                    process.env.NAVIGATION_PATH,
                    process.env.MAP_MD_FILES
                ]})
        })
    }

    public sendMessage = (message: PWAMessage): boolean => {
        if (get(this.navigator, 'WorkerService.controller') && get(this, 'worker.state') === SERVICE_WORKER_STATE.ACTIVATED) {
            console.message('client => pwa', message.type)
            return get(this.navigator, 'WorkerService.controller').postMessage(message) && true
        } else {
            return false
        }
    }

    public register = (config?: PWAConfig) => {
        if ('serviceWorker' in navigator) {
            // observer.subscribe(ObservableTypes.cacheChanged,  () => {
            //     this.messageUpdateCache()
            // }, this)

            this.navigator = navigator
            // The URL constructor is available in all browsers that support SW.
            const publicUrl = new URL(
                (process as { env: { [key: string]: string } }).env.PUBLIC_URL,
                window.location.href
            );
            if (publicUrl.origin !== window.location.origin) {
                // Our service worker won't work if PUBLIC_URL is on a different origin
                // from what our page is served on. This might happen if a CDN is used to
                // serve assets; see https://github.com/facebook/create-react-app/issues/2374
                return;
            }

            window.addEventListener('load', () => {
                // const swUrl = `${process.env.PUBLIC_URL}/${process.env.SERVICE_WORKER}`
                // const swUrl =  `${process.env.PUBLIC_URL}/swd.js`
                // console.log(process.env.BASEURL)
                const swUrl = '/static/js/worker.chunk.js'

                if (isLocalhost) {
                    // This is running on localhost. Let's check if a service worker still exists or not.
                    this.checkValidServiceWorker(swUrl, config);
                    // Add some additional logging to localhost, pointing developers to the
                    // service worker/PWA documentation.
                    navigator.serviceWorker.ready.then((registration) => {
                        this.worker = registration.active
                        // observer.fire(ObservableTypes.workerChangeState, get(this, 'worker.state', SERVICE_WORKER_STATE.ACTIVATED))
                        // console.event('PWA', ` ${get(registration, 'active.state')}`)
                        if (config && config.onSuccess) {
                            config.onSuccess(this);
                        }
                    });
                } else {
                    // Is not localhost. Just register service worker
                    this.registerValidSW(swUrl, config);
                }
            });
        }
    }

    public unregister = () => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                delete this.navigator
                delete this.worker
                registration.unregister().then(() => {
                    // observer.fire(ObservableTypes.workerChangeState, SERVICE_WORKER_STATE.DISABLED)
                    // console.event('PWA', SERVICE_WORKER_STATE.DISABLED)
                });
            });
        }
    }

    private registerValidSW = (swUrl: string, config?: PWAConfig) => {
                navigator.serviceWorker
                    .register(swUrl)
                    .then(registration => {
                        registration.onupdatefound = () => {
                            const installingWorker = registration.installing;
                            if (installingWorker == null) {
                                return;
                            }

                            this.worker = installingWorker

                            installingWorker.onstatechange = () => {
                                // observer.fire(ObservableTypes.workerChangeState, installingWorker.state)
                                console.event('PWA', ` ${installingWorker.state}`)
                                switch (installingWorker.state) {
                                    case 'installed':
                                        if (navigator.serviceWorker.controller) {
                                            // At this point, the updated precached content has been fetched,
                                            // but the previous service worker will still serve the older
                                            // content until all client tabs are closed.
                                            // Execute callback
                                            if (config && config.onUpdate) {
                                                config.onUpdate(registration);
                                            }
                                        } else {
                                            // At this point, everything has been precached.
                                            // It's the perfect time to display a
                                            // "Content is cached for offline use." message.
                                            console.log('Content is cached for offline use.');
                                            // Execute callback
                                        }
                                        break
                                    case 'activated':
                                        if (config && config.onSuccess) {
                                            config.onSuccess(this);
                                        }
                                        break
                                    default:
                                        break
                                }
                            };
                        };
                    })
                    .catch(error => {
                        console.error('Error during service worker registration:', error);
                    });
    }

    private checkValidServiceWorker(swUrl: string, config?: PWAConfig) {
        // Check if the service worker can be found. If it can't reload the page.
        fetch(swUrl)
            .then((response: any) => {
                //TODO: при загрузке воркера со страниц отличных от index возвращается content-type: TEXT/HTML
                // Ensure service worker exists, and that we really are getting a JS file.
                // const contentType = response.headers.get('content-type');
                if (
                    response.status === 404 // ||
                // (contentType != null && contentType.indexOf('javascript') === -1)
                ) {
                    // No service worker found. Probably a different app. Reload the page.
                    navigator.serviceWorker.ready.then(registration => {
                        registration.unregister().then(() => {
                            window.location.reload();
                        });
                    });
                } else {

                    // Service worker found. Proceed as normal.
                    this.registerValidSW(swUrl, config);
                }
            })
            .catch(() => {
                console.log(
                    'No internet connection found. App is running in offline mode.'
                );
            });
    }
}

export {
    PWAMessages,
    PWAService
}
