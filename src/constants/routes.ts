// prefix for all project routes
const ROUTE_PREF = ''

interface Route {
    ROUTE: string
    PATH: string
    rights?: Array<any> // reserved tio special rights
    redirectTo?: (viewer, entity) => string | string
}

interface Routes {
    [key: string]: Route
}

interface StaticRoutes {
    [key: string]: string
}

const ROUTES: Routes = {
    ROOT: {
        ROUTE: '/',
        PATH: '/'
    },
    TEST_PAGE: {
        ROUTE: `${ROUTE_PREF}/test`,
        PATH: `${ROUTE_PREF}/test`
    },
    TEST_ENTITY: {
        ROUTE: `${ROUTE_PREF}/test/:entityId`,
        PATH: `${ROUTE_PREF}/test/{0}`
    }
}

export {
    ROUTES,
    Route,
    Routes,
    StaticRoutes
}
