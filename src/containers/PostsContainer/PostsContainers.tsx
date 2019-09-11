import React, { Fragment } from "react"
import { PostList } from "components"
import { PostLayout } from "components/Post/PostLayout"
import { observer } from 'mobx-react-lite'

const PostsContainer = observer(() => (
    <Fragment>
        <aside style={ { margin: '1rem' } }>
            <PostList/>
        </aside>
        <main style={ { margin: '1rem', width: '100%' } }>
            <PostLayout/>
        </main>
    </Fragment>))

export { PostsContainer }
