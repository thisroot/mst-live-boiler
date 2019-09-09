import React, { Fragment } from "react"
import { Router } from 'react-router'
import { Route } from "react-router-dom"
import { provider, inject, InjectorContext } from "react-ioc"
import {
    StorageService,
    RouterService,
    history
} from "./services"

import { PostList } from "./components/PostList"
import { PostLayout } from "./components/PostLayout"

class App extends React.Component {

    public storageService: StorageService = inject(this, StorageService)
    public router: RouterService = inject(this, RouterService)

    static contextType = InjectorContext;


    // constructor(props, context) {
    //     super(props, context)
    //     console.log(props, context)
    //     this.storageService = context.storageService
    //     this.router = context.router
    // }

    componentDidMount() {
        this.storageService.init()
    }

    renderPosts = () => (
        <Fragment>
            <aside style={{ margin: '1rem'}}>
                <PostList/>
            </aside>
            <main style={{ margin: '1rem', width: '100%'}}>
                <PostLayout/>
            </main>
        </Fragment>)

    renderTest = () => <div>Test</div>

    render() {
        return (
            <Fragment>
                <Router history={ history }>
                    <div style={ { display: "flex", flexDirection: "column" } }>
                        <div style={ { display: "flex" } }>
                            <div style={ { margin: '1rem', cursor: 'pointer', border: '1px solid gray', padding: '0.5rem' } } onClick={ () => this.router.push('/') }>Index</div>
                            <div style={ { margin: '1rem', cursor: 'pointer', border: '1px solid gray', padding: '0.5rem' } } onClick={ () => this.router.push('/test') }>Test</div>
                        </div>
                        <div style={ { display: "flex" } }>
                            <Route path="/" exact component={ this.renderPosts }/>
                            <Route path="/test" exact component={ this.renderTest }/>
                        </div>
                    </div>
                </Router>
            </Fragment>
        )
    }
}

export default provider()(App)
