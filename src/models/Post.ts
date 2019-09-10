import { types as t, Instance } from "mobx-state-tree";
import { User } from "./User";
import { Comment } from "./Comment";

export const Post = t
  .model("Post", {
    id: t.identifier,
    title: t.string,
    body: t.string,
    date: t.Date,
    rating: t.number,
    author: t.reference(User),
    comments: t.array(t.reference(Comment))
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

export type Post = Instance<typeof Post>;
