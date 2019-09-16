import { SingletonClass } from 'models'
import { isLocalhost } from 'utils'
import { inject } from "react-ioc"
import { get } from 'lodash'
import { PWAMessages, SERVICE_WORKER_STATE } from 'constants/common'
import { logger as console } from 'utils/logger'
import { action, observable } from "mobx"
import { EventService, EventTypes } from 'services/EventsService'

interface PWAConfig {
    onSuccess?: (worker: ServiceWorker, event: Event) => void,
    onUpdate?: (worker: ServiceWorker, event: Event) => void
}

interface PWAMessage {
    type: PWAMessages,
    message: string | Array<string>
}

class PWAService extends SingletonClass {

    @inject eventService: EventService

    @observable
    public workerState: string = 'disabled'

    private worker: ServiceWorker | null
    private navigator: Navigator | null

    @action
    public init() {
        this.register()
    }

    constructor() {
        super()
        this.worker = null
        this.navigator = null
    }

    @action
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

    @action
    public sendMessage = (message: PWAMessage): boolean => {
        if (get(this.navigator, 'WorkerService.controller') && get(this, 'worker.state') === SERVICE_WORKER_STATE.ACTIVATED) {
            console.log('message', message.type)
            return get(this.navigator, 'WorkerService.controller').postMessage(message) && true
        } else {
            return false
        }
    }

    @action
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
                const swUrl =  `${process.env.PUBLIC_URL}/worker.js`
                if (isLocalhost) {
                    // This is running on localhost. Let's check if a service worker still exists or not.
                    this.checkValidServiceWorker(swUrl);
                    // Add some additional logging to localhost, pointing developers to the
                    // service worker/PWA documentation.
                    navigator.serviceWorker.ready.then((registration) => {
                        this.worker = registration.active
                        this.workerState = this.worker.state
                        // по сути штука не нужная в рамках сервисов, так как они и так связаны друг с другом и могут отслеживать изменение состояний
                        this.eventService.fire(EventTypes.cacheChanged)
                        this.worker.onstatechange = this.onWorkerStateChange(config)
                    });
                } else {
                    // Is not localhost. Just register service worker
                    this.registerValidSW(swUrl);
                }
            });
        }
    }
    @action
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

    @action
    private registerValidSW = (swUrl: string) => {
                navigator.serviceWorker
                    .register(swUrl)
                    .then(registration => {
                        registration.onupdatefound = () => {
                            const installingWorker = registration.installing;
                            if (installingWorker == null) {
                                return;
                            }
                            this.worker = installingWorker
                            this.workerState = this.worker.state
                            this.eventService.fire(EventTypes.cacheChanged)
                            this.worker.onstatechange = this.onWorkerStateChange()
                        };
                    })
                    .catch(error => {
                        console.error('Error during service worker registration:', error);
                    });
    }

    @action
    private checkValidServiceWorker(swUrl: string) {
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
                    this.registerValidSW(swUrl);
                }
            })
            .catch(() => {
                console.log(
                    'No internet connection found. App is running in offline mode.'
                );
            });
    }

    @action
    private onWorkerStateChange = (config?: PWAConfig) => {
        return (event: Event): void => {
            // observer.fire(ObservableTypes.workerChangeState, installingWorker.state)
            switch (this.worker.state) {
                case 'installed':
                    if (navigator.serviceWorker.controller) {
                        // At this point, the updated precached content has been fetched,
                        // but the previous service worker will still serve the older
                        // content until all client tabs are closed.
                        // Execute callback
                        if (config && config.onUpdate) {
                            config.onUpdate(this.worker, event);
                        }
                    }
                    break
                case 'activated':
                    if (config && config.onSuccess) {
                        config.onSuccess(this.worker, event);
                    }
                    break
                default:
                    break
            }
        }
    }
}

export {
    PWAMessages,
    PWAService
}
