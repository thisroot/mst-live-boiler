import { inject } from "react-ioc";
import { computed } from "mobx";
import { DataContext } from "./DataContext";
import { User } from "../models";

export class AuthService {
  @inject dataContext: DataContext;

  @computed
  get currentUser(): User {
    return this.dataContext.users.get("23");
  }
}
