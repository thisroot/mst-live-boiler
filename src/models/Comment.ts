import { types as t, Instance } from "mobx-state-tree";
import { User } from "./User";

export const Comment = t
  .model("Comment", {
    id: t.identifier,
    text: t.string,
    date: t.Date,
    rating: t.number,
    author: t.reference(User),
    comments: t.array(t.reference(t.late(() => Comment)))
  })
  .actions(self => ({
    voteUp() {
      self.rating++;
    },
    voteDown() {
      self.rating--;
    },
    addComment(comment: Comment) {
      self.comments.push(comment);
    }
  }));

export type Comment = Instance<typeof Comment>;
