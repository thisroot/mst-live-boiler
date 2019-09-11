import React from "react"
import { inject } from "react-ioc"
import { observer } from "mobx-react"
import { action } from "mobx"
import TextAreaAutosize from "react-textarea-autosize"
import { PostService } from './PostService'

@observer
export class PostEditor extends React.Component {

    @inject
    postService: PostService


    @action
    handleChange(e, name: string) {
        this.postService.newPost[name] = e.target.value
    }

    render() {
        const { title, body } = this.postService.newPost
        return (
            <>
                <div style={ { display: "flex" } }>
                    <input
                        type="text"
                        placeholder="Title..."
                        value={ title }
                        style={ { flex: "auto" } }
                        onChange={ e => this.handleChange(e, "title") }
                    />
                </div>
                <br/>
                <div style={ { display: "flex" } }>
                    <TextAreaAutosize
                        useCacheForDOMMeasurements
                        placeholder="Type Markdown here..."
                        minRows={ 2 }
                        value={ body }
                        onChange={ e => this.handleChange(e, "body") }
                        style={ { flex: "auto", resize: "none" } }
                    />
                </div>
                <br/>
                <button onClick={ () => this.postService.publishPost() }>
                    Publish
                </button>
                { " " }
                <button onClick={ () => this.postService.clearPost() }>Cancel</button>
            </>
        )
    }
}
