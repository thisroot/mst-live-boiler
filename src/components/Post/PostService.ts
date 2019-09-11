import { inject } from "react-ioc"
import { action, observable } from "mobx";
import { Post } from "models";
import { DataContext } from "services/DataContext";
import { AuthService } from "services/AuthService";

class CreatePostModel {
  @observable title = "";
  @observable body = "";
}

export class PostService {
  @inject
  public dataContext: DataContext
  @inject
  public authService: AuthService

  @observable currentPost: Post = null;
  @observable newPost: CreatePostModel = null;

  nextId = 1;

  @action
  viewPost(post: Post) {
    this.currentPost = post;
  }

  @action
  addPost() {
    this.newPost = new CreatePostModel();
  }

  @action
  publishPost() {
    const id = String(this.nextId++);
    const post = Post.create({
      id,
      ...this.newPost,
      rating: 0,
      date: new Date(),
      author: this.authService.currentUser.id,
      comments: []
    });
    this.dataContext.posts.put(post);
    this.clearPost();
  }

  @action
  clearPost() {
    this.newPost = null;
  }

  @action
  removePost(post: Post) {
    if (this.currentPost === post) {
      this.currentPost = null;
    }
    this.dataContext.posts.delete(post.id);
  }
}
