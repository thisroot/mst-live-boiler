import React from "react"
import { observer } from 'mobx-react-lite'

const TestContainer: React.SFC<any> = observer((props) => <div>Test{ props.children }</div>)

export { TestContainer }
