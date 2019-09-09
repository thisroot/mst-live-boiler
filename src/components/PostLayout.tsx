import React from "react";
import { inject, InjectorContext } from "react-ioc"
import { observer } from "mobx-react";
import { PostService } from "../services";
import { PostEditor } from "./PostEditor";
import { PostView } from "./PostView";

@observer
export class PostLayout extends React.Component {
  public postService: PostService = inject(this, PostService)
  static contextType = InjectorContext;

  // constructor(props, context) {
  //   super(props, context)
  //   this.postService = context.postService
  // }

  render() {
    const { currentPost, newPost } = this.postService;
    return newPost ? (
      <PostEditor />
    ) : currentPost ? (
      <PostView />
    ) : (
      `Please select or add new post!`
    );
  }
}
