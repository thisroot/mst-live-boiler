
const REGEXP = {
    date: /^\d{4}-\d{2}-\d{2}(T| )\d{2}:\d{2}:\d{2}(\.\d+)?(Z|\+\d{2}:\d{2})?/,
    urlHostname: /^((http|https):\/\/)?(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]).)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])(\/)?$/
}

// SERVICE WORKER SIGNAL CONSTANTS
enum PWAMessages {
    SET_ADDITIONAL_API_CACHED_RESOURCES = 'SET_ADDITIONAL_API_CACHED_RESOURCES',
    SET_MD_FILES_TO_CACHE = 'SET_MD_FILES_TO_CACHE',
    SET_ENVIRONMENTS_VARIABLES = 'SET_ENVIRONMENTS_VARIABLES'
}

enum SERVICE_WORKER_STATE {
    DISABLED = 'disabled',
    INSTALLING = 'installing',
    INSTALLED = 'installed',
    ACTIVATING = 'activating',
    ACTIVATED = 'activated'
}

export {
    REGEXP,
    PWAMessages,
    SERVICE_WORKER_STATE
}
