import { schema } from "normalizr";

const UserSchema = new schema.Entity("users");

const CommentSchema = new schema.Entity("comments", {
  author: UserSchema
});

CommentSchema.define({ comments: [CommentSchema] });

const PostSchema = new schema.Entity("posts", {
  author: UserSchema,
  comments: [CommentSchema]
});

export { UserSchema, PostSchema, CommentSchema };
