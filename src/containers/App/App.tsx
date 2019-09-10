import React, { Fragment } from "react"
import { Helmet } from 'react-helmet'
import { inject, provider, toFactory } from "react-ioc"
import { AuthService, CommentService, DataContext, PostService, RouterService, StorageService } from "services"

import { APP_STATE, AppService } from './AppService'

import styles from './styles.scss'
import { observer } from "mobx-react"


@observer
class AppContainer extends React.Component {

    @inject
    router: RouterService

    @inject
    appService: AppService

    async componentDidMount() {
        await this.appService.init()
    }

    appRender = (children?: JSX.Element) =>
        <Fragment>
            <header>Header</header>
            <main style={ { display: "flex", flexDirection: "column" } }>
                <aside style={ { display: "flex" } }>
                    <div className={ styles.link } onClick={ () => this.router.push('/') }>Index</div>
                    <div className={ styles.link } onClick={ () => this.router.push('/test') }>Test</div>
                </aside>
                <aside style={ { display: "flex" } }>
                    { children || this.props.children }
                </aside>
            </main>
        </Fragment>

    render() {
        let renderFn
        switch (this.appService.state) {
            case APP_STATE.pending:
                renderFn = () => <div> show preloader </div>
                break
            case APP_STATE.auth:
                renderFn = () => <div></div>
                break
            case APP_STATE.app:
                renderFn = () => this.appRender()
                break
            case APP_STATE.noMatch:
            case APP_STATE.quest:
            default:
                renderFn = () => <div>No match or quest</div>
                break
        }

        return (
            <Fragment>
                <Helmet>
                    <title>Title</title>
                    <meta name="description" content="some seo content"/>
                </Helmet>
                {
                    renderFn()
                }
            </Fragment>
        )
    }
}

const App = provider()(AppContainer)

App.register(
    AuthService, PostService, CommentService,
    StorageService, RouterService,
    AppService, [ DataContext, toFactory(DataContext.create)]
)

export { App }
