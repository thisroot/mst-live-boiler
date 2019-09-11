import React from "react";
import { inject } from "react-ioc"
import { observer } from "mobx-react";
import { PostService } from './PostService';
import { PostEditor } from "components/Post/PostEditor";
import { PostView } from "components/Post/PostView";

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