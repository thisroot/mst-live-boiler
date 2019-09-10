import { inject } from "react-ioc"
import { DataContext, AuthService, StorageService, RouterService } from "services"
import { action, observable } from "mobx"

enum APP_STATE {
    pending,
    app,
    auth,
    noMatch,
    quest
}

class AppService {

    @observable
    state: APP_STATE = APP_STATE.pending

    @inject
    protected storageService: StorageService
    @inject
    public dataContext: DataContext
    @inject
    public authService: AuthService
    @inject
    public routerService: RouterService

    @action
    init = async () => {
        this.storageService.init()
        // get route path
        // get user auth state
        this.state = APP_STATE.app
    }
}

export { AppService, APP_STATE }
