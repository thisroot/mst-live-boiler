import { action } from "mobx";
import { inject, InjectorContext } from "react-ioc"
import { Post, Comment } from "../models";
import { DataContext } from "./DataContext";
import { AuthService } from "./AuthService";

export class CommentService {
  public dataContext: DataContext = inject(this, DataContext);
  public authService: AuthService = inject(this, AuthService)
  static contextType = InjectorContext;

  nextId = 1;

  @action
  addComment(post: Post, text: string) {
    post.addComment(this.createComment(text));
  }

  @action
  addReply(comment: Comment, text: string) {
    comment.addComment(this.createComment(text));
  }

  @action
  createComment(text: string) {
    const id = String(this.nextId++);
    const comment = Comment.create({
      id,
      text,
      rating: 0,
      date: new Date(),
      author: this.authService.currentUser.id,
      comments: []
    });
    this.dataContext.comments.put(comment);
    return comment;
  }
}
