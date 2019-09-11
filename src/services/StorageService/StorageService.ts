import { inject } from "react-ioc"
import { normalize } from "normalizr";
import { getSnapshot, applySnapshot } from "mobx-state-tree";
import { PostSchema } from "services/StorageService/schemas";
import { DataContext } from "services/DataContext";
import initDB from 'utils/indexedDB'
import postsJson from "services/StorageService/posts.json";
import { observable } from "mobx"
import { isNull } from "util"
import { isIsoDateString } from 'utils/helpers'

export class StorageService {
  @observable pending: boolean = true
  @observable wasInitialized: boolean = false
  @observable db: LocalForage = null
  @inject
  public dataContext: DataContext

  init = async () => {
    if(!this.wasInitialized) {
      this.pending = true
      try {
        this.db = await initDB()
        const snapshot = JSON.parse(await this.db.getItem("data"))
        if (isNull(snapshot)) {
          this.reset()
        } else {
          applySnapshot(this.dataContext, { ...snapshot, router: this.dataContext.router });
          JSON.stringify(this.dataContext);
        }
      } catch (e) {
        this.reset();
      }
    }
  }

  dispose = async () => {
    await this.db.setItem("data", JSON.stringify(getSnapshot(this.dataContext)));
  }

  reset = async () => {
    const posts = this.parse(JSON.stringify(postsJson));
    const { entities } = normalize(posts, [PostSchema]);
    //TODO: отрефакторить сохранение данных роутера при сбросе моделей
    applySnapshot(this.dataContext, { ...entities, router: this.dataContext.router } );
  }

  parse = (text: string) => {
    return JSON.parse(text, (key, val) => {
      if (key === "id") return String(val);
      if (isIsoDateString(val)) return Number(new Date(val));
      return val;
    });
  }
}
