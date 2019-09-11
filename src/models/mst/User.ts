import { types as t, Instance } from "mobx-state-tree";

export const User = t.model("User", {
  id: t.identifier,
  name: t.string
});

export type User = Instance<typeof User>;
