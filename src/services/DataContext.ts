import { Instance, unprotect } from "mobx-state-tree";
import { Store } from "models/mst";
import { connectReduxDevtools } from "mst-middlewares"
import { RouterModel, syncHistoryWithStore } from 'mst-react-router';

const createBrowserHistory = require('history').createBrowserHistory
export const routerModel = RouterModel.create();
export const history = syncHistoryWithStore(createBrowserHistory(), routerModel);

export class DataContext {
  static create() {
    console.log('create')
    const models = Store.create({ router: routerModel });
    connectReduxDevtools(require("remotedev"), models, { logArgsNearName: false})
    unprotect(models);
    return models;
  }
}
export interface DataContext extends Instance<typeof Store> {}
