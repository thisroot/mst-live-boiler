import { inject } from "react-ioc";
import { normalize } from "normalizr";
import { getSnapshot, applySnapshot } from "mobx-state-tree";
import { PostSchema } from "../schemas";
import { DataContext } from "./DataContext";
import postsJson from "../posts.json";

export class StorageService {
  @inject dataContext: DataContext;

  init() {
    console.log('Init Storage')
    try {
      const snapshot = JSON.parse(localStorage.getItem("data"));
      applySnapshot(this.dataContext, { ...snapshot, router: this.dataContext.router });
      JSON.stringify(this.dataContext);
    } catch {
      this.reset();
    }
  }

  dispose() {
    localStorage.setItem("data", JSON.stringify(getSnapshot(this.dataContext)));
  }

  async reset() {
    const posts = this.parse(JSON.stringify(postsJson));
    const { entities } = normalize(posts, [PostSchema]);
    //TODO: отрефакторить сохранение данных роутера при сбросе моделей
    applySnapshot(this.dataContext, { ...entities, router: this.dataContext.router } );
  }

  parse(text: string) {
    return JSON.parse(text, (key, val) => {
      if (key === "id") return String(val);
      if (isIsoDateString(val)) return Number(new Date(val));
      return val;
    });
  }
}

function isIsoDateString(arg): arg is string {
  return typeof arg === "string" && dateRegex.test(arg);
}

const dateRegex = /^\d{4}-\d{2}-\d{2}(T| )\d{2}:\d{2}:\d{2}(\.\d+)?(Z|\+\d{2}:\d{2})?/;
