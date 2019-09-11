import React, { Fragment } from "react"
import { CommentService, PostList, PostService } from "components"
import { PostLayout } from "components/Post/PostLayout"
import { observer } from 'mobx-react-lite'
import { provider } from "react-ioc"

const PostsContainer = provider()(observer(() => (
    <Fragment>
        <aside style={ { margin: '1rem' } }>
            <PostList/>
        </aside>
        <main style={ { margin: '1rem', width: '100%' } }>
            <PostLayout/>
        </main>
    </Fragment>)))

PostsContainer.register(CommentService, PostService)

export { PostsContainer }
