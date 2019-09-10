import React from "react";
import { inject } from "react-ioc"
import { observer } from "mobx-react";
import { PostService } from "services";
import { PostEditor } from "./PostEditor";
import { PostView } from "./PostView";

@observer
export class PostLayout extends React.Component {
  @inject
  postService: PostService

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
