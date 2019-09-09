import { inject, InjectorContext } from "react-ioc"
import { computed } from "mobx";
import { DataContext } from "./DataContext";
import { User } from "models";

export class AuthService {
  public dataContext: DataContext = inject(this, DataContext)
  static contextType = InjectorContext;

  @computed
  get currentUser(): User {
    return this.dataContext.users.get("23");
  }
}
