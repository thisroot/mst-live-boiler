import { DataContext, history } from 'services/DataContext'
import { action } from "mobx"
import { inject } from "react-ioc"

export class RouterService {
    @inject
    public dataContext: DataContext

    public history = history

    @action push(path: string) {
        this.dataContext.router.push(path)
    }
}
