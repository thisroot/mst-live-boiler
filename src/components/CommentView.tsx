import React from "react";
import { inject } from "react-ioc"
import { action, observable } from "mobx";
import { observer } from "mobx-react";
import ReactMarkdown from "react-markdown";
import { CommentService } from "services";
import { Comment } from "models";
import { CommentEditor } from "./CommentEditor";

@observer
export class CommentView extends React.Component<{ comment: Comment }> {

    // constructor(props, context) {
    //     super(props, context)
    //     this.commentService = context.commentService
    // }

    @inject
    commentService: CommentService

  @observable isCommentEditorOpen = false;

  @action
  toggleCommentEditor() {
    this.isCommentEditorOpen = !this.isCommentEditorOpen;
  }

  render() {
    const { comment } = this.props;
    return (
      <>
        <div style={{ display: "flex" }}>
          <div style={{ flex: "auto", margin: "auto 0" }}>
            <strong>{comment.author.name}</strong>{" "}
            {comment.date.toLocaleString().slice(0, -3)}
          </div>
          <div>
            <button onClick={() => this.toggleCommentEditor()}>Reply</button>{" "}
            <button onClick={comment.voteUp}>▲</button> {comment.rating}{" "}
            <button onClick={comment.voteDown}>▼</button>
          </div>
        </div>
        <ReactMarkdown source={comment.text} />
        {this.isCommentEditorOpen && (
          <CommentEditor
            comment={comment}
            onClose={() => this.toggleCommentEditor()}
          />
        )}
        <div style={{ paddingLeft: "20px" }}>
          {comment.comments
            .slice()
            .sort((a, b) => Number(a.date) - Number(b.date))
            .map((comment: Comment) => (
              <CommentView key={comment.id} comment={comment} />
            ))}
        </div>
      </>
    );
  }
}
