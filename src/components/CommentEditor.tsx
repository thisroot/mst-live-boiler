import React from "react";
import { inject } from "react-ioc";
import { action, observable } from "mobx";
import { observer } from "mobx-react";
import TextAreaAutosize from "react-textarea-autosize";
import { CommentService } from "../services";
import { Post, Comment } from "../models";

@observer
export class CommentEditor extends React.Component<{
  comment?: Comment;
  post?: Post;
  onClose(): void;
}> {

  constructor(props, context) {
    super(props, context)
    this.commentService = context.commentService
  }

  @inject commentService: CommentService

  @observable text = "";

  @action
  handleChange(e) {
    this.text = e.target.value;
  }

  @action
  handleSave() {
    const { post, comment, onClose } = this.props;
    if (post) {
      this.commentService.addComment(post, this.text);
    } else {
      this.commentService.addReply(comment, this.text);
    }
    onClose();
  }

  render() {
    return (
      <>
        <div style={{ display: "flex" }}>
          <TextAreaAutosize
            useCacheForDOMMeasurements
            placeholder="Type Markdown here..."
            minRows={2}
            value={this.text}
            onChange={e => this.handleChange(e)}
            style={{ flex: "auto", resize: "none" }}
          />
        </div>
        <br />
        <button onClick={() => this.handleSave()}>Save</button>{" "}
        <button onClick={this.props.onClose}>Cancel</button>
      </>
    );
  }
}
