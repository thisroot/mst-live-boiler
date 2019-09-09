import { DataContext, history } from './DataContext'
import { action } from "mobx"
import { inject } from "react-ioc"

export class RouterService {
    @inject dataContext: DataContext;

    public history = history

    @action push(path: string) {
        this.dataContext.router.push(path)
    }
}
