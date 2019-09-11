import React from "react"
import { inject } from "react-ioc"
import { observer } from "mobx-react"
import { DataContext, StorageService } from "services"
import { PostService } from "components/Post"

@observer
export class PostList extends React.Component {
    @inject
    dataContext: DataContext
    @inject
    postService: PostService
    @inject
    storageService: StorageService

    render() {
        const { currentPost } = this.postService
        const posts = [ ...this.dataContext.posts.values() ]
        return (
            <>
                <ul>
                    { posts
                        .slice()
                        .sort((a, b) => Number(a.date) - Number(b.date))
                        .map(post => (
                            <li
                                key={ post.id }
                                onClick={ () => this.postService.viewPost(post) }
                                style={ {
                                    display: "flex",
                                    background: post === currentPost ? "#ddd" : "inherit"
                                } }
                            >
                                <div style={ { flex: "auto" } }>{ post.title }</div>
                                <div style={ { flex: "none", width: "35px" } }>
                                    { post.rating } ▶
                                </div>
                            </li>
                        )) }
                </ul>
                <br/>
                <button onClick={ () => this.postService.addPost() }>
                    Add Post
                </button>
                { " " }
                <button onClick={ () => this.storageService.reset() }>Reset</button>
            </>
        )
    }
}
