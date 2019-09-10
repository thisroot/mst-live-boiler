import React from "react"
import { inject } from "react-ioc"
import { observer } from "mobx-react"
import { observable, action } from "mobx"
import ReactMarkdown from "react-markdown"
import { PostService } from "services"
import { Comment } from "models"
import { CommentView } from "./CommentView"
import { CommentEditor } from "./CommentEditor"

@observer
export class PostView extends React.Component {

    @inject
    postService: PostService

    @observable isCommentEditorOpen = false

    @action
    toggleCommentEditor() {
        this.isCommentEditorOpen = !this.isCommentEditorOpen
    }

    render() {
        const post = this.postService.currentPost
        return (
            <>
                <h1>{ post.title }</h1>
                <br/>
                <ReactMarkdown source={ post.body }/>
                <hr/>
                <div style={ { display: "flex" } }>
                    <div style={ { flex: "auto", margin: "auto 0" } }>
                        <strong>{ post.author.name }</strong>{ " " }
                        { post.date.toLocaleString().slice(0, -3) }
                    </div>
                    <div>
                        <button onClick={ () => this.postService.removePost(post) }>x</button>
                        { " " }
                        <button onClick={ () => this.toggleCommentEditor() }>Comment</button>
                        { " " }
                        <button onClick={ post.voteUp }>▲</button>
                        { post.rating }{ " " }
                        <button onClick={ post.voteDown }>▼</button>
                    </div>
                </div>
                <hr/>
                <br/>
                { this.isCommentEditorOpen && (
                    <CommentEditor
                        post={ post }
                        onClose={ () => this.toggleCommentEditor() }
                    />
                ) }
                <>
                    { post.comments
                        .slice()
                        .sort((a: Comment, b: Comment) => Number(a.date) - Number(b.date))
                        .map((comment: Comment) => (
                            <CommentView key={ comment.id } comment={ comment }/>
                        )) }
                </>
            </>
        )
    }
}
