import { DataContext, history } from './DataContext'
import { action } from "mobx"
import { inject, InjectorContext } from "react-ioc"

export class RouterService {
    public dataContext: DataContext = inject(this, DataContext);
    static contextType = InjectorContext;

    public history = history

    @action push(path: string) {
        this.dataContext.router.push(path)
    }
}
