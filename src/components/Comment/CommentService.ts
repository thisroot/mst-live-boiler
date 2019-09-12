import { action } from "mobx";
import { inject } from "react-ioc"
import { Comment } from 'models/mst/Comment'
import { Post } from "models/mst/Post"
import { DataContext } from "services/DataContext";
import { AuthService } from "services/AuthService";

export class CommentService {
  @inject
  public dataContext: DataContext
  @inject
  public authService: AuthService

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
