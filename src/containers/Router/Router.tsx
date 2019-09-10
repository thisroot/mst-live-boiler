import React, { Component } from 'react'
import { Router, Switch } from 'react-router'
import { Route } from "react-router-dom"
import { history } from "services"
import { App } from 'containers/App'
import { ROUTES } from 'constants/routes'
import { PostsContainer } from "containers/PostsContainer"
import { TestContainer } from "containers/TestContainer"
import { observer } from "mobx-react"
import { TestEntity } from "containers/TestContainer/TestEntity"


@observer
class RouterContainer extends Component {
    render() {
        return (
            <Router history={ history }>
               <App>
                    <Switch>
                        <Route path={ ROUTES.ROOT.ROUTE } exact component={ PostsContainer }/>
                        <Route path={ ROUTES.TEST_PAGE.ROUTE } >
                            <TestContainer>
                                <Switch>
                                    <Route exact path={ ROUTES.TEST_ENTITY.ROUTE } component={ TestEntity }/>
                                </Switch>
                            </TestContainer>
                        </Route>
                    </Switch>
                </App>
            </Router>
        )
    }
}

export { RouterContainer }
