import { Instance, unprotect } from "mobx-state-tree";
import Models from "../models";
import { connectReduxDevtools } from "mst-middlewares"
import { RouterModel, syncHistoryWithStore } from 'mst-react-router';

const createBrowserHistory = require('history').createBrowserHistory
export const routerModel = RouterModel.create();
export const history = syncHistoryWithStore(createBrowserHistory(), routerModel);

export class DataContext {
  static create() {
    const models = Models.create({ router: routerModel });
    connectReduxDevtools(require("remotedev"), models, { logArgsNearName: false})
    unprotect(models);
    return models;
  }
}
export interface DataContext extends Instance<typeof Models> {}
