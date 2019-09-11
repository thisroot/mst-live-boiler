import React, { Fragment } from "react"
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import { ROUTES } from "constants/routes"
import { formatString } from "utils/helpers"


const TestContainer: React.SFC<any> = observer((props) => {

    return (
        <Fragment>
            <Link to={ formatString(ROUTES.TEST_ENTITY.PATH, Math.random()) }>Сылочка</Link>
            <div>Test{ props.children }</div>
        </Fragment>)
})


export { TestContainer }
