import { inject } from "react-ioc"
import { computed } from "mobx";
import { DataContext } from "./DataContext";
import { User } from "models/mst";

export class AuthService {
  @inject
  public dataContext: DataContext

  @computed
  get currentUser(): User {
    return this.dataContext.users.get("23") || null
  }
}
