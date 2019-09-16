import { inject } from "react-ioc"
import { AuthService, DataContext, EventService, EventTypes, PWAService, RouterService, StorageService } from "services"
import { action, intercept, observable, observe } from "mobx"

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
    protected evetService: EventService

    @inject
    protected pwaService: PWAService

    @inject
    protected storageService: StorageService
    @inject
    public dataContext: DataContext
    @inject
    public authService: AuthService
    @inject
    public routerService: RouterService

    // способ подписки на события в других сервисах
    public disposer = intercept(this.pwaService, 'workerState', (change) => {
        console.log('легальный способ отследить изменение')
        return change
    })

    // еще один способ
    public disposer2 = observe(this.pwaService, (change) => {
        console.log(change)
    })

    @action
    init = async () => {
        this.pwaService.init()
        await this.storageService.init()
        this.state = APP_STATE.app
        // по сути этот сервис не нужен
        this.evetService.subscribe(EventTypes.cacheChanged, () => {
            console.log('тестируем ')
        }, this)
    }

    dispose = () => {
        this.disposer()
        this.disposer2()
        this.evetService.unsubscribe(EventTypes.cacheChanged, () => {
            console.log('тестируем ')
        }, this)
    }
}

export { AppService, APP_STATE }
